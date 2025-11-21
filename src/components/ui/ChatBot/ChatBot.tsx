import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { aiService } from '../../../services/ai/aiService'
import styles from './ChatBot.module.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  action?: {
    type: 'navigate'
    path: string
    label: string
  }
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getConversationHistory = (): Array<{ role: 'user' | 'assistant'; content: string }> => {
    return messages
      .filter(msg => msg.id !== '1') // Excluir mensaje inicial
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      // Obtener historial de conversación
      const conversationHistory = getConversationHistory()
      
      // Obtener respuesta de IA
      const aiResponse = await aiService.getAIResponse(currentInput, conversationHistory)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.message,
        sender: 'bot',
        timestamp: new Date(),
        action: aiResponse.action
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error al obtener respuesta:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleAction = (action: Message['action']) => {
    if (action?.type === 'navigate') {
      navigate(action.path)
      setIsOpen(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        className={`${styles['chat-button']} ${isOpen ? styles['chat-button-hidden'] : ''}`}
        onClick={toggleChat}
        aria-label="Abrir asistente virtual"
      >
        <svg
          className={styles['chat-icon']}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles['chat-badge']}></span>
      </button>

      {isOpen && (
        <div className={styles['chat-container']}>
          <div className={styles['chat-header']}>
            <div className={styles['chat-header-content']}>
              <div className={styles['chat-avatar']}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H13V9H21ZM14 10V12H22V10H14ZM14 14V16H22V14H14ZM14 18V20H22V18H14Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            <div className={styles['chat-header-text']}>
              <h3>Asistente Virtual</h3>
              <p>En línea • Listo para ayudarte</p>
            </div>
            </div>
            <button
              className={styles['chat-close']}
              onClick={toggleChat}
              aria-label="Cerrar chat"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className={styles['chat-messages']}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles['message']} ${styles[`message-${message.sender}`]}`}
              >
                <div className={styles['message-content']}>
                  <p>{message.text}</p>
                  {message.action && (
                    <button
                      className={styles['action-button']}
                      onClick={() => handleAction(message.action)}
                    >
                      {message.action.label}
                    </button>
                  )}
                </div>
                <span className={styles['message-time']}>
                  {message.timestamp.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles['message']} ${styles['message-bot']}`}>
                <div className={styles['typing-indicator']}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles['chat-input-container']}>
            <input
              type="text"
              className={styles['chat-input']}
              placeholder="Escribe tu mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className={styles['chat-send']}
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              aria-label="Enviar mensaje"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

