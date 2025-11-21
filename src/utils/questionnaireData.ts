// Estructura para el cuestionario basado en el Excel
// Por favor, actualiza este archivo con el contenido exacto de tu Excel

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

export interface QuestionnaireCategory {
  id: string
  title: string
  description?: string
  questions: Question[]
}

// TEMPLATE - Reemplaza esto con el contenido de tu Excel
export const questionnaireData: QuestionnaireCategory[] = [
  {
    id: 'categoria1',
    title: 'Categoría 1',
    description: 'Descripción de la categoría',
    questions: [
      {
        id: 'q1',
        text: 'Pregunta 1 de la categoría 1',
        scale: {
          min: 1,
          max: 5,
          labels: {
            min: 'Muy en desacuerdo',
            max: 'Muy de acuerdo'
          }
        }
      },
      {
        id: 'q2',
        text: 'Pregunta 2 de la categoría 1',
        scale: {
          min: 1,
          max: 5,
          labels: {
            min: 'Muy en desacuerdo',
            max: 'Muy de acuerdo'
          }
        }
      }
    ]
  }
]

// Función para obtener todas las preguntas en orden
export const getAllQuestions = (): Question[] => {
  return questionnaireData.flatMap(category => 
    category.questions.map(q => ({
      ...q,
      category: category.id
    }))
  )
}

// Función para calcular resultados por categoría
export const calculateResultsByCategory = (answers: Record<string, number>) => {
  const results: Record<string, {
    average: number
    total: number
    count: number
  }> = {}
  
  questionnaireData.forEach(category => {
    const categoryAnswers = category.questions
      .map(q => answers[q.id])
      .filter(val => val !== undefined) as number[]
    
    if (categoryAnswers.length > 0) {
      const total = categoryAnswers.reduce((sum, val) => sum + val, 0)
      results[category.id] = {
        average: total / categoryAnswers.length,
        total,
        count: categoryAnswers.length
      }
    }
  })
  
  return results
}

