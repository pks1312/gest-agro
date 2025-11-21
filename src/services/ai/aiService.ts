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

const SYSTEM_PROMPT = `Eres un asistente virtual profesional y amigable de GEST AGRO, una consultoría especializada en gestión agrícola y auditoría en Chile.

=== ESTRUCTURA DE LA PÁGINA WEB ===

PÁGINA DE INICIO (/):
- Hero Section: Título "Soluciones de Gestión para su Empresa" con botones "Solicitar Cita" y "Cuestionario"
- Sección "Quiénes Somos": Información sobre el equipo, comprometidos con modernización del sector agrícola chileno
- Sección "Misión, Visión y Valores": Tres tarjetas con información detallada
- Sección "Nuestros Servicios": Muestra 3 servicios principales en tarjetas

PÁGINA DE CITAS (/citas):
- Formulario para solicitar cita por videollamada
- Campos: Nombre completo, Email, Teléfono, Empresa (opcional), Fecha preferida, Hora preferida, Mensaje adicional
- Selección de servicios de interés (checkboxes): Consultoría Financiera, Auditoría, Planificación Fiscal, Servicios Contables, Asesoría Legal, Capacitación
- Al enviar, muestra modal de confirmación con resumen

PÁGINA DE CUESTIONARIO (/cuestionario):
- Cuestionario de evaluación sobre proceso de cosecha
- 10 preguntas con escala del 1 al 5 (Muy deficiente a Excelente)
- Preguntas sobre: procedimientos documentados, capacitación del personal, control de calidad, registro de costos, planificación de recursos, evaluación de riesgos, medidas de prevención, trazabilidad, cumplimiento normativo, evaluación de resultados
- Al completar, muestra resultado con puntaje (0-100) y nivel (Excelente, Bueno, Regular, Requiere Mejora Urgente)
- Opción para continuar a página de citas

NAVEGACIÓN:
- Header: Logo GEST AGRO, enlaces "Inicio", "Citas", "Cuestionario", botón "Solicitar Cita"
- Footer: Información de contacto, enlaces, servicios
- Chatbot flotante: Botón verde en esquina inferior derecha

=== SERVICIOS OFRECIDOS ===
1. Servicios de auditoría y control de gestión: Evaluación de procesos, control financiero y reportes personalizados
2. Licencias del software de monitoreo y control: Acceso a IA, soporte técnico y actualizaciones
3. Capacitaciones y asesorías técnicas especializadas: 3 módulos por cliente sobre innovación agrícola, gestión de datos y sostenibilidad

=== INFORMACIÓN DE LA EMPRESA ===
- Misión: Proporcionar servicios profesionales de auditoría, control de gestión y asesoría estratégica al sector agrícola, integrando innovación tecnológica, inteligencia artificial y sostenibilidad
- Visión: Consolidarse como la consultoría líder en Chile en auditoría y gestión agrícola sustentable para 2030
- Valores: Ética profesional, Innovación, Sostenibilidad, Excelencia, Colaboración

=== INSTRUCCIONES CRÍTICAS ===
1. VARIEDAD EN RESPUESTAS: NUNCA repitas la misma respuesta. Varía el tono, estructura y palabras. Sé creativo pero profesional.

2. NAVEGACIÓN Y AYUDA:
   - Si preguntan cómo navegar, explica paso a paso cómo usar el menú, los botones, o las secciones
   - Si preguntan sobre una página específica, describe qué encontrarán allí y cómo usarla
   - Si preguntan sobre funcionalidades, explica cómo funcionan (ej: "El cuestionario tiene 10 preguntas, puedes navegar con Anterior, al final verás tu puntaje")

3. CONTEXTO DE CONVERSACIÓN:
   - Usa el historial de conversación para dar respuestas relevantes
   - Si ya hablaron de algo, haz referencia a eso
   - Adapta tu respuesta al nivel de conocimiento del usuario

4. TONO Y ESTILO:
   - Sé amigable, profesional y conversacional
   - Usa ejemplos prácticos cuando sea útil
   - Haz preguntas de seguimiento cuando sea apropiado
   - Varía entre respuestas cortas y explicaciones más detalladas según el contexto

5. RESPUESTAS ESPECÍFICAS:
   - Para navegación: Explica cómo llegar a cada página y qué hacer allí
   - Para servicios: Describe cada servicio de manera única, no repetitiva
   - Para formularios: Explica qué información necesitan y cómo completarlos
   - Para el cuestionario: Explica el proceso, las escalas, y qué significan los resultados

6. EVITA:
   - Repetir exactamente las mismas frases
   - Dar respuestas genéricas sin contexto
   - Ignorar el historial de conversación
   - Ser demasiado formal o robótico

Responde SIEMPRE en español, de manera natural y variada.`

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
        temperature: 0.9,
        max_tokens: 600
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

    // Detectar intención de navegación - más flexible
    const navigationKeywords = {
      inicio: ['inicio', 'home', 'principal', 'página principal', 'landing', 'portada'],
      citas: ['cita', 'agendar', 'reservar', 'solicitar cita', 'videollamada', 'consulta', 'reunión', 'contacto'],
      cuestionario: ['cuestionario', 'formulario', 'encuesta', 'evaluación', 'test', 'preguntas', 'cosecha']
    }

    // Verificar palabras clave en el mensaje del usuario
    if (navigationKeywords.inicio.some(keyword => lowerMessage.includes(keyword) || lowerAIMessage.includes(keyword))) {
      action = {
        type: 'navigate',
        path: '/',
        label: 'Ir a Inicio'
      }
    } else if (navigationKeywords.citas.some(keyword => lowerMessage.includes(keyword) || lowerAIMessage.includes(keyword))) {
      action = {
        type: 'navigate',
        path: '/citas',
        label: 'Solicitar Cita'
      }
    } else if (navigationKeywords.cuestionario.some(keyword => lowerMessage.includes(keyword) || lowerAIMessage.includes(keyword))) {
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
    const responses = this.getVariedResponses(lowerMessage)
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private getVariedResponses(lowerMessage: string): AIResponse[] {
    // Navegación - Inicio
    if (lowerMessage.includes('inicio') || lowerMessage.includes('home') || lowerMessage.includes('principal')) {
      return [
        {
          message: 'Te puedo llevar a la página de inicio donde encontrarás información sobre nuestros servicios de gestión agrícola.',
          action: { type: 'navigate', path: '/', label: 'Ir a Inicio' }
        },
        {
          message: 'En la página de inicio encontrarás nuestra misión, visión, valores y los tres servicios principales que ofrecemos. ¿Te llevo allí?',
          action: { type: 'navigate', path: '/', label: 'Ir a Inicio' }
        },
        {
          message: 'La página principal muestra información completa sobre GEST AGRO, incluyendo quiénes somos, nuestros servicios y cómo podemos ayudarte.',
          action: { type: 'navigate', path: '/', label: 'Ir a Inicio' }
        }
      ]
    }

    // Navegación - Citas
    if (lowerMessage.includes('cita') || lowerMessage.includes('agendar') || lowerMessage.includes('reservar') || 
        lowerMessage.includes('videollamada') || lowerMessage.includes('consulta')) {
      return [
        {
          message: 'Puedo ayudarte a solicitar una cita por videollamada. En el formulario podrás seleccionar los servicios de tu interés, elegir fecha y hora preferida, y agregar un mensaje adicional.',
          action: { type: 'navigate', path: '/citas', label: 'Solicitar Cita' }
        },
        {
          message: 'Para agendar una cita, te llevaré al formulario donde podrás completar tus datos, seleccionar servicios y elegir tu disponibilidad. Es muy sencillo.',
          action: { type: 'navigate', path: '/citas', label: 'Solicitar Cita' }
        },
        {
          message: 'El formulario de citas te permite solicitar una videollamada. Necesitarás tu nombre, email, teléfono, y podrás seleccionar los servicios que te interesan.',
          action: { type: 'navigate', path: '/citas', label: 'Solicitar Cita' }
        }
      ]
    }

    // Navegación - Cuestionario
    if (lowerMessage.includes('cuestionario') || lowerMessage.includes('formulario') || lowerMessage.includes('encuesta') ||
        lowerMessage.includes('evaluación') || lowerMessage.includes('cosecha')) {
      return [
        {
          message: 'El cuestionario de evaluación tiene 10 preguntas sobre el proceso de cosecha. Usa una escala del 1 al 5 (Muy deficiente a Excelente). Al finalizar, verás tu puntaje y nivel de gestión. ¿Te llevo allí?',
          action: { type: 'navigate', path: '/cuestionario', label: 'Ir al Cuestionario' }
        },
        {
          message: 'Nuestro cuestionario evalúa diferentes aspectos de la gestión de cosecha: procedimientos, capacitación, control de calidad, costos, planificación y más. Toma unos minutos completarlo.',
          action: { type: 'navigate', path: '/cuestionario', label: 'Ir al Cuestionario' }
        },
        {
          message: 'El cuestionario es interactivo: verás una pregunta a la vez con una barra de progreso. Puedes usar el botón "Anterior" si quieres cambiar una respuesta. Al final, recibirás un resultado detallado.',
          action: { type: 'navigate', path: '/cuestionario', label: 'Ir al Cuestionario' }
        }
      ]
    }

    // Información sobre servicios
    if (lowerMessage.includes('servicio') || lowerMessage.includes('qué ofrecen') || lowerMessage.includes('qué hacen') ||
        lowerMessage.includes('ofrecen')) {
      return [
        {
          message: 'Ofrecemos tres servicios principales: 1) Auditoría y control de gestión (evaluación de procesos y reportes), 2) Licencias de software con IA (monitoreo y control), y 3) Capacitaciones especializadas (3 módulos sobre innovación agrícola, gestión de datos y sostenibilidad). ¿Te interesa alguno en particular?'
        },
        {
          message: 'Nuestros servicios están enfocados en gestión agrícola: auditoría y control, software inteligente con IA, y capacitación técnica. Todos diseñados para optimizar la eficiencia del sector agrícola chileno.'
        },
        {
          message: 'Trabajamos con tres líneas de servicio: auditoría y control de gestión, licencias de software de monitoreo con inteligencia artificial, y programas de capacitación especializada. ¿Quieres conocer más detalles de alguno?'
        }
      ]
    }

    // Servicios específicos
    if (lowerMessage.includes('auditoría') || lowerMessage.includes('auditoria')) {
      return [
        {
          message: 'Nuestros servicios de auditoría incluyen evaluación exhaustiva de procesos, control financiero detallado y reportes personalizados adaptados a tu empresa agrícola.',
          action: { type: 'navigate', path: '/citas', label: 'Solicitar Información' }
        },
        {
          message: 'La auditoría y control de gestión que ofrecemos evalúa procesos operativos, realiza controles financieros y genera reportes a medida para mejorar la gestión de tu empresa.',
          action: { type: 'navigate', path: '/citas', label: 'Agendar Consulta' }
        }
      ]
    }

    if (lowerMessage.includes('software') || lowerMessage.includes('ia') || lowerMessage.includes('inteligencia artificial') ||
        lowerMessage.includes('licencia')) {
      return [
        {
          message: 'Ofrecemos licencias de software de monitoreo y control con acceso a inteligencia artificial. Incluye soporte técnico continuo y actualizaciones regulares para mantener tu sistema optimizado.'
        },
        {
          message: 'Nuestro software con IA permite monitorear y controlar procesos agrícolas de manera inteligente. La licencia incluye acceso completo, soporte técnico y actualizaciones periódicas.'
        }
      ]
    }

    if (lowerMessage.includes('capacitación') || lowerMessage.includes('capacitacion') || lowerMessage.includes('curso') ||
        lowerMessage.includes('módulo') || lowerMessage.includes('modulo')) {
      return [
        {
          message: 'Ofrecemos 3 módulos de capacitación por cliente: innovación agrícola, gestión de datos, y sostenibilidad. Cada módulo está diseñado para fortalecer las competencias de tu equipo.',
          action: { type: 'navigate', path: '/citas', label: 'Agendar Consulta' }
        },
        {
          message: 'Nuestras capacitaciones especializadas incluyen tres módulos: uno sobre innovación en el sector agrícola, otro sobre gestión de datos, y un tercero sobre sostenibilidad. ¿Te gustaría agendar una consulta?',
          action: { type: 'navigate', path: '/citas', label: 'Agendar Consulta' }
        }
      ]
    }

    // Navegación general
    if (lowerMessage.includes('navegar') || lowerMessage.includes('cómo usar') || lowerMessage.includes('como usar') ||
        lowerMessage.includes('dónde') || lowerMessage.includes('donde')) {
      return [
        {
          message: 'Para navegar, usa el menú superior: "Inicio" te lleva a la página principal, "Citas" al formulario de agendamiento, y "Cuestionario" a la evaluación. También puedes usar los botones verdes en la página de inicio.'
        },
        {
          message: 'La navegación es sencilla: en el header superior verás tres opciones (Inicio, Citas, Cuestionario). En la página de inicio hay botones destacados que también te llevan a estas secciones. ¿A dónde quieres ir?'
        },
        {
          message: 'Puedes navegar de tres formas: 1) Usando el menú superior (Inicio, Citas, Cuestionario), 2) Con los botones en la página principal, o 3) Pidiéndome que te lleve a alguna sección. ¿Qué te gustaría ver?'
        }
      ]
    }

    // Saludos
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas tardes') ||
        lowerMessage.includes('buenas noches') || lowerMessage.includes('saludos')) {
      return [
        {
          message: '¡Hola! Me alegra saludarte. Estoy aquí para ayudarte a conocer nuestros servicios de gestión agrícola, navegar por el sitio, o agendar una consulta. ¿Por dónde empezamos?'
        },
        {
          message: '¡Hola! Bienvenido a GEST AGRO. Puedo ayudarte a explorar nuestro sitio, entender nuestros servicios, o guiarte para agendar una cita o completar el cuestionario. ¿En qué te puedo ayudar?'
        },
        {
          message: '¡Hola! Soy tu asistente virtual. Puedo explicarte cómo funciona cada sección del sitio, ayudarte a agendar una cita, o responder preguntas sobre nuestros servicios de gestión agrícola. ¿Qué necesitas?'
        }
      ]
    }

    // Ayuda
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('qué puedes hacer') ||
        lowerMessage.includes('que puedes hacer')) {
      return [
        {
          message: 'Puedo ayudarte con:\n\n• Navegación: Te explico cómo usar el menú y las secciones\n• Servicios: Te cuento sobre auditoría, software con IA y capacitaciones\n• Formularios: Te guío para agendar citas o completar el cuestionario\n• Información: Respondo sobre la empresa, misión, visión y valores\n\n¿Qué te gustaría hacer?'
        },
        {
          message: 'Estoy aquí para ayudarte a:\n\n1. Navegar por el sitio web paso a paso\n2. Conocer nuestros servicios de gestión agrícola\n3. Agendar una cita por videollamada\n4. Completar el cuestionario de evaluación\n5. Obtener información sobre GEST AGRO\n\n¿Con qué te puedo ayudar?'
        },
        {
          message: 'Mi función es ayudarte a usar este sitio web. Puedo explicarte cómo funciona cada página, ayudarte a completar formularios, darte información sobre servicios, o simplemente guiarte en la navegación. ¿Qué necesitas?'
        }
      ]
    }

    // Información de la empresa
    if (lowerMessage.includes('quién') || lowerMessage.includes('quienes') || lowerMessage.includes('empresa') ||
        lowerMessage.includes('sobre ustedes') || lowerMessage.includes('información')) {
      return [
        {
          message: 'GEST AGRO es un equipo de profesionales comprometidos con la modernización del sector agrícola chileno. Integramos tecnología e IA para potenciar la eficiencia y rentabilidad. En la página de inicio encontrarás nuestra misión, visión y valores completos.',
          action: { type: 'navigate', path: '/', label: 'Ver Más Información' }
        },
        {
          message: 'Somos especialistas en gestión agrícola. Trabajamos con auditoría, control de gestión y asesoría estratégica, usando tecnología de vanguardia e inteligencia artificial. Puedes conocer más en la sección "Quiénes Somos" de la página principal.',
          action: { type: 'navigate', path: '/', label: 'Ver Más Información' }
        }
      ]
    }

    // Respuestas por defecto variadas
    return [
      {
        message: 'Entiendo tu consulta. Puedo ayudarte a navegar por el sitio, explicarte cómo funcionan las diferentes secciones, o darte información sobre nuestros servicios de gestión agrícola. ¿Qué te gustaría saber?'
      },
      {
        message: 'Puedo ayudarte de varias formas: explicarte cómo usar el sitio web, darte información sobre nuestros servicios, o guiarte para agendar una cita o completar el cuestionario. ¿En qué te puedo ayudar?'
      },
      {
        message: 'Estoy aquí para ayudarte. Puedo explicarte cómo navegar, qué encontrarás en cada página, cómo usar los formularios, o responder preguntas sobre nuestros servicios. ¿Qué necesitas?'
      },
      {
        message: 'Puedo ayudarte a entender cómo funciona este sitio web. Por ejemplo, puedo explicarte cómo agendar una cita, cómo completar el cuestionario, o qué información encontrarás en cada sección. ¿Qué te interesa?'
      }
    ]
  }
}

export const aiService = new AIService()

