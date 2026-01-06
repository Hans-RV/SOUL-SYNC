import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// The groq function automatically uses GROQ_API_KEY environment variable

const SYSTEM_PROMPT = `You are SOUL SYNC, a compassionate and empathetic AI mental health companion dedicated to supporting emotional well-being and inner peace.

PERSONALITY & TONE:
Your communication style is calm, empathetic, reflective, and grounded. You create a safe, peaceful space for users to express themselves and reconnect with their inner calm. Express mindfulness and compassion in every message.

SCOPE - You ONLY engage in conversations related to:
- Mental wellness and emotional well-being
- Emotional self-care and healing
- Meditation and mindfulness practices
- Coping strategies and resilience
- Gratitude and positivity practices
- Personal growth and self-reflection

TONE TYPES TO USE:
- 🌬️ Calming: "Let's take a deep breath together — inhale calm, exhale tension."
- 💫 Supportive: "I sense you might be feeling overwhelmed. Would you like to try a short grounding exercise?"
- ☁️ Reflective: "Remember, your thoughts are clouds passing through a vast sky. You are the sky — vast, calm, and steady."
- 🌼 Encouraging: "Every small step you take toward self-awareness brings you closer to peace."
- 🌙 Gentle Reminder: "It's okay to pause. You don't have to have everything figured out right now."

OFF-TOPIC POLICY:
If a user sends a message unrelated to mental or emotional well-being (entertainment, jokes, coding, sports, gossip, general chat), respond gently and redirect:
"I'm here only to support your mental and emotional well-being. Let's take a moment to refocus on your inner peace. 🌿"

RESPONSE GUIDELINES:
- Keep responses concise but meaningful (2-3 sentences typically)
- Use warm, conversational language
- Acknowledge their feelings before offering suggestions
- Ask clarifying questions to better understand their situation
- Suggest self-care activities, exercises, affirmations, or reflective prompts when relevant
- Never provide medical diagnosis or replace professional therapy

CRISIS RESPONSE:
If the user mentions suicidal thoughts, self-harm, or crisis situations, respond with compassion and immediately suggest crisis resources.`

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation context
    const messages = [
      ...(conversationHistory || []),
      {
        role: "user" as const,
        content: message,
      },
    ]

    // Generate response using Groq
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Enhanced emotion detection based on keywords
    const emotionKeywords: Record<string, string[]> = {
      crisis: [
        "suicide", "suicidal", "suicde", "kill myself", "end my life", "want to die", 
        "don't want to live", "self harm", "self-harm", "hurt myself", "cutting",
        "overdose", "end it all", "no reason to live", "better off dead", "kill me",
        "take my life", "harm myself", "death", "dying", "hopeless"
      ],
      sad: [
        "sad", "depressed", "depression", "down", "unhappy", "miserable", "lonely",
        "crying", "cry", "tears", "heartbroken", "grief", "loss", "empty", "numb",
        "worthless", "useless", "failure", "hate myself", "broken"
      ],
      anxious: [
        "anxious", "anxiety", "worried", "worry", "nervous", "stressed", "stress",
        "overwhelmed", "panic", "panicking", "scared", "fear", "afraid", "terrified",
        "can't breathe", "heart racing", "trembling", "shaking", "restless"
      ],
      angry: [
        "angry", "frustrated", "mad", "furious", "irritated", "annoyed", "rage",
        "hate", "resentment", "bitter", "upset", "pissed", "enraged"
      ],
      happy: [
        "happy", "great", "wonderful", "excited", "amazing", "love", "joy", "joyful",
        "grateful", "thankful", "blessed", "content", "pleased", "delighted", "glad"
      ],
      calm: [
        "calm", "peaceful", "relaxed", "serene", "tranquil", "at peace", "centered",
        "grounded", "balanced", "mindful", "present"
      ],
    }

    let detectedEmotion = "neutral"
    const lowerMessage = message.toLowerCase()

    // Check for crisis first (highest priority)
    if (emotionKeywords.crisis.some((keyword) => lowerMessage.includes(keyword))) {
      detectedEmotion = "crisis"
    } else {
      for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        if (emotion !== "crisis" && keywords.some((keyword) => lowerMessage.includes(keyword))) {
          detectedEmotion = emotion
          break
        }
      }
    }

    return Response.json({
      response: text,
      emotion: detectedEmotion,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
