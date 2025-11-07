/**
 * Audio processing utility functions
 */

/**
 * Resample audio data
 * @param {Float32Array} inputData - Input audio data
 * @param {number} fromSampleRate - Source sample rate
 * @param {number} toSampleRate - Target sample rate
 * @returns {Float32Array} Resampled audio data
 */
export function resampleAudio(inputData, fromSampleRate, toSampleRate) {
  if (fromSampleRate === toSampleRate) {
    return inputData
  }

  const ratio = fromSampleRate / toSampleRate
  const outputLength = Math.round(inputData.length / ratio)
  const outputData = new Float32Array(outputLength)

  for (let i = 0; i < outputLength; i++) {
    const index = i * ratio
    const indexFloor = Math.floor(index)
    const indexCeil = Math.min(indexFloor + 1, inputData.length - 1)
    const fraction = index - indexFloor

    // Linear interpolation
    outputData[i] = inputData[indexFloor] * (1 - fraction) + inputData[indexCeil] * fraction
  }

  return outputData
}

/**
 * Convert Float32Array audio data to Int16 PCM
 * @param {Float32Array} float32Data - Float32 format audio data
 * @returns {Int16Array} Int16 PCM format audio data
 */
export function convertToInt16PCM(float32Data) {
  const pcm16 = new Int16Array(float32Data.length)
  for (let i = 0; i < float32Data.length; i++) {
    // Limit to [-1, 1] range
    const s = Math.max(-1, Math.min(1, float32Data[i]))
    // Convert to Int16 range [-32768, 32767]
    pcm16[i] = Math.round(s * 32768)
  }
  return pcm16
}

/**
 * Convert Int16Array to Uint8Array (little-endian)
 * @param {Int16Array} int16Data - Int16 format audio data
 * @returns {Uint8Array} Uint8 format audio data
 */
export function convertToUint8Array(int16Data) {
  const uint8Array = new Uint8Array(int16Data.length * 2)
  const view = new DataView(uint8Array.buffer)
  for (let i = 0; i < int16Data.length; i++) {
    view.setInt16(i * 2, int16Data[i], true) // true means little-endian
  }
  return uint8Array
}

/**
 * Merge multiple Float32Array audio chunks
 * @param {Array<{data: Float32Array}>} chunks - Audio chunk array
 * @returns {Float32Array} Merged audio data
 */
export function mergeAudioChunks(chunks) {
  const totalSamples = chunks.reduce((sum, chunk) => sum + chunk.data.length, 0)
  const mergedFloat32 = new Float32Array(totalSamples)
  let offset = 0
  for (const chunk of chunks) {
    mergedFloat32.set(chunk.data, offset)
    offset += chunk.data.length
  }
  return mergedFloat32
}

