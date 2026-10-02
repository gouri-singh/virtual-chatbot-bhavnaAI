// Speech Synthesis (TTS) & Speech Recognition (STT) Manager for Bhavna AI

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.currentUtterance = null;
    this.voices = [];
    this.defaultVoiceGender = 'female'; // 'female' or 'male'
    this.speechRate = 1.0;
    this.speechPitch = 1.0;

    this.initVoices();
    this.initRecognition();
  }

  initVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      this.voices = this.synth.getVoices();
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  getVoiceByGender(gender = 'female') {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) this.voices = this.synth.getVoices();
    }
    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : this.voices;

    const lowerGender = gender.toLowerCase();
    if (lowerGender === 'female') {
      // Find female voice names (Zira, Samantha, Victoria, Google UK English Female, etc.)
      const femaleVoice = pool.find(v => 
        /female|zira|samantha|victoria|karen|fiona|veena|google UK English Female|google US English/i.test(v.name)
      );
      return femaleVoice || pool[0] || null;
    } else {
      // Find male voice names (David, George, Alex, Mark, Google UK English Male, etc.)
      const maleVoice = pool.find(v => 
        /male|david|george|alex|mark|daniel|richard|rishi|google UK English Male/i.test(v.name)
      );
      return maleVoice || pool[1] || pool[0] || null;
    }
  }

  speak(text, options = {}) {
    if (!this.synth) return false;
    this.stop(); // Stop any ongoing speech

    // Strip emojis, markdown, and map Bhavna -> Bhavana for phonetic voice reading
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{200D}\u{FE0F}]/gu, '')
      .replace(/[*_#`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\bBhavna\b/gi, 'Bhavana')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const gender = options.gender || this.defaultVoiceGender;
    const selectedVoice = this.getVoiceByGender(gender);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = options.rate || this.speechRate;
    utterance.pitch = options.pitch || (gender === 'female' ? 1.1 : 0.9);

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }

  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }

  initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  startListening({ onResult, onError, onEnd, onStart }) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser environment.');
      return false;
    }

    this.stop(); // stop TTS if speaking

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (onResult) {
        onResult({
          final: finalTranscript,
          interim: interimTranscript,
          full: finalTranscript || interimTranscript
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      if (onError) onError(e.message);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechService();
