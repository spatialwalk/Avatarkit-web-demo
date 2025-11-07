# SPAvatarKit SDK Examples

SPAvatarKit practice demos in vanilla, Vue, and React

This is a complete SDK usage example collection demonstrating how to integrate and use the SPAvatarKit SDK in different frameworks.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Example List](#example-list)
- [Prerequisites](#prerequisites)
- [Usage Steps](#usage-steps)
- [Configuration](#configuration)
- [FAQ](#faq)

## 🚀 Quick Start

### 1. Clone or Download the Repository

```bash
# Clone the repository
git clone https://github.com/spatialwalk/Avatarkit-web-demo.git
cd Avatarkit-web-demo

# Or download the ZIP file and extract it
```

### 2. Choose an Example and Install Dependencies

```bash
cd vanilla  # or react, vue
npm install
```

### 3. Ensure SDK is Installed

Examples require the `@spatialwalk/avatarkit` SDK to be installed:

```bash
npm install @spatialwalk/avatarkit
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Access the Example Pages

- **Vanilla JS**: http://localhost:5174/demo.html
- **Vue 3**: http://localhost:5175
- **React**: http://localhost:5176

### 6. Start Using

1. Enter the character ID in the interface
2. (Optional) Enter Session Token (if server requires authentication)
3. Click "Initialize SDK"
4. Click "Load Character"
5. Click "Connect Service"
6. Click "Start Recording" and start speaking
7. Observe the character's real-time animation effects

## 📦 Example List

### 1. Vanilla JS Example (`vanilla/`)

Native JavaScript example with no framework dependencies.

**Use Cases:**
- Rapid prototyping
- Framework-independent projects
- Learning basic SDK usage

**Run:**
```bash
cd vanilla
npm install
npm run dev
```

**Access:** `http://localhost:5174/demo.html`

**Features:**
- Pure JavaScript, no framework dependencies
- Simple and intuitive code structure
- Suitable for quick learning and testing

### 2. Vue 3 Example (`vue/`)

Complete example using Vue 3 Composition API.

**Use Cases:**
- Vue 3 project integration
- Reactive state management needed
- Component-based development

**Run:**
```bash
cd vue
npm install
npm run dev
```

**Access:** `http://localhost:5175`

**Features:**
- Vue 3 Composition API
- TypeScript support
- Reactive data binding

### 3. React Example (`react/`)

Complete example using React Hooks.

**Use Cases:**
- React project integration
- Functional programming style needed
- Modern React development

**Run:**
```bash
cd react
npm install
npm run dev
```

**Access:** `http://localhost:5176`

**Features:**
- React Hooks
- TypeScript support
- Functional components

## ⚙️ Prerequisites

Before running the examples, ensure the following requirements are met:

- **Node.js** >= 16.0.0
- **npm/yarn/pnpm** package manager
- **Modern browser** (supports Web Audio API, WebSocket, WASM)
  - Chrome >= 90
  - Firefox >= 88
  - Safari >= 14.1
  - Edge >= 90
- **Microphone permission** (for recording functionality)
- **SDK package** installed (run `npm install @spatialwalk/avatarkit` in the example directory)

## 📝 Usage Steps

All examples follow the same basic flow:

1. **Initialize SDK** - Configure environment and authentication
   - Select environment (US/CN/Test)
   - (Optional) Enter Session Token

2. **Enter Character ID** - Specify the character to load
   - Get character ID from SDK management platform

3. **Load Character** - Download and initialize character resources
   - SDK will automatically download character models and textures
   - Display loading progress

4. **Connect Service** - Establish WebSocket connection
   - Connect to real-time animation service
   - Wait for successful connection

5. **Start Recording** - Capture audio and send to server
   - Browser will request microphone permission
   - Start speaking, audio data will be collected
   - When stopping recording, all audio data will be processed and sent to server
   - Server will start playing animation and audio after receiving complete audio data
   - **Note**: Recording is just a demonstration method. In actual applications, you can obtain audio data from any source (such as audio files, streaming media, etc.)

6. **Real-time Rendering** - Receive animation data and render to Canvas
   - Character will generate animations based on audio in real-time
   - You can see character's mouth, expressions, and other animations

## 🔧 Configuration

### Environment Configuration

Examples support three environments:

- **`test`** - Test environment (default)
- **`us`** - US production environment
- **`cn`** - China production environment

### Session Token (Optional)

If the server requires authentication, provide a valid Session Token:

- Enter Session Token in the interface
- Or configure via code (check source code of each example)

### Character ID

Character ID can be obtained from the SDK management platform and is used to identify the virtual character to load.

## 🔧 Technical Details

- **SDK Import**: All examples use standard npm package import `import('@spatialwalk/avatarkit')`
- **Animation Data**: FLAME parameter keyframe sequences
- **Audio Data Source**: Microphone recording in examples is for demonstration only. In actual applications, any audio source can be used (files, streaming media, synthesized audio, etc.)
- **WASM Support**: All examples are configured with correct WASM MIME types
- **Rendering Backend**: Automatically selects WebGPU or WebGL

## ❓ FAQ

### Q: How to get Session Token?

A: Session Token needs to be obtained from the SDK provider. Please contact the SDK provider or check the main SDK documentation for more information.

### Q: Can't see the character after running the example?

A: Please check the following:
- Is the character ID correct?
- Is the network connection normal?
- Are there any error messages in the browser console?
- Has the character been successfully loaded? (Check the log panel)

### Q: Recording function not working?

A: Ensure:
- Browser has granted microphone permission
- Using HTTPS or localhost (required by some browsers)
- Check browser console for error messages

### Q: WebSocket connection failed?

A: Possible reasons:
- Network connection issues
- Session Token invalid or expired
- Server address configuration error
- Check browser console for error messages

### Q: How to install SDK?

A: Install via npm:
```bash
npm install @spatialwalk/avatarkit
```

### Q: Which browsers are supported?

A: All modern browsers are supported:
- Chrome >= 90
- Firefox >= 88
- Safari >= 14.1
- Edge >= 90

### Q: Can it run on mobile devices?

A: Yes, but requires:
- Mobile browser supporting Web Audio API
- HTTPS connection (for microphone permission)
- Sufficient performance to run 3D rendering

### Q: How to modify the port number?

A: Modify the `server.port` configuration in each example's `vite.config.ts`.

## 📚 More Information

- Check the `README.md` in each example directory for detailed instructions
- Check the example source code for specific implementation details
- If you have questions, please submit a [GitHub Issue](https://github.com/spatialwalk/Avatarkit-web-demo/issues)
