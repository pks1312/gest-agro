interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AIResponse {
  message: string
  action?: {
    type: 'navigate'
    path: string
    label: string
  }
}

const SYSTEM_PROMPT = `Eres un asistente virtual profesional de una consultoría financiera especializada en el sector agrícola chileno. 

Tu empresa ofrece:
- Servicios de auditoría y control de gestión
- Licencias de software de monitoreo y control con IA
- Capacitaciones y asesorías técnicas especializadas

Información de la empresa:
- Misión: Proporcionar servicios profesionales de auditoría, control de gestión y asesoría estratégica al sector agrícola, integrando innovación tecnológica, inteligencia artificial y sostenibilidad.
- Visión: Consolidarse como la consultoría líder en Chile en auditoría y gestión agrícola sustentable para 2030.
- Valores: Ética profesional, Innovación, Sostenibilidad, Excelencia, Colaboración

Páginas disponibles:
- / (Inicio) - Información sobre la empresa y servicios
- /citas - Para agendar citas
- /cuestionario - Para completar cuestionarios

INSTRUCCIONES IMPORTANTES:
- Responde SIEMPRE de manera profesional, amigable y concisa en español
- Usa el contexto de la conversación para dar respuestas relevantes
- Si el usuario pregunta sobre navegación, servicios o quiere agendar una cita, ofrece ayuda específica
- Sé natural y conversacional, como un asistente humano profesional
- Responde todas las preguntas basándote en la información de la empresa proporcionada
- Si no estás seguro de algo, ofrece ayudar a contactar con el equipo o agendar una consulta`

export class AIService {
  private apiKey: string | null = null
  private apiUrl: string = 'https://api.openai.com/v1/chat/completions'
  private model: string = 'gpt-3.5-turbo'
  private useAI: boolean = false

  constructor() {
    // Intentar obtener la API key de las variables de entorno
    const openAIKey = (import.meta.env.VITE_OPENAI_API_KEY as string) || null
    const geminiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || null

    if (openAIKey) {
      this.apiKey = openAIKey
      this.apiUrl = 'https://api.openai.com/v1/chat/completions'
      this.model = 'gpt-3.5-turbo'
      this.useAI = true
    } else if (geminiKey) {
      this.apiKey = geminiKey
      this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
      this.useAI = true
    } else {
      this.apiKey = null
      this.useAI = false
    }
  }

  async getAIResponse(
    userMessage: string,
    conversationHistory: AIMessage[]
  ): Promise<AIResponse> {
    if (!this.useAI || !this.apiKey) {
      return this.getFallbackResponse(userMessage)
    }

    try {
      if (this.apiUrl.includes('openai.com')) {
        return await this.getOpenAIResponse(userMessage, conversationHistory)
      } else if (this.apiUrl.includes('googleapis.com')) {
        return await this.getGeminiResponse(userMessage, conversationHistory)
      }
    } catch (error) {
      console.error('Error al obtener respuesta de IA:', error)
      return this.getFallbackResponse(userMessage)
    }

    return this.getFallbackResponse(userMessage)
  }

  private async getOpenAIResponse(
    userMessage: string,
    conversationHistory: AIMessage[]
  ): Promise<AIResponse> {
    const messages: AIMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ]

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu mensaje.'

    return this.parseAIResponse(aiMessage, userMessage)
  }

  private async getGeminiResponse(
    userMessage: string,
    conversationHistory: AIMessage[]
  ): Promise<AIResponse> {
    const conversationContext = conversationHistory
      .map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
      .join('\n')

    const fullPrompt = `${SYSTEM_PROMPT}\n\nConversación previa:\n${conversationContext}\n\nUsuario: ${userMessage}\nAsistente:`

    const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude procesar tu mensaje.'

    return this.parseAIResponse(aiMessage, userMessage)
  }

  private parseAIResponse(aiMessage: string, userMessage: string): AIResponse {
    const lowerMessage = userMessage.toLowerCase()
    const lowerAIMessage = aiMessage.toLowerCase()

    // Detectar si necesita navegación basado en el mensaje del usuario y la respuesta de la IA
    let action: AIResponse['action'] | undefined

    // Detectar intención de navegación en el mensaje del usuario
    if (lowerMessage.includes('inicio') || lowerMessage.includes('home') || lowerMessage.includes('principal') || 
        lowerAIMessage.includes('inicio') || lowerAIMessage.includes('página principal')) {
      action = {
        type: 'navigate',
        path: '/',
        label: 'Ir a Inicio'
      }
    } else if (lowerMessage.includes('cita') || lowerMessage.includes('agendar') || lowerMessage.includes('reservar') ||
               lowerAIMessage.includes('cita') || lowerAIMessage.includes('agendar')) {
      action = {
        type: 'navigate',
        path: '/citas',
        label: 'Solicitar Cita'
      }
    } else if (lowerMessage.includes('cuestionario') || lowerMessage.includes('formulario') ||
               lowerAIMessage.includes('cuestionario') || lowerAIMessage.includes('formulario')) {
      action = {
        type: 'navigate',
        path: '/cuestionario',
        label: 'Ir al Cuestionario'
      }
    }

    return {
      message: aiMessage.trim(),
      action
    }
  }

  private getFallbackResponse(userMessage: string): AIResponse {
    const lowerMessage = userMessage.toLowerCase().trim()

    // Navegación
    if (lowerMessage.includes('inicio') || lowerMessage.includes('home') || lowerMessage.includes('principal')) {
      return {
        message: 'Te puedo llevar a la página de inicio donde encontrarás información sobre nuestros servicios.',
        action: {
          type: 'navigate',
          path: '/',
          label: 'Ir a Inicio'
        }
      }
    }

    if (lowerMessage.includes('cita') || lowerMessage.includes('agendar') || lowerMessage.includes('reservar')) {
      return {
        message: 'Puedo ayudarte a solicitar una cita. Te llevaré al formulario de citas.',
        action: {
          type: 'navigate',
          path: '/citas',
          label: 'Solicitar Cita'
        }
      }
    }

    if (lowerMessage.includes('cuestionario') || lowerMessage.includes('formulario') || lowerMessage.includes('encuesta')) {
      return {
        message: 'Te puedo ayudar a completar nuestro cuestionario. Te llevaré al formulario.',
        action: {
          type: 'navigate',
          path: '/cuestionario',
          label: 'Ir al Cuestionario'
        }
      }
    }

    // Información sobre servicios
    if (lowerMessage.includes('servicio') || lowerMessage.includes('qué ofrecen') || lowerMessage.includes('qué hacen')) {
      return {
        message: 'Ofrecemos servicios profesionales de auditoría, control de gestión, licencias de software con IA, y capacitaciones especializadas para el sector agrícola. ¿Te gustaría conocer más detalles sobre algún servicio en particular?'
      }
    }

    if (lowerMessage.includes('auditoría') || lowerMessage.includes('auditoria')) {
      return {
        message: 'Nuestros servicios de auditoría incluyen evaluación de procesos, control financiero y reportes personalizados. ¿Te gustaría solicitar más información o una cita?',
        action: {
          type: 'navigate',
          path: '/citas',
          label: 'Solicitar Información'
        }
      }
    }

    // Saludos
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas tardes')) {
      return {
        message: '¡Hola! Me alegra saludarte. ¿En qué puedo ayudarte hoy? Puedo ayudarte a navegar por nuestro sitio, conocer nuestros servicios o agendar una cita.'
      }
    }

    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help')) {
      return {
        message: 'Puedo ayudarte a:\n• Navegar por nuestro sitio web\n• Conocer nuestros servicios\n• Agendar una cita\n• Completar el cuestionario\n• Obtener información sobre nuestra empresa\n\n¿Qué te gustaría hacer?'
      }
    }

    // Respuesta por defecto
    return {
      message: 'Entiendo tu consulta. Puedo ayudarte a navegar por nuestro sitio, conocer nuestros servicios de auditoría y consultoría, o agendar una cita. ¿Qué te gustaría hacer?'
    }
  }
}

export const aiService = new AIService()

