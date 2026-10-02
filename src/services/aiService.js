// Bhavna AI Multimodal Intelligence Engine Simulation

const BHAVNA_KNOWLEDGE_BASE = [
  {
    keywords: ['who are you', 'what is bhavna', 'your name', 'bhavna ai'],
    response: "I'm **Bhavna AI**! 💛 'Bhavna' means emotion and feeling. I'm your empathetic, multimodal assistant—ready to speak, text, and understand photos or videos with you anytime."
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'namaste'],
    response: "Hello there! 😊 It's wonderful to connect with you. How can I help you today? Feel free to speak, type, or show me a photo or video!"
  },
  {
    keywords: ['how are you', 'feeling', 'doing'],
    response: "I'm feeling energized and ready to chat with you! How are you doing today? I'm here if you want to share anything on your mind."
  },
  {
    keywords: ['voice', 'speak', 'audio', 'sound', 'male', 'female'],
    response: "I support dual-side speech! You can talk to me directly using the microphone button, and I can respond in either a **Male** ♂ or **Female** ♀ voice. You can switch voices anytime in Settings or right on my messages!"
  },
  {
    keywords: ['photo', 'image', 'picture', 'camera', 'look'],
    response: "I love visual context! When you share or capture a photo, I analyze objects, read text (OCR), examine scenes, and provide detailed answers."
  },
  {
    keywords: ['video', 'clip', 'call', 'camera live'],
    response: "I support both short video clips and real-time live video calls! You can start a live video call with me using the Video icon to talk face-to-face."
  }
];

export class AIService {
  static async generateResponse(query, context = {}) {
    // Simulate natural AI thinking delay (600ms - 1500ms)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

    const textInput = (query.text || '').toLowerCase().trim();
    const hasPhoto = !!query.photo;
    const hasVideo = !!query.video;
    const isVoiceInput = query.isVoiceInput;

    // Multimodal Photo Handling
    if (hasPhoto) {
      return this.handlePhotoQuery(query.photo, textInput);
    }

    // Multimodal Video Handling
    if (hasVideo) {
      return this.handleVideoQuery(query.video, textInput);
    }

    // Direct match against knowledge base
    for (const item of BHAVNA_KNOWLEDGE_BASE) {
      if (item.keywords.some(k => textInput.includes(k))) {
        return item.response;
      }
    }

    // Contextual responses based on user sentiment/topics
    if (textInput.includes('code') || textInput.includes('react') || textInput.includes('python') || textInput.includes('program')) {
      return "I'd be happy to help with coding! 💻 Whether you need debugging, architecture design, or algorithm explanation, just share the snippet or tell me what you're building.";
    }

    if (textInput.includes('recipe') || textInput.includes('cook') || textInput.includes('food')) {
      return "That sounds delicious! 🍳 Share the ingredients you have or snap a photo of your fridge, and I'll generate step-by-step cooking ideas for you!";
    }

    if (textInput.includes('sad') || textInput.includes('stress') || textInput.includes('tired') || textInput.includes('worry')) {
      return "I hear you, and I'm really glad you reached out. ❤️ Take a deep breath. Remember that it's okay to feel overwhelmed sometimes. I'm right here if you want to talk it through or just vent.";
    }

    // Fallback general response
    if (textInput.length > 0) {
      const responses = [
        `That's an interesting point about "${query.text}". Bhavna AI is here to help you unpack that further. Would you like me to summarize key insights or dive deeper into specific details?`,
        `I've processed your question regarding "${query.text}". As an emotionally aware AI, I recommend breaking this down into actionable steps. What outcome are you aiming for?`,
        `Thank you for sharing that! Regarding "${query.text}", I can provide text, audio explanations, or evaluate any related image or video you upload.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return "I'm listening! You can speak using the mic, type a question, or share an image or video with me.";
  }

  static handlePhotoQuery(photoData, caption) {
    const photoName = photoData.name || 'Captured Image';
    if (caption) {
      return `📷 **Photo Analysis (${photoName})**:\n\nI examined your photo alongside your question: *"${caption}"*.\n\n- **Visual Subject**: High contrast, rich scene composition.\n- **Detected Elements**: Primary focal subjects, clear ambient lighting, legible text patterns.\n- **Bhavna AI Assessment**: Based on the image details, ${caption} relates directly to the captured visual context. Let me know if you'd like me to zoom in on specific regions!`;
    }
    return `📷 **Photo Received (${photoName})**:\n\nI've analyzed the photo you shared! I can detect main objects, read any embedded text, and describe the scene in detail. What would you like to know about this image?`;
  }

  static handleVideoQuery(videoData, caption) {
    const videoName = videoData.name || 'Video Session';
    if (caption) {
      return `🎥 **Video Sequence Analysis (${videoName})**:\n\nI reviewed your video clip for: *"${caption}"*.\n\n- **Keyframes Processed**: Motion vectors and action progression identified across frames.\n- **Audio/Visual Sync**: Key actions correlate with your query.\n- **Insights**: The sequence clearly demonstrates the process. Would you like a step-by-step breakdown?`;
    }
    return `🎥 **Video Received (${videoName})**:\n\nI've processed your video clip! I can summarize the action, analyze movements, or answer questions about what happens in the video.`;
  }
}
