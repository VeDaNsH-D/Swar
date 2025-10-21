// --- Core Constants ---
const A4 = 440;
const C0 = A4 * Math.pow(2, -4.75);
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const HPS_HARMONICS = 5; // Number of harmonics for HPS algorithm

/**
 * Converts a frequency in Hz to a musical note object.
 * @param {number} frequency - The frequency in Hz.
 * @returns {object|null} An object with note name, octave, frequency, and cents deviation, or null if invalid.
 */
export function frequencyToNote(frequency) {
    if (frequency <= 0) return null;

    const halfStepsFromC0 = Math.round(12 * Math.log2(frequency / C0));
    const octave = Math.floor(halfStepsFromC0 / 12);
    const noteIndex = halfStepsFromC0 % 12;

    if (octave < 0 || octave > 8) return null; // Practical range limit

    const noteName = NOTE_NAMES[noteIndex];
    const expectedFrequency = C0 * Math.pow(2, halfStepsFromC0 / 12);
    const cents = 1200 * Math.log2(frequency / expectedFrequency);

    return {
        note: noteName,
        octave: octave,
        frequency: frequency.toFixed(2),
        cents: cents.toFixed(2),
    };
}


/**
 * Implements the Harmonic Product Spectrum (HPS) algorithm to find the fundamental frequency.
 * This method is more robust against noise and harmonics than simple peak detection.
 * @param {Float32Array} spectrum - The FFT spectrum data.
 * @param {number} sampleRate - The audio context's sample rate.
 * @returns {number} The estimated fundamental frequency in Hz.
 */
export function detectPitchHPS(spectrum, sampleRate) {
    const frameSize = spectrum.length;
    const downsampledLength = Math.floor(frameSize / HPS_HARMONICS);
    const hpsSpectrum = new Float32Array(downsampledLength);

    // Initialize HPS spectrum with the original spectrum values
    for (let i = 0; i < downsampledLength; i++) {
        hpsSpectrum[i] = spectrum[i];
    }

    // Multiply by downsampled versions
    for (let harmonic = 2; harmonic <= HPS_HARMONICS; harmonic++) {
        for (let i = 0; i < downsampledLength; i++) {
            hpsSpectrum[i] *= spectrum[i * harmonic];
        }
    }

    // Find the peak in the HPS spectrum
    let maxAmp = 0;
    let maxIndex = 0;
    for (let i = 0; i < downsampledLength; i++) {
        if (hpsSpectrum[i] > maxAmp) {
            maxAmp = hpsSpectrum[i];
            maxIndex = i;
        }
    }

    // Convert the index to frequency
    const fundamentalFrequency = maxIndex * (sampleRate / frameSize);
    return fundamentalFrequency;
}

/**
 * Draws the frequency spectrum on a canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {Uint8Array} dataArray - The frequency data from the AnalyserNode.
 * @param {number} bufferLength - The length of the data array.
 */
export function drawSpectrum(ctx, dataArray, bufferLength) {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#00ffff'); // Cyan
    gradient.addColorStop(0.5, '#00aaff');
    gradient.addColorStop(1, '#0055ff'); // Blue

    ctx.fillStyle = gradient;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;

        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}
