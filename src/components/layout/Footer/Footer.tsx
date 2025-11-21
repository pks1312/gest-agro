import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import logoSinTexto from '../../../assets/logo-sin-texto.png'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        <div className={styles['footer-content']}>
          <div className={styles['footer-section']}>
            <div className={styles['footer-logo-container']}>
              <img src={logoSinTexto} alt="GEST AGRO" className={styles['footer-logo']} />
              <h3 className={styles['footer-title']}>GEST AGRO</h3>
            </div>
            <p className={styles['footer-description']}>
              Soluciones financieras profesionales para su empresa. 
              Ofrecemos servicios de consultoría, auditoría y asesoría de alta calidad.
            </p>
          </div>
          
          <div className={styles['footer-section']}>
            <h4 className={styles['footer-heading']}>Enlaces</h4>
            <ul className={styles['footer-links']}>
              <li>
                <Link to="/" className={styles['footer-link']}>Inicio</Link>
              </li>
              <li>
                <Link to="/citas" className={styles['footer-link']}>Solicitar Cita</Link>
              </li>
              <li>
                <Link to="/cuestionario" className={styles['footer-link']}>Cuestionario</Link>
              </li>
            </ul>
          </div>
          
          <div className={styles['footer-section']}>
            <h4 className={styles['footer-heading']}>Servicios</h4>
            <ul className={styles['footer-links']}>
              <li>
                <span className={styles['footer-link']}>Consultoría Financiera</span>
              </li>
              <li>
                <span className={styles['footer-link']}>Auditoría</span>
              </li>
              <li>
                <span className={styles['footer-link']}>Planificación Fiscal</span>
              </li>
              <li>
                <span className={styles['footer-link']}>Servicios Contables</span>
              </li>
            </ul>
          </div>
          
          <div className={styles['footer-section']}>
            <h4 className={styles['footer-heading']}>Contacto</h4>
            <ul className={styles['footer-contact']}>
              <li>
                <span className={styles['contact-label']}>Email:</span>
                <a href="mailto:contacto@finanzas.com" className={styles['footer-link']}>
                  contacto@finanzas.com
                </a>
              </li>
              <li>
                <span className={styles['contact-label']}>Teléfono:</span>
                <a href="tel:+1234567890" className={styles['footer-link']}>
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles['footer-bottom']}>
          <p className={styles['footer-copyright']}>
            © {currentYear} Finanzas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

