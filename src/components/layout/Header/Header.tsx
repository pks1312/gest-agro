import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../ui/Button'
import styles from './Header.module.css'
import logoSinTexto from '../../../assets/logo-sin-texto.png'

export const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const isActive = (path: string) => {
    return location.pathname === path
  }
  
  return (
    <header className={styles.header}>
      <div className={styles['header-container']}>
        <div className={styles.logo}>
          <Link to="/" className={styles['logo-link']}>
            <img src={logoSinTexto} alt="GEST AGRO" className={styles['logo-img']} />
            <span className={styles['logo-text']}>GEST AGRO</span>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link 
            to="/" 
            className={`${styles['nav-link']} ${isActive('/') ? styles.active : ''}`}
          >
            Inicio
          </Link>
          <Link 
            to="/citas" 
            className={`${styles['nav-link']} ${isActive('/citas') ? styles.active : ''}`}
          >
            Citas
          </Link>
          <Link 
            to="/cuestionario" 
            className={`${styles['nav-link']} ${isActive('/cuestionario') ? styles.active : ''}`}
          >
            Cuestionario
          </Link>
        </nav>
        <div className={styles['header-actions']}>
          <Button 
            onClick={() => navigate('/citas')} 
            variant="primary"
          >
            Solicitar Cita
          </Button>
        </div>
      </div>
    </header>
  )
}

