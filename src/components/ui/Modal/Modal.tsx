import styles from './Modal.module.css'
import { Button } from '../Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null
  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>{title}</h2>
          <button className={styles['modal-close']} onClick={onClose}>×</button>
        </div>
        <div className={styles['modal-body']}>
          {children}
        </div>
        <div className={styles['modal-footer']}>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  )
}

