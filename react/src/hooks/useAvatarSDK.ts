/**
 * Avatar SDK Hook
 * Encapsulates SDK initialization and usage logic
 */

import { useState, useRef, useEffect } from 'react'
import { AvatarKit, AvatarManager, AvatarView, Environment, type AvatarController, type ConnectionState, type AvatarState } from '@spatialwalk/avatarkit'

export function useAvatarSDK() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [avatarView, setAvatarView] = useState<AvatarView | null>(null)
  const [avatarController, setAvatarController] = useState<AvatarController | null>(null)
  const avatarManagerRef = useRef<AvatarManager | null>(null)
  const avatarViewRef = useRef<AvatarView | null>(null)

  // Initialize SDK
  const initialize = async (environment: Environment, sessionToken?: string) => {
    try {
      await AvatarKit.initialize('demo', { environment })
      
      if (sessionToken) {
        AvatarKit.setSessionToken(sessionToken)
      }

      const avatarManager = new AvatarManager()
      avatarManagerRef.current = avatarManager
      setIsInitialized(true)
    } catch (error) {
      throw new Error(`SDK initialization failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Load character
  const loadCharacter = async (
    characterId: string,
    container: HTMLElement,
    callbacks?: {
      onConnectionState?: (state: ConnectionState) => void
      onAvatarState?: (state: AvatarState) => void
      onError?: (error: Error) => void
    },
  ) => {
    if (!avatarManagerRef.current) {
      throw new Error('SDK not initialized')
    }

    try {
      // 1. Load Avatar
      const avatar = await avatarManagerRef.current.load(characterId)
      
      // 2. Create AvatarView
      const avatarView = new AvatarView(avatar, container)
      
      // 3. Set callbacks
      if (callbacks?.onConnectionState) {
        avatarView.avatarController.onConnectionState = callbacks.onConnectionState
      }
      if (callbacks?.onAvatarState) {
        avatarView.avatarController.onAvatarState = callbacks.onAvatarState
      }
      if (callbacks?.onError) {
        avatarView.avatarController.onError = callbacks.onError
      }

      setAvatarView(avatarView)
      avatarViewRef.current = avatarView
      setAvatarController(avatarView.avatarController)
    } catch (error) {
      throw new Error(`Failed to load character: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Connect service
  const connect = async () => {
    if (!avatarView?.avatarController) {
      throw new Error('Character not loaded')
    }

    await avatarView.avatarController.start()
  }

  // Send audio data
  const sendAudio = (audioData: ArrayBuffer, isFinal: boolean = false) => {
    if (!avatarController) {
      throw new Error('Character not loaded or not connected')
    }
    avatarController.send(audioData, isFinal)
  }

  // Interrupt conversation
  const interrupt = () => {
    if (!avatarController) {
      throw new Error('Character not loaded or not connected')
    }
    avatarController.interrupt()
  }

  // Disconnect
  const disconnect = async () => {
    if (avatarView?.avatarController) {
      avatarView.avatarController.close()
      // Don't clear avatarView and avatarController when disconnecting, allow reconnection
    }
  }

  // Unload character
  // ⚠️ Important: SDK currently only supports one character at a time. If you want to load a new character, you must unload the current one first
  const unloadCharacter = () => {
    if (avatarView) {
      avatarView.dispose() // Clean up all resources, including closing connection, releasing WASM resources, removing Canvas, etc.
      setAvatarView(null)
      avatarViewRef.current = null
      setAvatarController(null)
    }
  }

  // Cleanup resources (only executed on component unmount)
  useEffect(() => {
    return () => {
      // Clean up all resources when component unmounts
      if (avatarViewRef.current) {
        avatarViewRef.current.dispose()
      }
      // Clear avatarManagerRef when component unmounts
      if (avatarManagerRef.current) {
        avatarManagerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array, only executed on component unmount

  return {
    isInitialized,
    avatarView,
    avatarController,
    initialize,
    loadCharacter,
    connect,
    sendAudio,
    interrupt,
    disconnect,
    unloadCharacter,
  }
}

