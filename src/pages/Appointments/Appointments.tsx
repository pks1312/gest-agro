import { useState } from 'react'
import { AppointmentForm } from '../../components/forms/AppointmentForm'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import styles from './Appointments.module.css'

interface Service {
  id: string
  name: string
  description: string
}

const services: Service[] = [
  {
    id: 'consultoria',
    name: 'Consultoría Financiera',
    description: 'Asesoramiento estratégico para optimizar sus finanzas empresariales'
  },
  {
    id: 'auditoria',
    name: 'Auditoría',
    description: 'Revisión exhaustiva de sus procesos y estados financieros'
  },
  {
    id: 'planificacion',
    name: 'Planificación Fiscal',
    description: 'Estrategias para optimizar su carga fiscal de manera legal'
  },
  {
    id: 'contabilidad',
    name: 'Servicios Contables',
    description: 'Gestión completa de su contabilidad y registros financieros'
  },
  {
    id: 'asesoria',
    name: 'Asesoría Legal',
    description: 'Asesoramiento legal en materia financiera y corporativa'
  },
  {
    id: 'capacitacion',
    name: 'Capacitación',
    description: 'Programas de capacitación para su equipo financiero'
  }
]

interface AppointmentData {
  name: string
  email: string
  phone: string
  company: string
  preferredDate: string
  preferredTime: string
  message: string
  selectedServices: string[]
}

export const Appointments = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)
  const handleSubmit = (data: AppointmentData) => {
    console.log('Datos de cita:', data)
    setAppointmentData(data)
    setShowSuccessModal(true)
  }
  const getSelectedServicesNames = () => {
    if (!appointmentData) return []
    return appointmentData.selectedServices
      .map(id => services.find(s => s.id === id)?.name)
      .filter(Boolean) as string[]
  }
  return (
    <div className={styles['appointments-page']}>
      <div className={styles['appointments-container']}>
        <div className={styles['appointments-header']}>
          <h1 className={styles['appointments-title']}>Solicitar Cita por Videollamada</h1>
          <p className={styles['appointments-subtitle']}>
            Complete el formulario seleccionando los servicios de su interés. Nos pondremos en contacto con usted pronto.
          </p>
        </div>
        <div className={styles['appointments-content']}>
          <AppointmentForm services={services} onSubmit={handleSubmit} />
        </div>
      </div>
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Solicitud de Cita Enviada"
      >
        <div className={styles['success-content']}>
          <p>Gracias por solicitar una cita con nosotros.</p>
          {appointmentData && (
            <div className={styles['appointment-summary']}>
              <h3>Resumen de su solicitud:</h3>
              <div className={styles['summary-item']}>
                <strong>Nombre:</strong> {appointmentData.name}
              </div>
              <div className={styles['summary-item']}>
                <strong>Email:</strong> {appointmentData.email}
              </div>
              <div className={styles['summary-item']}>
                <strong>Teléfono:</strong> {appointmentData.phone}
              </div>
              {appointmentData.company && (
                <div className={styles['summary-item']}>
                  <strong>Empresa:</strong> {appointmentData.company}
                </div>
              )}
              {appointmentData.preferredDate && (
                <div className={styles['summary-item']}>
                  <strong>Fecha preferida:</strong> {new Date(appointmentData.preferredDate).toLocaleDateString('es-ES')}
                </div>
              )}
              {appointmentData.preferredTime && (
                <div className={styles['summary-item']}>
                  <strong>Hora preferida:</strong> {appointmentData.preferredTime}
                </div>
              )}
              {getSelectedServicesNames().length > 0 && (
                <div className={styles['summary-item']}>
                  <strong>Servicios seleccionados:</strong>
                  <ul className={styles['services-list']}>
                    {getSelectedServicesNames().map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <p className={styles['waiting-message']}>
            Su solicitud ha sido recibida. Nuestro equipo se pondrá en contacto con usted en breve para confirmar la cita.
          </p>
          <div className={styles['modal-actions']}>
            <Button onClick={() => setShowSuccessModal(false)} variant="primary">
              Entendido
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

