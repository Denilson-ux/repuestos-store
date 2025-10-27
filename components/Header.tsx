'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Search, Menu, LogOut, X, Phone, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navigationLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/productos', label: 'Productos' },
    { href: '/ofertas', label: 'Ofertas' },
    { href: '/contacto', label: 'Contacto' }
  ]

  return (
    <>
      <header className="bg-white shadow-lg relative z-50">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-2 text-sm text-gray-600 border-b border-gray-200">
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center">
                <Phone size={16} className="mr-1" />
                <span>+591 67751732</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-1" />
                <span>info@repuestosbolivia.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs md:text-sm">
              <span className="flex items-center">
                🇧🇴 <span className="ml-1 hidden sm:inline">Bolivia</span>
              </span>
              <span className="text-green-600 font-medium">
                📦 <span className="hidden sm:inline">Envío gratis en pedidos +200 Bs</span>
                <span className="sm:hidden">Envío gratis +200 Bs</span>
              </span>
            </div>
          </div>
          
          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg font-bold text-sm md:text-base">
                REPUESTOS
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800">Bolivia</span>
            </Link>
            
            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar repuestos..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Search */}
              <button className="lg:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                <Search size={20} />
              </button>

              {/* User menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                    <User size={20} />
                    <span className="hidden md:inline text-sm font-medium">Hola, {user.nombre}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/perfil" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                      Mi Perfil
                    </Link>
                    <Link href="/pedidos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                      Mis Pedidos
                    </Link>
                    {user.rol === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                        Administración
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center text-sm"
                    >
                      <LogOut size={16} className="mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login" className="flex items-center space-x-1 p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                  <User size={20} />
                  <span className="hidden md:inline text-sm font-medium">Mi Cuenta</span>
                </Link>
              )}
              
              {/* Cart */}
              <Link href="/carrito" className="relative flex items-center space-x-1 p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                <ShoppingCart size={20} />
                <span className="hidden md:inline text-sm font-medium">Carrito</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* Mobile menu button */}
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-between py-3 border-t border-gray-200">
            <div className="flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
            
            {/* Desktop Quick Actions */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Phone size={16} className="mr-1" />
                <span className="font-medium">WhatsApp: +591 67751732</span>
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
          ></div>
          
          {/* Mobile Menu */}
          <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 md:hidden transform transition-all duration-300">
            <div className="px-4 py-4">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg font-bold">
                    REPUESTOS
                  </div>
                  <span className="text-xl font-bold text-gray-800">Bolivia</span>
                </Link>
                <button 
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar repuestos..."
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="space-y-2 mb-6">
                {navigationLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 bg-blue-50 rounded-lg">
                      <span className="text-blue-800 font-medium">Hola, {user.nombre}</span>
                    </div>
                    <Link href="/perfil" className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg" onClick={closeMobileMenu}>
                      Mi Perfil
                    </Link>
                    <Link href="/pedidos" className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg" onClick={closeMobileMenu}>
                      Mis Pedidos
                    </Link>
                    {user.rol === 'admin' && (
                      <Link href="/admin" className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg" onClick={closeMobileMenu}>
                        Administración
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleLogout()
                        closeMobileMenu()
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <Link href="/auth/login" className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium" onClick={closeMobileMenu}>
                    <User size={16} className="inline mr-2" />
                    Mi Cuenta
                  </Link>
                )}
              </div>

              {/* Mobile Contact Info */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center px-4 py-2">
                    <Phone size={16} className="mr-2" />
                    <span>+591 67751732</span>
                  </div>
                  <div className="flex items-center px-4 py-2">
                    <Mail size={16} className="mr-2" />
                    <span>info@repuestosbolivia.com</span>
                  </div>
                  <div className="px-4 py-2 text-green-600 font-medium">
                    📦 Envío gratis en pedidos +200 Bs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}