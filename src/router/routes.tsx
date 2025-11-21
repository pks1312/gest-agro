import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Home } from '../pages/Home'
import { Questionnaire } from '../pages/Questionnaire'
import { Appointments } from '../pages/Appointments'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>
  },
  {
    path: '/cuestionario',
    element: <Layout><Questionnaire /></Layout>
  },
  {
    path: '/citas',
    element: <Layout><Appointments /></Layout>
  }
])

