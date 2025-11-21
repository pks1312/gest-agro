import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QuestionnaireForm } from '../../components/forms/QuestionnaireForm'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import styles from './Questionnaire.module.css'

interface Question {
  id: string
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

const questions: Question[] = [
  {
    id: 'q1',
    text: '¿La empresa cuenta con procedimientos documentados para la etapa de cosecha?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  },
  {
    id: 'q2',
    text: '¿El personal involucrado en la cosecha recibe capacitación formal sobre buenas prácticas agrícolas y seguridad laboral?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  },
  {
    id: 'q3',
    text: '¿Existen mecanismos de control para supervisar la calidad de la fruta durante la cosecha?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  },
  {
    id: 'q4',
    text: '¿Se lleva un registro actualizado de los costos asociados a la mano de obra y materiales utilizados en la cosecha?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  },
  {
    id: 'q5',
    text: '¿Se realiza una planificación previa de recursos (equipos, personal y tiempo) para el proceso de cosecha?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  },
  {
    id: 'q6',
    text: '¿La empresa identifica y evalúa los principales riesgos operativos durante la cosecha (climáticos, técnicos o de gestión)?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  },
  {
    id: 'q7',
    text: '¿Existen medidas de prevención y respuesta ante contingencias durante la cosecha?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  },
  {
    id: 'q8',
    text: '¿Se controla la trazabilidad del producto desde el campo hasta el centro de acopio o packing?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  },
  {
    id: 'q9',
    text: '¿El proceso de cosecha cumple con las normativas y estándares de calidad exigidos por el mercado?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  },
  {
    id: 'q10',
    text: '¿Se realiza una evaluación posterior de los resultados obtenidos para detectar oportunidades de mejora?',
    scale: {
      min: 1,
      max: 5,
      labels: {
        min: 'Muy deficiente',
        max: 'Excelente'
      }
    }
  }
]

const calculateResult = (answers: Record<string, number>): { score: number; level: string; message: string } => {
  const values = Object.values(answers)
  const total = values.reduce((sum, val) => sum + val, 0)
  const average = total / values.length
  const score = Math.round(average * 20)
  let level = ''
  let message = ''
  
  if (average >= 4.5) {
    level = 'Excelente'
    message = 'El proceso de cosecha de su empresa muestra un nivel excelente de gestión y cumplimiento. Los procedimientos están bien documentados y se implementan de manera efectiva. Continúe manteniendo estos estándares de calidad.'
  } else if (average >= 3.5) {
    level = 'Bueno'
    message = 'El proceso de cosecha presenta un buen nivel de gestión. Existen áreas sólidas, pero hay oportunidades de mejora que pueden elevar aún más la eficiencia y calidad del proceso. Recomendamos revisar las áreas con puntuación más baja.'
  } else if (average >= 2.5) {
    level = 'Regular'
    message = 'El proceso de cosecha tiene un nivel regular. Se identifican áreas que requieren atención inmediata para mejorar la eficiencia, calidad y cumplimiento normativo. Es importante implementar mejoras en los procedimientos y controles.'
  } else {
    level = 'Requiere Mejora Urgente'
    message = 'El proceso de cosecha requiere mejoras significativas. Se recomienda implementar urgentemente procedimientos documentados, capacitación del personal, controles de calidad y sistemas de gestión. Nuestro equipo puede ayudarle a desarrollar un plan de mejora integral.'
  }
  
  return { score, level, message }
}

export const Questionnaire = () => {
  const navigate = useNavigate()
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<{ score: number; level: string; message: string } | null>(null)
  const handleComplete = (answers: Record<string, number>) => {
    const calculatedResult = calculateResult(answers)
    setResult(calculatedResult)
    setShowResult(true)
  }
  const handleContinue = () => {
    setShowResult(false)
    navigate('/citas')
  }
  return (
    <div className={styles['questionnaire-page']}>
      <div className={styles['questionnaire-container']}>
        <div className={styles['questionnaire-header']}>
          <h1 className={styles['questionnaire-title']}>Cuestionario de Evaluación - Cosecha</h1>
          <p className={styles['questionnaire-subtitle']}>
            Por favor, responda las siguientes preguntas sobre el proceso de cosecha usando la escala del 1 al 5
          </p>
        </div>
        <QuestionnaireForm questions={questions} onComplete={handleComplete} showCategories={false} />
      </div>
      {result && (
        <Modal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          title="Resultado del Cuestionario"
        >
          <div className={styles['result-content']}>
            <div className={styles['result-score']}>
              <div className={styles['score-circle']}>
                <span className={styles['score-number']}>{result.score}</span>
                <span className={styles['score-label']}>/ 100</span>
              </div>
              <h3 className={styles['result-level']}>{result.level}</h3>
            </div>
            <p className={styles['result-message']}>{result.message}</p>
            <div className={styles['modal-actions']}>
              <Button onClick={handleContinue} variant="primary">
                Continuar a Citas
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

