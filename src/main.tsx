import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigErrorScreen } from './components/ConfigErrorScreen'
import './index.css'

const root = createRoot(document.getElementById('root')!)

// App importe le client Supabase, qui a besoin de VITE_SUPABASE_URL /
// VITE_SUPABASE_ANON_KEY pour s'instancier. Import dynamique pour ne
// déclencher cette dépendance qu'une fois les variables confirmées présentes
// — sinon l'app entière plante avant le premier rendu (écran blanc, aucun
// message) au lieu d'afficher un écran d'erreur explicite.
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  root.render(
    <StrictMode>
      <ConfigErrorScreen />
    </StrictMode>,
  )
} else {
  import('./App.tsx').then(({ default: App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
}
