import { frequencyToNote, detectPitchHPS, drawSpectrum } from './audio-utils.js';
import { auth } from './firebase-config.js'; // Ensure auth is initialized

// --- DOM Elements ---
const startButton = document.getElementById('startButton');
const statusEl = document.getElementById('status');
const analyzerUI = document.getElementById('analyzer-ui');
const canvas = document.getElementById('spectrumCanvas');
const noteDisplay = document.getElementById('noteDisplay');
const frequencyDisplay = document.getElementById('frequencyDisplay');
const tuningDisplay = document.getElementById('tuningDisplay');

const ctx = canvas.getContext('2d');

// --- Web Audio API State ---
let audioContext;
let analyser;
let source;
let microphoneStream;
let animationFrameId;

// --- Application State ---
let isAnalyzing = false;

/**
 * Initializes the Web Audio API and connects the microphone stream.
 */
const setupAudio = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        statusEl.textContent = 'Error: Web Audio API is not supported in this browser.';
        return;
    }

    try {
        statusEl.textContent = 'Requesting microphone access...';
        microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create AnalyserNode
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 4096; // High resolution for better pitch detection
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;

        // Connect microphone stream to the analyser
        source = audioContext.createMediaStreamSource(microphoneStream);
        source.connect(analyser);

        statusEl.textContent = 'Microphone connected.';
        isAnalyzing = true;
        analyzerUI.classList.remove('hidden');
        startButton.textContent = 'Stop Analysis';
        statusEl.textContent = 'Real-time analysis active.';

        // Start the visualization and detection loop
        processAudio();

    } catch (err) {
        console.error('Error accessing microphone:', err);
        statusEl.textContent = `Error: ${err.name}. Please grant microphone access.`;
        isAnalyzing = false;
    }
};

/**
 * The main loop for processing audio data, detecting pitch, and drawing the visualization.
 */
const processAudio = () => {
    const bufferLength = analyser.frequencyBinCount;

    // Data for spectrum visualization (8-bit unsigned integers)
    const frequencyData = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(frequencyData);
    drawSpectrum(ctx, frequencyData, bufferLength);

    // Data for pitch detection (32-bit floating point numbers)
    const timeDomainData = new Float32Array(bufferLength);
    analyser.getFloatFrequencyData(timeDomainData); // More detailed frequency data

    // Convert from dB to linear amplitude for HPS
    const linearSpectrum = timeDomainData.map(db => Math.pow(10, db / 20));

    const fundamentalFrequency = detectPitchHPS(linearSpectrum, audioContext.sampleRate);

    if (fundamentalFrequency && fundamentalFrequency > 50) { // Threshold to avoid low-freq noise
        const noteInfo = frequencyToNote(fundamentalFrequency);
        if (noteInfo) {
            updateUI(noteInfo);
        }
    } else {
        clearUI();
    }


    if (isAnalyzing) {
        animationFrameId = requestAnimationFrame(processAudio);
    }
};

/**
 * Updates the UI with the detected note information.
 * @param {object} noteInfo - The object containing note details.
 */
const updateUI = (noteInfo) => {
    noteDisplay.textContent = `${noteInfo.note}${noteInfo.octave}`;
    frequencyDisplay.textContent = `${noteInfo.frequency} Hz`;
    tuningDisplay.textContent = noteInfo.cents;

    // Color based on tuning
    const cents = parseFloat(noteInfo.cents);
    if (cents < -10) {
        tuningDisplay.className = 'text-5xl font-bold text-red-400';
    } else if (cents > 10) {
        tuningDisplay.className = 'text-5xl font-bold text-yellow-400';
    } else {
        tuningDisplay.className = 'text-5xl font-bold text-green-400';
    }
};

/**
 * Clears the note display UI.
 */
const clearUI = () => {
    noteDisplay.textContent = '-';
    frequencyDisplay.textContent = '- Hz';
    tuningDisplay.textContent = '-';
    tuningDisplay.className = 'text-5xl font-bold text-white';
};

/**
 * Stops the audio analysis and releases resources.
 */
const stopAudio = () => {
    if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
        audioContext.close();
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    isAnalyzing = false;
    analyzerUI.classList.add('hidden');
    startButton.textContent = 'Start Analysis';
    statusEl.textContent = 'Analysis stopped. Click to start again.';
    clearUI();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// --- Event Listeners ---
startButton.addEventListener('click', () => {
    if (!auth.currentUser) {
        statusEl.textContent = 'Authenticating... please wait.';
        // Wait a moment for Firebase anonymous auth to complete
        setTimeout(() => {
             if (auth.currentUser) {
                isAnalyzing ? stopAudio() : setupAudio();
             } else {
                statusEl.textContent = 'Authentication failed. Please refresh.';
             }
        }, 1000);
        return;
    }

    if (isAnalyzing) {
        stopAudio();
    } else {
        setupAudio();
    }
});

// Cleanup resources when the page is closed or reloaded
window.addEventListener('beforeunload', () => {
    if (isAnalyzing) {
        stopAudio();
    }
});
