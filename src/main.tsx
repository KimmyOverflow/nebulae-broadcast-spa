import './index.css'

import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Splash } from './components/splash/index.tsx'
import { RegisterSkeleton } from './components/register/skeleton.tsx'

const root = createRoot(document.getElementById('root')!)

const App = lazy(() => import('./App.tsx'))
const Register = lazy(() => import('./components/register'))
const Recover = lazy(() => import('./components/recover'))

export const loadingStartTimestamp = Date.now()

switch (window.location.pathname) {
    case '/register':
        root.render(<Suspense fallback={<RegisterSkeleton />} children={<Register />} />)
        break
    case '/recover':
        root.render(<Suspense children={<Recover />} />)
        break
    case '/':
    default:
        root.render(<Suspense fallback={<Splash />} children={<App />} />)
        // root.render(<Splash />)
        break
}
