import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * 3D knowledge-graph "visual brain" — a faithful three.js port of the graph on
 * heylodestone.com. 1,225 category-coloured memory nodes laid out in three soft
 * clusters with a light force-relaxation pass, additive-blended glow, a starfield
 * + dust backdrop, auto-rotation, drag to rotate, and scroll to zoom.
 */

type CategoryKey = 'fact' | 'preference' | 'instruction' | 'note' | 'entity' | 'decision' | 'project'

interface CategoryMeta {
  hex: string
  rgb: [number, number, number]
  label: string
}

const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  fact: { hex: '#60A5FA', rgb: [96, 165, 250], label: 'Facts' },
  preference: { hex: '#34D399', rgb: [52, 211, 153], label: 'Preferences' },
  instruction: { hex: '#FBBF24', rgb: [251, 191, 36], label: 'Instructions' },
  note: { hex: '#A78BFA', rgb: [167, 139, 250], label: 'Notes' },
  entity: { hex: '#F472B6', rgb: [244, 114, 182], label: 'Entities' },
  decision: { hex: '#FB923C', rgb: [251, 146, 60], label: 'Decisions' },
  project: { hex: '#FCD34D', rgb: [252, 211, 77], label: 'Projects' },
}

const CATEGORY_ORDER: CategoryKey[] = [
  'fact',
  'preference',
  'instruction',
  'note',
  'entity',
  'decision',
  'project',
]

const LABELS: Record<CategoryKey, string[]> = {
  fact: 'Prefers concise answers.Lives in a midsize city.Works in software.Runs on coffee.Morning person most days.Has a rescue dog.Cycle commuter.Self-taught developer.Listens to podcasts.Reads before bed.Minimalist workspace.Bilingual.Cooks when stressed.Stargazer.Mechanical keyboard fan.Plant parent.History buff.Board game nights.Amateur photographer.Learns by building.Data-driven mindset.Values clean architecture.Cold brew enthusiast.Night owl when focused.Sketches diagrams.Trail runner.Tinkerer.Music while coding.Tea after 3pm.Inbox zero at end of day.Walks for thinking.Less is more philosophy.Naps strategically.Calendar is sacred.Deep work blocks daily.Batch notifications.Vacation means offline.Weather app obsessive.Writes to clarify thought.Stretch breaks every hour'.split('.'),
  preference: 'No meetings before 10am,Async over sync always,Bullet points over paragraphs,Show me the code,Skip the preamble,Direct feedback preferred,Docs over conversation,Terminal over GUI,Small PRs over large,Meaningful commit messages,Test coverage above 80%,Automate everything repetitive,Dark mode everything,TypeScript over JavaScript,Static types always,Readable over clever,Working software over docs,Iteration over perfection,Feature flags over long branches,Observability over debugging,Deploy early deploy often,Naming is the hardest problem,Console.log is valid,Git blame over asking,Linters on strict,Fast feedback loops,Open source over proprietary,Edge functions when possible,Serverless first,Postgres over document DBs,Component libraries over one-offs,Design systems from day one,Monorepo for related services,CI/CD not optional,Security headers always,Rate limit all public APIs'.split(','),
  instruction: 'Never deploy on Fridays,All PRs need review,Security audit monthly,Dependency updates weekly,No secrets in code ever,Incident reports within 1 hour,Customer replies under 2 hours,Blog post every two weeks,Invoice by the 5th,Team sync every Tuesday,Staging deploys automatically,Production needs manual approval,Rotate API keys quarterly,Daily backups at 3am,Squash before merge,Branch naming: feat/fix/chore,No force push to main,Tag releases with semver,On-call rotation weekly,Uptime target 99.9%,Database migrations before deploy,Test in staging first,Log everything structured,Alert on error rate spikes,Cache invalidation manually,Monitor all cron jobs,Retros every sprint,Code review within 4 hours,Standup every Monday,Access logs retained 90 days'.split(','),
  note: 'Runs on coffee.Oat milk latte fanatic.Dog is a very good boy.Cycling is therapy.Podcast queue never empty.Less is more.Plants need watering Tuesday.Takes things apart for fun.Weather app checked hourly.Learns best by teaching.Writes to think.Nap after 2pm if needed.Music while coding always.Tea after 4pm.Walks for problem solving.Stretches every hour.Inbox zero or chaos.Calendar is sacred.Meetings need agendas.Deep work blocks 10-12.Friday is focus day.Vacation means offline.Batch notifications.Email twice daily max.Sketches architecture on paper.Reads non-fiction before bed.Board game nights Fridays.Cooks when stressed.Cold brew in summer.Stargazing clears the mind'.split('.'),
  entity: 'Helios Labs.Meridian App.NightOwl Analytics.BreezeBook.Nimbus Cloud.Atlas Hosting.Forge CLI.Canvas Design.Signal Chat.Prism Analytics.Sentinel Monitoring.Relay Email.Vault Secrets.Pillar Auth.Compass Navigation.Summit Deploy.Lighthouse Status.Bridgehead API.Stratosphere CDN.Crest Payments.Reservoir DB.Flux Pipeline.Meridian Dashboard.Ember Alerts.Horizon Search.Keystone Config.Scaffold CLI.Catalyst Framework.Beacon Events.Mosaic Design'.split('.'),
  decision: 'Chose SSG over SSR for marketing.Migrated from document DB to relational.Picked utility-first CSS.Went with typed API layer.Moved to fast package manager.Switched to unified linter.Adopted monorepo structure.Selected edge CDN provider.Deployed on cloud VPS.Used schema validation library.Chose edge database.Adopted managed auth service.Picked transactional email provider.Cloudflare Zero Trust for security.Desktop app chose Electron framework.Intel dashboard runs containerized.Booking site on budget VPS.Payments via Stripe integration.Self-hosted search engine.Graph API over browser login.Docker over bare metal.Dark theme as default.Mobile-first design.Postgres over SQLite for production.SSG for blog, SSR for app.Accessibility-first approach'.split('.'),
  project: 'Desktop App v0.1.4,Community Server Launch,API Gateway v2,Marketing Website Redesign,Payment Integration,Intelligence Dashboard,Booking Platform,Brain Visualization,Context Switching Engine,Knowledge Graph System,Email Processing Pipeline,Lead Management API,Memory Page Redesign,Blog Static Generator,SEO Audit Framework,Client Onboarding Flow,Design System v2,Component Library,E-commerce Checkout Flow,Real-time Chat Module,Admin Dashboard v3,User Onboarding Experience,Data Export Tool,Notification System,Search Implementation,Rate Limiter Service,CI/CD Pipeline v2,Docs Site Overhaul,Performance Optimization,Analytics Dashboard'.split(','),
}

interface GNode {
  id: string
  label: string
  category: CategoryKey
  importance: number
  cluster: number
}
interface GEdge {
  source: string
  target: string
}
interface LayoutNode extends GNode {
  connections: number
  x: number
  y: number
  z: number
}

const PER_CATEGORY = 175

function buildGraph(): { nodes: GNode[]; edges: GEdge[] } {
  const nodes: GNode[] = []
  const edges: GEdge[] = []
  let n = 0
  CATEGORY_ORDER.forEach((cat, r) => {
    const labels = LABELS[cat]
    for (let a = 0; a < PER_CATEGORY; a++) {
      const label = a < labels.length ? labels[a] : `${cat}-${a}`
      nodes.push({
        id: `n${n++}`,
        label,
        category: cat,
        importance: 0.2 + Math.random() * 0.8,
        cluster: r,
      })
    }
  })
  // intra-cluster links
  CATEGORY_ORDER.forEach((_, r) => {
    const inCluster = nodes.filter((e) => e.cluster === r)
    for (let e = 0; e < inCluster.length; e++) {
      const count = 1 + Math.floor(Math.random() * 3)
      for (let k = 0; k < count; k++) {
        const j = e + 1 + Math.floor(Math.random() * Math.min(5, inCluster.length - e - 1))
        if (j < inCluster.length) edges.push({ source: inCluster[e].id, target: inCluster[j].id })
      }
    }
  })
  // ring + random cross-cluster links
  for (let i = 0; i < CATEGORY_ORDER.length; i++) {
    const next = (i + 1) % CATEGORY_ORDER.length
    const a = nodes.filter((e) => e.cluster === i)
    const b = nodes.filter((e) => e.cluster === next)
    const ring = 20 + Math.floor(Math.random() * 15)
    for (let e = 0; e < ring; e++) {
      edges.push({
        source: a[Math.floor(Math.random() * a.length)].id,
        target: b[Math.floor(Math.random() * b.length)].id,
      })
    }
    for (let r = 0; r < 3; r++) {
      const rc = Math.floor(Math.random() * CATEGORY_ORDER.length)
      if (rc !== i) {
        const c = nodes.filter((e) => e.cluster === rc)
        for (let e = 0; e < 8; e++) {
          edges.push({
            source: a[Math.floor(Math.random() * a.length)].id,
            target: c[Math.floor(Math.random() * c.length)].id,
          })
        }
      }
    }
  }
  return { nodes, edges }
}

function layout(nodesIn: GNode[], edges: GEdge[]): LayoutNode[] {
  const nodes: LayoutNode[] = nodesIn.map((e) => {
    const idx = CATEGORY_ORDER.indexOf(e.category)
    const r = idx >= 0 ? idx : 3
    const left = r < 3 // fact / preference / instruction
    const center = r === 3 || r === 4 // note / entity
    let x: number, y: number, z: number
    if (center) {
      x = (Math.random() - 0.5) * 4
      y = Math.random() * 2 + 1
      z = (Math.random() - 0.5) * 6
    } else {
      const base = left ? -5 : 5
      const t = Math.acos(2 * Math.random() - 1)
      const az = Math.random() * Math.PI * 2
      const rad = 3 + Math.random() * 4
      x = base + Math.cos(az) * Math.sin(t) * rad * 0.6
      y = Math.cos(t) * rad * 0.5 + (Math.random() - 0.5) * 1.5
      z = Math.sin(az) * Math.sin(t) * rad * 0.8
    }
    return {
      ...e,
      connections: edges.filter((g) => g.source === e.id || g.target === e.id).length,
      x,
      y,
      z,
    }
  })

  const byId = new Map(nodes.map((e) => [e.id, e]))
  const links = edges
    .map((e) => [byId.get(e.source), byId.get(e.target)] as [LayoutNode?, LayoutNode?])
    .filter(([a, b]) => a && b) as [LayoutNode, LayoutNode][]

  const grid = new Map<string, number[]>()
  const rebuild = () => {
    grid.clear()
    for (let i = 0; i < nodes.length; i++) {
      const k = `${Math.floor(nodes[i].x / 3)},${Math.floor(nodes[i].y / 3)},${Math.floor(nodes[i].z / 3)}`
      if (!grid.has(k)) grid.set(k, [])
      grid.get(k)!.push(i)
    }
  }
  rebuild()

  for (let iter = 0; iter < 15; iter++) {
    for (const cell of grid.values()) {
      for (let t = 0; t < cell.length; t++) {
        for (let r = t + 1; r < cell.length; r++) {
          const o = nodes[cell[t]]
          const s = nodes[cell[r]]
          const cx = o.x - s.x
          const cy = o.y - s.y
          const cz = o.z - s.z
          const d = cx * cx + cy * cy + cz * cz + 0.01
          if (d > 9) continue
          const f = Math.sqrt(d)
          const p = 0.3 / d
          o.x += (cx / f) * p
          o.y += (cy / f) * p
          o.z += (cz / f) * p
          s.x -= (cx / f) * p
          s.y -= (cy / f) * p
          s.z -= (cz / f) * p
        }
      }
    }
    for (const [e, t] of links) {
      const nx = t.x - e.x
      const ny = t.y - e.y
      const nz = t.z - e.z
      const a = Math.sqrt(nx * nx + ny * ny + nz * nz) + 0.01
      const o = a * 0.004
      e.x += (nx / a) * o
      e.y += (ny / a) * o
      e.z += (nz / a) * o
      t.x -= (nx / a) * o
      t.y -= (ny / a) * o
      t.z -= (nz / a) * o
    }
    for (const e of nodes) {
      e.x *= 0.998
      e.y *= 0.996
      e.z *= 0.998
    }
  }
  return nodes
}

function radialSprite(size: number, stops: [number, string][]) {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  for (const [o, col] of stops) g.addColorStop(o, col)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(c)
}

interface Hover {
  label: string
  category: CategoryKey
  x: number
  y: number
}

export default function KnowledgeGraph({
  className = '',
  interactive = true,
  starCount = 2000,
  dustCount = 2000,
  background = 0x050510,
}: {
  className?: string
  interactive?: boolean
  starCount?: number
  dustCount?: number
  background?: number
}) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [hover, setHover] = useState<Hover | null>(null)

  const { layoutNodes, edges } = useMemo(() => {
    const { nodes, edges } = buildGraph()
    return { layoutNodes: layout(nodes, edges), edges }
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || layoutNodes.length === 0) return

    let width = mount.clientWidth || 800
    let height = mount.clientHeight || 500

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(background)
    scene.fog = new THREE.FogExp2(background, 0.006)

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500)
    camera.position.set(0, 8, 22)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.maxDistance = 40
    controls.minDistance = 10
    controls.enablePan = false
    controls.enabled = interactive

    // accent lights (violet + cyan) + ambient — subtle scene warmth
    scene.add(new THREE.AmbientLight(0x223344, 0.3))
    const l1 = new THREE.PointLight(0x8b5cf6, 3, 120)
    l1.position.set(0, 10, 0)
    const l2 = new THREE.PointLight(0x06b6d4, 1.5, 80)
    l2.position.set(-15, -5, 15)
    scene.add(l1, l2)

    const starTex = radialSprite(64, [
      [0, 'rgba(255,255,255,1)'],
      [0.15, 'rgba(255,255,255,0.9)'],
      [0.4, 'rgba(255,255,255,0.4)'],
      [1, 'rgba(255,255,255,0)'],
    ])
    const glowTex = radialSprite(256, [
      [0, 'rgba(255,255,255,0.8)'],
      [0.08, 'rgba(255,255,255,0.35)'],
      [0.2, 'rgba(255,255,255,0.12)'],
      [0.4, 'rgba(255,255,255,0.04)'],
      [0.7, 'rgba(255,255,255,0.01)'],
      [1, 'rgba(255,255,255,0)'],
    ])

    // starfield
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 200
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 200
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3))
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        size: 0.3,
        map: starTex,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    )
    scene.add(stars)

    // dust
    if (dustCount > 0) {
      const dust = new Float32Array(dustCount * 3)
      for (let i = 0; i < dustCount; i++) {
        const cx = Math.random() < 0.15 ? 0 : Math.random() < 0.5 ? -1 : 1
        const rr = Math.random() * 8
        const t = Math.acos(2 * Math.random() - 1)
        const az = Math.random() * Math.PI * 2
        dust[i * 3] = cx * 5 + Math.cos(az) * Math.sin(t) * rr * 0.5
        dust[i * 3 + 1] = Math.cos(t) * rr * 0.3 + (Math.random() - 0.5)
        dust[i * 3 + 2] = Math.sin(az) * Math.sin(t) * rr * 0.6
      }
      const dustGeo = new THREE.BufferGeometry()
      dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dust, 3))
      scene.add(
        new THREE.Points(
          dustGeo,
          new THREE.PointsMaterial({
            size: 0.08,
            map: starTex,
            transparent: true,
            opacity: 0.15,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
          }),
        ),
      )
    }

    // node spheres (instanced) — crisp cores
    const inst = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 8, 8),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      layoutNodes.length,
    )
    inst.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(layoutNodes.length * 3), 3)
    const dummy = new THREE.Object3D()
    const colorArr = new Float32Array(layoutNodes.length * 3)
    const baseSizes: number[] = []
    layoutNodes.forEach((node, i) => {
      const meta = CATEGORIES[node.category] || CATEGORIES.note
      const r = Math.max(0.04, 0.02 + node.importance * 0.03 + node.connections * 0.005)
      baseSizes.push(r)
      dummy.position.set(node.x, node.y, node.z)
      dummy.scale.setScalar(r)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
      colorArr[i * 3] = (meta.rgb[0] / 255) * 0.6 + 0.4
      colorArr[i * 3 + 1] = (meta.rgb[1] / 255) * 0.6 + 0.4
      colorArr[i * 3 + 2] = (meta.rgb[2] / 255) * 0.6 + 0.4
    })
    inst.instanceColor.set(colorArr)
    inst.instanceColor.needsUpdate = true
    inst.instanceMatrix.needsUpdate = true
    scene.add(inst)

    // node glow points
    const glowPos = new Float32Array(layoutNodes.length * 3)
    const glowCol = new Float32Array(layoutNodes.length * 3)
    layoutNodes.forEach((node, i) => {
      glowPos[i * 3] = node.x
      glowPos[i * 3 + 1] = node.y
      glowPos[i * 3 + 2] = node.z
      const meta = CATEGORIES[node.category] || CATEGORIES.note
      glowCol[i * 3] = meta.rgb[0] / 255
      glowCol[i * 3 + 1] = meta.rgb[1] / 255
      glowCol[i * 3 + 2] = meta.rgb[2] / 255
    })
    const glowGeo = new THREE.BufferGeometry()
    glowGeo.setAttribute('position', new THREE.Float32BufferAttribute(glowPos, 3))
    glowGeo.setAttribute('color', new THREE.Float32BufferAttribute(glowCol, 3))
    scene.add(
      new THREE.Points(
        glowGeo,
        new THREE.PointsMaterial({
          size: 1.8,
          map: glowTex,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        }),
      ),
    )

    // edges
    const byId = new Map(layoutNodes.map((e) => [e.id, e]))
    const linePos: number[] = []
    const lineCol: number[] = []
    for (const e of edges) {
      const a = byId.get(e.source)
      const b = byId.get(e.target)
      if (!a || !b) continue
      linePos.push(a.x, a.y, a.z, b.x, b.y, b.z)
      const meta = CATEGORIES[a.category] || CATEGORIES.note
      const r = (meta.rgb[0] / 255) * 0.3
      const g = (meta.rgb[1] / 255) * 0.3
      const bl = (meta.rgb[2] / 255) * 0.3
      lineCol.push(r, g, bl, r, g, bl)
    }
    if (linePos.length > 0) {
      const lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
      lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineCol, 3))
      scene.add(
        new THREE.LineSegments(
          lineGeo,
          new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.25,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      )
    }

    // raycasting for hover
    const raycaster = new THREE.Raycaster()
    raycaster.params.Points = { threshold: 0.5 }
    const pointer = new THREE.Vector2()
    let hovered: number | null = null

    const onMove = (ev: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObject(inst)
      if (hits.length > 0 && hits[0].instanceId !== undefined) {
        hovered = hits[0].instanceId
        const node = layoutNodes[hovered]
        renderer.domElement.style.cursor = 'pointer'
        setHover({
          label: node.label,
          category: node.category,
          x: ev.clientX - rect.left,
          y: ev.clientY - rect.top,
        })
      } else {
        hovered = null
        renderer.domElement.style.cursor = interactive ? 'grab' : 'default'
        setHover(null)
      }
    }
    if (interactive) renderer.domElement.addEventListener('mousemove', onMove)

    const clock = new THREE.Clock()
    let raf = 0
    let running = true

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      stars.rotation.y = t * 0.005
      if (hovered !== null) {
        const node = layoutNodes[hovered]
        const s = baseSizes[hovered] * (2 + Math.sin(t * 5) * 0.5)
        dummy.position.set(node.x, node.y, node.z)
        dummy.scale.setScalar(s)
        dummy.updateMatrix()
        inst.setMatrixAt(hovered, dummy.matrix)
        inst.instanceMatrix.needsUpdate = true
      }
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!mountRef.current) return
      width = mountRef.current.clientWidth
      height = mountRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)

    // pause rendering when scrolled out of view
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries[0]?.isIntersecting ?? true
        if (vis && !running) {
          running = true
          animate()
        } else if (!vis && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0.01 },
    )
    io.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      if (interactive) renderer.domElement.removeEventListener('mousemove', onMove)
      controls.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      scene.traverse((obj) => {
        const any = obj as unknown as { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] }
        any.geometry?.dispose()
        if (Array.isArray(any.material)) any.material.forEach((m) => m.dispose())
        else any.material?.dispose()
      })
      starTex.dispose()
      glowTex.dispose()
    }
  }, [layoutNodes, edges, interactive, starCount, dustCount, background])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mountRef} className="absolute inset-0" />
      {hover && (
        <div
          className="pointer-events-none absolute z-10 px-2.5 py-1.5 rounded-lg bg-[var(--surface)]/95 backdrop-blur border border-[var(--border)] shadow-lg max-w-[220px]"
          style={{ left: Math.min(hover.x + 12, 9999), top: hover.y + 12 }}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: CATEGORIES[hover.category].hex }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORIES[hover.category].hex }} />
            {CATEGORIES[hover.category].label}
          </div>
          <div className="text-xs text-[var(--text)] leading-snug truncate">{hover.label}</div>
        </div>
      )}
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-[var(--text-dim)] whitespace-nowrap">
        {layoutNodes.length.toLocaleString()} memories · {edges.length.toLocaleString()} connections
        {interactive ? ' · Drag to rotate · Scroll to zoom' : ''}
      </div>
    </div>
  )
}
