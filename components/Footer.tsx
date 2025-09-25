import Link from 'next/link'
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold">
                REPUESTOS
              </div>
              <span className="text-xl font-bold">Bolivia</span>
            </div>
            <p className="text-gray-300 mb-4">
              Tu tienda de confianza para repuestos automotrices en Bolivia. 
              Calidad garantizada y los mejores precios.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Inicio</Link></li>
              <li><Link href="/productos" className="text-gray-300 hover:text-white">Productos</Link></li>
              <li><Link href="/ofertas" className="text-gray-300 hover:text-white">Ofertas</Link></li>
              <li><Link href="/nosotros" className="text-gray-300 hover:text-white">Nosotros</Link></li>
              <li><Link href="/contacto" className="text-gray-300 hover:text-white">Contacto</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li><Link href="/categoria/motor" className="text-gray-300 hover:text-white">Motor</Link></li>
              <li><Link href="/categoria/frenos" className="text-gray-300 hover:text-white">Frenos</Link></li>
              <li><Link href="/categoria/suspension" className="text-gray-300 hover:text-white">Suspensión</Link></li>
              <li><Link href="/categoria/electricos" className="text-gray-300 hover:text-white">Sistema Eléctrico</Link></li>
              <li><Link href="/categoria/carroceria" className="text-gray-300 hover:text-white">Carrocería</Link></li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-gray-300">+591 7XXXXXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span className="text-gray-300">info@repuestosbolivia.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1" />
                <div className="text-gray-300">
                  <p>La Paz, Bolivia</p>
                  <p>Zona Central</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 Repuestos Bolivia. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terminos" className="text-gray-300 hover:text-white text-sm">
              Términos y Condiciones
            </Link>
            <Link href="/privacidad" className="text-gray-300 hover:text-white text-sm">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}