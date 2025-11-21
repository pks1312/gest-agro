import { Header } from './Header'
import { Footer } from './Footer'
import { ChatBot } from '../ui/ChatBot'
import styles from './Layout.module.css'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}

