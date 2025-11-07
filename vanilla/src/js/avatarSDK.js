/**
 * SDK wrapper
 * Manages SDK initialization, character loading, and connection state
 */

/**
 * SDK manager class
 */
export class AvatarSDKManager {
  constructor(logger) {
    this.logger = logger
    this.AvatarKit = null
    this.AvatarManager = null
    this.AvatarView = null
    this.avatarManager = null
    this.avatarView = null
    this.isInitialized = false
    this.isConnected = false
    this.avatarState = null
  }

  /**
   * Load SDK
   * @returns {Promise<boolean>} Whether loading succeeded
   */
  async loadSDK() {
    try {
      this.logger.info('Loading SDK...')
      // Use npm-installed SDK
      const sdk = await import('@spatialwalk/avatarkit')
      this.AvatarKit = sdk.AvatarKit
      this.AvatarManager = sdk.AvatarManager
      this.AvatarView = sdk.AvatarView
      this.logger.success('SDK loaded successfully')
      return true
    } catch (error) {
      this.logger.error('SDK loading failed, please ensure SDK is built', error)
      this.logger.info('Tip: Run npm run build to build SDK')
      return false
    }
  }

  /**
   * Initialize SDK
   * @param {string} environment - Environment (us, cn, test)
   * @param {string} sessionToken - Session Token (optional)
   * @returns {Promise<void>}
   */
  async initialize(environment, sessionToken = null) {
    if (!this.AvatarKit || !this.AvatarManager) {
      const loaded = await this.loadSDK()
      if (!loaded) {
        throw new Error('SDK not loaded')
      }
    }

    this.logger.info('Starting SDK initialization')
    this.logger.info(`Using environment: ${environment}`)

    await this.AvatarKit.initialize('demo', {
      environment,
      logLevel: 'basic',
    })

    if (sessionToken) {
      this.AvatarKit.setSessionToken(sessionToken)
      this.logger.info('Session Token set')
    }

    this.avatarManager = this.AvatarManager.shared
    this.isInitialized = true
    this.logger.success('SDK initialized successfully')
  }

  /**
   * Load character
   * @param {string} characterId - Character ID
   * @param {HTMLElement} canvasContainer - Canvas container
   * @param {Function} onConnectionState - Connection state callback
   * @param {Function} onAvatarState - Avatar state callback
   * @param {Function} onError - Error callback
   * @returns {Promise<void>}
   */
  async loadCharacter(characterId, canvasContainer, onConnectionState, onAvatarState, onError) {
    if (!characterId.trim()) {
      throw new Error('Please enter character ID')
    }

    this.logger.info(`Starting to load character: ${characterId}`)

    const avatar = await this.avatarManager.load(characterId, (progress) => {
      this.logger.info(`Loading progress: ${progress.type} ${progress.progress ? `(${progress.progress}%)` : ''}`)
    })

    this.logger.success('Character loaded successfully', { id: avatar.id, name: avatar.name })

    // Create view
    this.avatarView = new this.AvatarView(avatar, canvasContainer)

    if (this.avatarView.avatarController) {
      this.avatarView.avatarController.onConnectionState = (state) => {
        this.logger.info(`Connection state: ${state}`)
        this.isConnected = state === 'connected'
        if (onConnectionState) {
          onConnectionState(state)
        }
      }

      this.avatarView.avatarController.onAvatarState = (state) => {
        this.avatarState = state
        this.logger.info(`Avatar state: ${state}`)
        if (onAvatarState) {
          onAvatarState(state)
        }
      }

      this.avatarView.avatarController.onError = (error) => {
        this.logger.error(`Error: ${error.message}`, error)
        if (onError) {
          onError(error)
        }
      }
    }

    this.logger.success('Character view created')
  }

  /**
   * Connect service
   * @returns {Promise<void>}
   */
  async connect() {
    if (!this.avatarView?.avatarController) {
      throw new Error('Character not loaded')
    }

    this.logger.info('Starting to connect WebSocket service')
    await this.avatarView.avatarController.start()
    this.logger.success('Connection request sent')
  }

  /**
   * Interrupt conversation
   */
  interrupt() {
    if (!this.avatarView?.avatarController) {
      throw new Error('Character not loaded')
    }
    if (!this.isConnected) {
      throw new Error('Not connected to service')
    }
    this.avatarView.avatarController.interrupt()
    this.logger.info('Current conversation interrupted')
  }

  /**
   * Disconnect
   */
  async disconnect() {
    if (this.avatarView?.avatarController) {
      this.avatarView.avatarController.close()
      this.logger.info('Connection closed')
    }
    this.isConnected = false
  }

  /**
   * Unload character
   * ⚠️ Important: SDK currently only supports one character at a time. If you want to load a new character, you must unload the current one first
   */
  unloadCharacter() {
    if (this.avatarView) {
      this.avatarView.dispose() // Clean up all resources, including closing connection, releasing WASM resources, removing Canvas, etc.
      this.avatarView = null
      this.isConnected = false
      this.avatarState = null
      this.logger.info('Character unloaded, can reload new character')
    }
  }

  /**
   * Send audio data
   * @param {ArrayBuffer} audioData - Audio data
   * @param {boolean} isFinal - Whether this is the final data chunk
   */
  sendAudio(audioData, isFinal = false) {
    if (!this.avatarView?.avatarController) {
      throw new Error('Character not loaded or not connected')
    }
    this.avatarView.avatarController.send(audioData, isFinal)
  }
}

