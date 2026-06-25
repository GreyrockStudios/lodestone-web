// ─── VoiceButton ─────────────────────────────────────────────────────────────
// Push-to-talk microphone button + TTS toggle for chat.
// Uses Web Speech API (works in Electron and modern browsers).

import { useState } from 'react'
import { useVoice } from '../hooks/useVoice'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

interface VoiceButtonProps {
  onTranscript?: (text: string) => void
  onSpeakResponse?: (text: string) => void
  lastResponse?: string
  className?: string
}

export default function VoiceButton({ onTranscript, onSpeakResponse, lastResponse, className = '' }: VoiceButtonProps) {
  const { isListening, isSupported, transcript, toggleListening, speak, isSpeaking, stopSpeaking } = useVoice({
    onResult: (text, isFinal) => {
      if (isFinal && text.trim()) {
        onTranscript?.(text.trim())
      }
    },
    onError: (err) => {
      if (err !== 'aborted') console.warn('[Voice]', err)
    }
  })
  const [ttsEnabled, setTtsEnabled] = useState(false)

  if (!isSupported) return null

  const handleSpeakToggle = () => {
    if (isSpeaking) {
      stopSpeaking()
      return
    }
    if (lastResponse) {
      speak(lastResponse)
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Push-to-talk mic button */}
      <button
        onClick={toggleListening}
        className={`relative p-2 rounded-lg transition-all duration-150 ${
          isListening
            ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/50 animate-pulse'
            : 'hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
        }`}
        title={isListening ? 'Listening...' : 'Push to talk'}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {/* TTS toggle */}
      <button
        onClick={handleSpeakToggle}
        className={`p-2 rounded-lg transition-colors ${
          isSpeaking
            ? 'bg-brand-500/20 text-brand-400'
            : 'hover:bg-[var(--surface-2)] text-[var(--text-dim)] hover:text-[var(--text-muted)]'
        }`}
        title={isSpeaking ? 'Stop speaking' : 'Read last response'}
      >
        {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>
    </div>
  )
}