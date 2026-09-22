import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { BadgesPage } from '../routes/BadgesPage'
import { DashboardPage } from '../routes/DashboardPage'
import { ProfilePage } from '../routes/ProfilePage'
import { StatsPage } from '../routes/StatsPage'
import { AppLayout } from './AppLayout'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'profil', element: <ProfilePage /> },
      { path: 'badges', element: <BadgesPage /> },
      { path: 'stats', element: <StatsPage /> },
    ],
  },
])
