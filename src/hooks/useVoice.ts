// ─── Voice Mode ─────────────────────────────────────────────────────────────
// Web Speech API integration for push-to-talk voice input and TTS output.
// Works in Electron (Chromium) and modern browsers. No server changes needed.

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseVoiceOptions {
  lang?: string           // e.g. 'en-US'
  continuous?: boolean     // keep listening after result
  interimResults?: boolean // show partial results
  onResult?: (text: string, isFinal: boolean) => void
  onError?: (error: string) => void
}

interface UseVoiceReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
  speak: (text: string) => void
  isSpeaking: boolean
  stopSpeaking: () => void
}

export function useVoice(options: UseVoiceOptions = {}): UseVoiceReturn {
  const { lang = 'en-US', continuous = false, interimResults = true, onResult, onError } = options
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) &&
    'speechSynthesis' in window

  useEffect(() => {
    if (!isSupported) return
    synthesisRef.current = window.speechSynthesis
  }, [isSupported])

  const startListening = useCallback(() => {
    if (!isSupported) return
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.continuous = continuous
    recognition.interimResults = interimResults

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = (e: any) => {
      setIsListening(false)
      onError?.(e.error)
    }
    recognition.onresult = (e: any) => {
      let finalTranscript = ''
      let interimTranscript = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }
      const current = finalTranscript || interimTranscript
      setTranscript(current)
      onResult?.(current, !!finalTranscript)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isSupported, lang, continuous, interimResults, onResult, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const speak = useCallback((text: string) => {
    if (!synthesisRef.current) return
    synthesisRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 1.0
    utterance.pitch = 1.0

    // Try to pick a good voice
    const voices = synthesisRef.current.getVoices()
    const preferred = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && v.localService)
      || voices.find(v => v.lang.startsWith(lang.split('-')[0]))
      || voices[0]
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthesisRef.current.speak(utterance)
  }, [lang])

  const stopSpeaking = useCallback(() => {
    synthesisRef.current?.cancel()
    setIsSpeaking(false)
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
      synthesisRef.current?.cancel()
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    speak,
    isSpeaking,
    stopSpeaking,
  }
}