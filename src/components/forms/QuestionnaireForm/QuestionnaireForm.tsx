import { useState } from 'react'
import { Button } from '../../ui/Button'
import styles from './QuestionnaireForm.module.css'

export interface Question {
  id: string
  category?: string
  text: string
  scale?: {
    min: number
    max: number
    labels?: {
      min: string
      max: string
    }
  }
}

interface QuestionnaireFormProps {
  questions: Question[]
  onComplete: (results: Record<string, number>) => void
  showCategories?: boolean
}

export const QuestionnaireForm = ({ questions, onComplete, showCategories = false }: QuestionnaireFormProps) => {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  
  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value }
    setAnswers(newAnswers)
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 300)
    } else {
      setTimeout(() => {
        onComplete(newAnswers)
      }, 300)
    }
  }
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }
  
  const progress = ((currentQuestion + 1) / questions.length) * 100
  if (currentQuestion >= questions.length) {
    return null
  }
  
  const question = questions[currentQuestion]
  const currentAnswer = answers[question.id]
  
  // Configuración de escala
  const scaleMin = question.scale?.min ?? 1
  const scaleMax = question.scale?.max ?? 5
  const scaleLabels = question.scale?.labels ?? {
    min: 'Muy en desacuerdo',
    max: 'Muy de acuerdo'
  }
  
  // Generar array de valores de la escala
  const scaleValues = Array.from({ length: scaleMax - scaleMin + 1 }, (_, i) => scaleMin + i)
  
  // Obtener categoría actual si existe
  const currentCategory = question.category
  const categoryQuestions = currentCategory 
    ? questions.filter(q => q.category === currentCategory)
    : questions
  const categoryIndex = currentCategory 
    ? categoryQuestions.findIndex(q => q.id === question.id)
    : currentQuestion
  
  return (
    <div className={styles['questionnaire-form']}>
      {showCategories && currentCategory && (
        <div className={styles['category-indicator']}>
          Categoría: {currentCategory}
        </div>
      )}
      <div className={styles['progress-bar']}>
        <div className={styles['progress-fill']} style={{ width: `${progress}%` }}></div>
      </div>
      <div className={styles['question-counter']}>
        Pregunta {currentQuestion + 1} de {questions.length}
        {showCategories && currentCategory && (
          <span className={styles['category-counter']}>
            ({categoryIndex + 1} de {categoryQuestions.length} en esta categoría)
          </span>
        )}
      </div>
      <div className={styles['question-container']}>
        <h2 className={styles['question-text']}>{question.text}</h2>
        <div className={styles['rating-scale']}>
          {scaleValues.map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles['rating-button']} ${currentAnswer === value ? styles.selected : ''}`}
              onClick={() => handleAnswer(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className={styles['scale-labels']}>
          <span>{scaleLabels.min}</span>
          <span>{scaleLabels.max}</span>
        </div>
      </div>
      {currentQuestion > 0 && (
        <div className={styles['navigation-buttons']}>
          <Button onClick={handlePrevious} variant="secondary">
            Anterior
          </Button>
        </div>
      )}
    </div>
  )
}

