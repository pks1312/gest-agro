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
              Somos un equipo de profesionales comprometidos con la modernización del sector agrícola chileno. A través de servicios especializados de auditoría, control de gestión y asesoría estratégica, integramos tecnología de vanguardia e inteligencia artificial para potenciar la eficiencia, transparencia y rentabilidad de las empresas del rubro.
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
                <span className={styles['footer-link']}>Servicios de auditoría y control de gestión</span>
              </li>
              <li>
                <span className={styles['footer-link']}>Licencias del software de monitoreo y control</span>
              </li>
              <li>
                <span className={styles['footer-link']}>Capacitaciones y asesorías técnicas especializadas</span>
              </li>
            </ul>
          </div>
          
          <div className={styles['footer-section']}>
            <h4 className={styles['footer-heading']}>Contacto</h4>
            <ul className={styles['footer-contact']}>
              <li>
                <span className={styles['contact-label']}>Email:</span>
                <a href="mailto:gestagroprof@gmail.com" className={styles['footer-link']}>
                  gestagroprof@gmail.com
                </a>
              </li>
              <li>
                <span className={styles['contact-label']}>Teléfono:</span>
                <a href="tel:+56987654321" className={styles['footer-link']}>
                  +56 9 8765 4321
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles['footer-bottom']}>
          <p className={styles['footer-copyright']}>
            © {currentYear} GEST AGRO. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

