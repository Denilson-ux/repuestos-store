'use client'

import { createContext, useContext, useState } from 'react'
import Notification from '../components/Notification'

interface NotificationItem {
  id: number
  type: 'success' | 'error' | 'warning'
  message: string
}

interface NotificationContextType {
  showNotification: (type: 'success' | 'error' | 'warning', message: string) => void
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType)

export function useNotification() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, message }])
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  )
}