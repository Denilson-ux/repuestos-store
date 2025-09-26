'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { useNotification } from './NotificationContext'

interface CartItem {
  id: number
  producto_id: number
  nombre: string
  precio: number
  precio_oferta?: number
  cantidad: number
  imagen_url: string
  marca: string
  stock: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  loading: boolean
  addToCart: (producto: any) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  loadCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { showNotification } = useNotification()

  // Cargar carrito cuando el usuario cambia
  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      setItems([])
    }
  }, [user])

  const loadCart = async () => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/carrito', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      }
    } catch (error) {
      console.error('Error cargando carrito:', error)
    }
    setLoading(false)
  }

  const addToCart = async (producto: any) => {
    if (!user) {
      showNotification('warning', 'Debes iniciar sesión para agregar productos al carrito')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          producto_id: producto.id,
          cantidad: 1
        })
      })

      if (response.ok) {
        await loadCart() // Recargar carrito
        showNotification('success', `${producto.nombre} agregado al carrito`)
      } else {
        const error = await response.json()
        showNotification('error', error.error || 'Error agregando producto al carrito')
      }
    } catch (error) {
      console.error('Error agregando al carrito:', error)
      showNotification('error', 'Error agregando producto al carrito')
    }
  }

  const removeFromCart = async (productId: number) => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/carrito/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setItems(items.filter(item => item.producto_id !== productId))
        showNotification('success', 'Producto eliminado del carrito')
      } else {
        showNotification('error', 'Error eliminando producto del carrito')
      }
    } catch (error) {
      console.error('Error eliminando del carrito:', error)
      showNotification('error', 'Error eliminando producto del carrito')
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user || quantity < 1) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/carrito/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad: quantity })
      })

      if (response.ok) {
        setItems(items.map(item => 
          item.producto_id === productId 
            ? { ...item, cantidad: quantity }
            : item
        ))
        showNotification('success', 'Cantidad actualizada')
      } else {
        showNotification('error', 'Error actualizando cantidad')
      }
    } catch (error) {
      console.error('Error actualizando cantidad:', error)
      showNotification('error', 'Error actualizando cantidad')
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/carrito', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setItems([])
        showNotification('success', 'Carrito vaciado')
      } else {
        showNotification('error', 'Error vaciando carrito')
      }
    } catch (error) {
      console.error('Error vaciando carrito:', error)
      showNotification('error', 'Error vaciando carrito')
    }
  }

  // ...eliminada función showNotification DOM...

  // Calcular totales
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)
  const totalPrice = items.reduce((sum, item) => {
    const precio = item.precio_oferta || item.precio
    return sum + (precio * item.cantidad)
  }, 0)

  const value = {
    items,
    totalItems,
    totalPrice,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}