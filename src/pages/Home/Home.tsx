import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import styles from './Home.module.css'
import logoCompleto from '../../assets/logo-completo.png'
import logoSinTexto from '../../assets/logo-sin-texto.png'
import logoSimbolo from '../../assets/logo-simbolo-fondo-blanco.png'

interface Service {
  id: string
  name: string
  description: string
  initial: string
}

const services: Service[] = [
  {
    id: 'auditoria',
    name: 'Servicios de auditoría y control de gestión',
    description: 'Incluye evaluación de procesos, control financiero y reportes personalizados.',
    initial: 'AU'
  },
  {
    id: 'licencias',
    name: 'Licencias del software de monitoreo y control',
    description: 'Acceso a IA, soporte técnico y actualizaciones.',
    initial: 'LI'
  },
  {
    id: 'capacitacion',
    name: 'Capacitaciones y asesorías técnicas especializadas',
    description: '3 módulos por cliente sobre innovación agrícola, gestión de datos y sostenibilidad.',
    initial: 'CA'
  }
]

export const Home = () => {
  const navigate = useNavigate()
  
  return (
    <div className={styles['home-page']}>
      {/* Hero Section */}
      <section className={styles['hero-section']}>
        <div className={styles['hero-container']}>
          <div className={styles['hero-content']}>
            <div className={styles['hero-logo']}>
              <img src={logoCompleto} alt="Logo" className={styles['logo-img']} />
            </div>
            <h1 className={styles['hero-title']}>
              Soluciones de <span className={styles['highlight']}>Gestión</span> para su Empresa
            </h1>
            <p className={styles['hero-subtitle']}>
              Ofrecemos servicios especializados de auditoría, control de gestión y asesoría estratégica para el sector agrícola, integrando tecnología de vanguardia e inteligencia artificial para optimizar sus procesos.
            </p>
            <div className={styles['hero-buttons']}>
              <Button onClick={() => navigate('/citas')} variant="primary">
                Solicitar Cita
              </Button>
              <Button onClick={() => navigate('/cuestionario')} variant="secondary">
                Cuestionario
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos Section */}
      <section className={styles['about-section']}>
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Quiénes Somos</h2>
            <div className={styles['title-underline']}></div>
          </div>
          <div className={styles['about-content']}>
            <div className={styles['about-text']}>
              <div className={styles['about-logo-container']}>
                <img src={logoSinTexto} alt="Logo" className={styles['about-logo']} />
              </div>
              <p className={styles['about-paragraph']}>
                Somos un equipo de profesionales comprometidos con la modernización del sector agrícola chileno. A través de servicios especializados de auditoría, control de gestión y asesoría estratégica, integramos tecnología de vanguardia e inteligencia artificial para potenciar la eficiencia, transparencia y rentabilidad de las empresas del rubro.
              </p>
              <p className={styles['about-paragraph']}>
                Nos guían la ética profesional, la innovación constante y el compromiso con un desarrollo agrícola sostenible, trabajando codo a codo con los productores para transformar los desafíos del campo en oportunidades de crecimiento medible.
              </p>
            </div>
            <div className={styles['about-features']}>
              <div className={styles['feature-item']}>
                <div className={styles['feature-icon']}></div>
                <div className={styles['feature-text']}>
                  <h3>Experiencia Comprobada</h3>
                  <p>Años de trayectoria en gestión agrícola y auditoría</p>
                </div>
              </div>
              <div className={styles['feature-item']}>
                <div className={styles['feature-icon']}></div>
                <div className={styles['feature-text']}>
                  <h3>Equipo Profesional</h3>
                  <p>Especialistas certificados y actualizados</p>
                </div>
              </div>
              <div className={styles['feature-item']}>
                <div className={styles['feature-icon']}></div>
                <div className={styles['feature-text']}>
                  <h3>Atención Personalizada</h3>
                  <p>Soluciones adaptadas a cada necesidad</p>
                </div>
              </div>
              <div className={styles['feature-item']}>
                <div className={styles['feature-icon']}></div>
                <div className={styles['feature-text']}>
                  <h3>Compromiso con la Excelencia</h3>
                  <p>Calidad y precisión en cada proyecto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión y Valores Section */}
      <section className={styles['mission-section']}>
        <div className={styles['section-container']}>
          <div className={styles['mission-grid']}>
            <div className={styles['mission-card']}>
              <div className={styles['mission-icon']}>
                <img src={logoSimbolo} alt="Símbolo" className={styles['mission-logo']} />
              </div>
              <h3 className={styles['mission-title']}>Misión</h3>
              <p className={styles['mission-text']}>
                Proporcionar servicios profesionales de auditoría, control de gestión y asesoría estratégica al sector agrícola, integrando innovación tecnológica, inteligencia artificial y sostenibilidad, con el fin de fortalecer la eficiencia, la transparencia y la rentabilidad de las empresas del rubro.
              </p>
            </div>
            <div className={styles['mission-card']}>
              <div className={styles['mission-icon']}>
                <img src={logoSimbolo} alt="Símbolo" className={styles['mission-logo']} />
              </div>
              <h3 className={styles['mission-title']}>Visión</h3>
              <p className={styles['mission-text']}>
                Consolidarse como la consultoría líder en Chile en auditoría y gestión agrícola sustentable, reconocida por su aporte a la modernización del sector, la aplicación de tecnología inteligente y el compromiso con el desarrollo económico, ambiental y social de las comunidades rurales al año 2030.
              </p>
            </div>
            <div className={styles['mission-card']}>
              <div className={styles['mission-icon']}>
                <img src={logoSimbolo} alt="Símbolo" className={styles['mission-logo']} />
              </div>
              <h3 className={styles['mission-title']}>Valores</h3>
              <ul className={styles['values-list']}>
                <li><strong>Ética profesional:</strong> Actuar con transparencia, responsabilidad y compromiso con la veracidad de la información.</li>
                <li><strong>Innovación:</strong> Promover soluciones tecnológicas que optimicen la gestión y generen valor agregado.</li>
                <li><strong>Sostenibilidad:</strong> Incorporar prácticas que respeten el medio ambiente y fomenten el desarrollo social.</li>
                <li><strong>Excelencia:</strong> Mantener altos estándares de calidad en cada proceso de auditoría y consultoría.</li>
                <li><strong>Colaboración:</strong> Fomentar relaciones de confianza con los clientes y el trabajo interdisciplinario entre profesionales del área contable, agrícola y tecnológica.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className={styles['services-section']}>
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Nuestros Servicios</h2>
            <div className={styles['title-underline']}></div>
            <p className={styles['section-description']}>
              Integramos tecnología de vanguardia e inteligencia artificial para potenciar la eficiencia, transparencia y rentabilidad de las empresas del sector agrícola.
            </p>
          </div>
          <div className={styles['services-grid']}>
            {services.map((service) => (
              <div key={service.id} className={styles['service-card']}>
                <div className={styles['service-icon']}>{service.initial}</div>
                <h3 className={styles['service-name']}>{service.name}</h3>
                <p className={styles['service-description']}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

