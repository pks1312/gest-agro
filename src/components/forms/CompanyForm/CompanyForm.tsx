import { useState } from 'react'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import styles from './CompanyForm.module.css'

interface CompanyData {
  companyName: string
  contactName: string
  email: string
  phone: string
  industry: string
  employees: string
  description: string
}

interface CompanyFormProps {
  onSubmit: (data: CompanyData) => void
}

export const CompanyForm = ({ onSubmit }: CompanyFormProps) => {
  const [formData, setFormData] = useState<CompanyData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    employees: '',
    description: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyData, string>>>({})
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof CompanyData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyData, string>> = {}
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'El nombre de la empresa es requerido'
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'El nombre de contacto es requerido'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }
    if (!formData.industry.trim()) {
      newErrors.industry = 'La industria es requerida'
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
    <form onSubmit={handleSubmit} className={styles['company-form']}>
      <Input
        label="Nombre de la Empresa"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Ingrese el nombre de su empresa"
        required
        error={errors.companyName}
      />
      <Input
        label="Nombre de Contacto"
        name="contactName"
        value={formData.contactName}
        onChange={handleChange}
        placeholder="Ingrese su nombre completo"
        required
        error={errors.contactName}
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
        label="Industria"
        name="industry"
        value={formData.industry}
        onChange={handleChange}
        placeholder="Ej: Tecnología, Finanzas, Retail, etc."
        required
        error={errors.industry}
      />
      <Input
        label="Número de Empleados"
        name="employees"
        value={formData.employees}
        onChange={handleChange}
        placeholder="Ej: 1-10, 11-50, 51-200, 201+"
      />
      <Input
        label="Descripción de la Empresa"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Cuéntenos sobre su empresa..."
        textarea
        rows={5}
      />
      <div className={styles['form-actions']}>
        <Button type="submit" variant="primary">
          Enviar Información
        </Button>
      </div>
    </form>
  )
}

