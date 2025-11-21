import { useState } from 'react'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import styles from './AppointmentForm.module.css'

interface Service {
  id: string
  name: string
  description: string
}

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

interface AppointmentFormProps {
  services: Service[]
  onSubmit: (data: AppointmentData) => void
}

export const AppointmentForm = ({ services, onSubmit }: AppointmentFormProps) => {
  const [formData, setFormData] = useState<AppointmentData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    selectedServices: []
  })
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentData, string>>>({})
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof AppointmentData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }
  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }))
  }
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AppointmentData, string>> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }
    if (formData.selectedServices.length === 0) {
      newErrors.selectedServices = 'Debe seleccionar al menos un servicio'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }
  return (
    <form onSubmit={handleSubmit} className={styles['appointment-form']}>
      <Input
        label="Nombre Completo"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ingrese su nombre completo"
        required
        error={errors.name}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="correo@empresa.com"
        required
        error={errors.email}
      />
      <Input
        label="Teléfono"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+1234567890"
        required
        error={errors.phone}
      />
      <Input
        label="Empresa"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Nombre de su empresa (opcional)"
      />
      <div className={styles['services-section']}>
        <h3 className={styles['services-title']}>Servicios de Interés</h3>
        {errors.selectedServices && (
          <span className={styles['error-message']}>{errors.selectedServices}</span>
        )}
        <div className={styles['services-grid']}>
          {services.map((service) => (
            <div
              key={service.id}
              className={`${styles['service-card']} ${formData.selectedServices.includes(service.id) ? styles.selected : ''}`}
              onClick={() => handleServiceToggle(service.id)}
            >
              <input
                type="checkbox"
                checked={formData.selectedServices.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
                className={styles['service-checkbox']}
              />
              <div className={styles['service-content']}>
                <h4 className={styles['service-name']}>{service.name}</h4>
                <p className={styles['service-description']}>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles['datetime-group']}>
        <Input
          label="Fecha Preferida"
          name="preferredDate"
          type="date"
          value={formData.preferredDate}
          onChange={handleChange}
        />
        <Input
          label="Hora Preferida"
          name="preferredTime"
          type="time"
          value={formData.preferredTime}
          onChange={handleChange}
        />
      </div>
      <Input
        label="Mensaje Adicional"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Cuéntenos más sobre sus necesidades..."
        textarea
        rows={4}
      />
      <div className={styles['form-actions']}>
        <Button type="submit" variant="primary">
          Solicitar Cita
        </Button>
      </div>
    </form>
  )
}

