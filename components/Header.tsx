import Link from 'next/link'
import { ShoppingCart, User, Search, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-gray-600">
          <div className="hidden md:block">
            📞 Contacto: +591 7XXXXXXX | 📧 info@repuestosbolivia.com
          </div>
          <div className="flex items-center space-x-4">
            <span>🇧🇴 Bolivia</span>
            <span>Envío gratis en pedidos +200 Bs</span>
          </div>
        </div>
        
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold">
              REPUESTOS
            </div>
            <span className="text-xl font-bold text-gray-800">Bolivia</span>
          </Link>
          
          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar repuestos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* User menu */}
            <Link href="/auth/login" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <User size={20} />
              <span className="hidden md:inline">Mi Cuenta</span>
            </Link>
            
            {/* Cart */}
            <Link href="/cart" className="relative flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <ShoppingCart size={20} />
              <span className="hidden md:inline">Carrito</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            
            {/* Mobile menu */}
            <button className="md:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 py-3 border-t">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Inicio
          </Link>
          <Link href="/productos" className="text-gray-700 hover:text-blue-600 font-medium">
            Productos
          </Link>
          <div className="relative group">
            <button className="text-gray-700 hover:text-blue-600 font-medium">
              Categorías
            </button>
            {/* Dropdown menu - lo implementaremos después */}
          </div>
          <Link href="/ofertas" className="text-gray-700 hover:text-blue-600 font-medium">
            Ofertas
          </Link>
          <Link href="/contacto" className="text-gray-700 hover:text-blue-600 font-medium">
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  )
}