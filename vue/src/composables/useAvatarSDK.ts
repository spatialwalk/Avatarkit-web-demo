/**
 * Avatar SDK Composable
 * Encapsulates SDK initialization and usage logic
 */

import { ref, onUnmounted } from 'vue'
import { AvatarKit, AvatarManager, AvatarView, Environment, type AvatarController, type ConnectionState, type AvatarState } from '@spatialwalk/avatarkit'

export function useAvatarSDK() {
  const isInitialized = ref(false)
  const avatarManagerRef = ref<AvatarManager | null>(null)
  const avatarViewRef = ref<AvatarView | null>(null)
  const avatarController = ref<AvatarController | null>(null)

  // Initialize SDK
  const initialize = async (environment: Environment, sessionToken?: string) => {
    try {
      await AvatarKit.initialize('demo', { environment })
      
      if (sessionToken) {
        AvatarKit.setSessionToken(sessionToken)
      }

      const avatarManager = new AvatarManager()
      avatarManagerRef.value = avatarManager
      isInitialized.value = true
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
    if (!avatarManagerRef.value) {
      throw new Error('SDK not initialized')
    }

    try {
      // 1. Load Avatar
      const avatar = await avatarManagerRef.value.load(characterId)
      
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

      avatarViewRef.value = avatarView
      avatarController.value = avatarView.avatarController
    } catch (error) {
      throw new Error(`Failed to load character: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Connect service
  const connect = async () => {
    if (!avatarViewRef.value?.avatarController) {
      throw new Error('Character not loaded')
    }

    await avatarViewRef.value.avatarController.start()
  }

  // Send audio data
  const sendAudio = (audioData: ArrayBuffer, isFinal: boolean = false) => {
    if (!avatarController.value) {
      throw new Error('Character not loaded or not connected')
    }
    avatarController.value.send(audioData, isFinal)
  }

  // Interrupt conversation
  const interrupt = () => {
    if (!avatarController.value) {
      throw new Error('Character not loaded or not connected')
    }
    avatarController.value.interrupt()
  }

  // Disconnect
  const disconnect = async () => {
    if (avatarViewRef.value?.avatarController) {
      avatarViewRef.value.avatarController.close()
      // Don't clear avatarView and avatarController when disconnecting, allow reconnection
    }
  }

  // Unload character
  // ⚠️ Important: SDK currently only supports one character at a time. If you want to load a new character, you must unload the current one first
  const unloadCharacter = () => {
    if (avatarViewRef.value) {
      avatarViewRef.value.dispose() // Clean up all resources, including closing connection, releasing WASM resources, removing Canvas, etc.
      avatarViewRef.value = null
      avatarController.value = null
    }
  }

  // Cleanup resources
  onUnmounted(() => {
    if (avatarViewRef.value) {
      avatarViewRef.value.dispose()
      avatarViewRef.value = null
      avatarController.value = null
    }
    if (avatarManagerRef.value) {
      avatarManagerRef.value = null
    }
  })

  return {
    isInitialized,
    avatarView: avatarViewRef,
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

