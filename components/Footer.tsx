import Link from 'next/link'
import { Facebook, Instagram, Phone, Mail, MapPin, Clock, Shield, Truck } from 'lucide-react'

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg font-bold">
                  REPUESTOS
                </div>
                <span className="text-xl font-bold">Bolivia</span>
              </div>
              <p className="text-gray-300 mb-4">
                Tu tienda de confianza para repuestos automotrices en Bolivia. 
                Calidad garantizada y los mejores precios del mercado.
              </p>
              
              {/* Features */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-green-400">
                  <Truck size={16} className="mr-2" />
                  <span>Envío gratis +200 Bs</span>
                </div>
                <div className="flex items-center text-sm text-blue-400">
                  <Shield size={16} className="mr-2" />
                  <span>Garantía de 6 meses</span>
                </div>
                <div className="flex items-center text-sm text-orange-400">
                  <Clock size={16} className="mr-2" />
                  <span>Atención inmediata</span>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/repuestosbolivia" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://instagram.com/repuestosbolivia" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            {/* Quick links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Inicio</Link></li>
                <li><Link href="/productos" className="text-gray-300 hover:text-white transition-colors">Productos</Link></li>
                <li><Link href="/ofertas" className="text-gray-300 hover:text-white transition-colors">Ofertas</Link></li>
                <li><Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="/carrito" className="text-gray-300 hover:text-white transition-colors">Mi Carrito</Link></li>
                <li><Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">Mi Cuenta</Link></li>
              </ul>
            </div>
            
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Categorías Populares</h3>
              <ul className="space-y-2">
                <li><Link href="/productos?categoria=Motor" className="text-gray-300 hover:text-white transition-colors">Motor</Link></li>
                <li><Link href="/productos?categoria=Frenos" className="text-gray-300 hover:text-white transition-colors">Frenos</Link></li>
                <li><Link href="/productos?categoria=Suspensión" className="text-gray-300 hover:text-white transition-colors">Suspensión</Link></li>
                <li><Link href="/productos?categoria=Eléctrico" className="text-gray-300 hover:text-white transition-colors">Sistema Eléctrico</Link></li>
                <li><Link href="/productos?categoria=Cremalleras" className="text-gray-300 hover:text-white transition-colors">Cremalleras</Link></li>
                <li><Link href="/productos?categoria=Neumáticos" className="text-gray-300 hover:text-white transition-colors">Neumáticos</Link></li>
              </ul>
            </div>
            
            {/* Contact info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-green-400" />
                  <div>
                    <p className="text-gray-300">+591 67751732</p>
                    <p className="text-xs text-gray-400">WhatsApp disponible</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-red-400" />
                  <div>
                    <p className="text-gray-300">info@repuestosbolivia.com</p>
                    <p className="text-xs text-gray-400">ventas@repuestosbolivia.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="mt-1 text-blue-400" />
                  <div className="text-gray-300">
                    <p>Av. Heroinas #1234</p>
                    <p>Cochabamba, Bolivia</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock size={16} className="mt-1 text-orange-400" />
                  <div className="text-gray-300 text-sm">
                    <p>Lun - Vie: 8:00 - 18:00</p>
                    <p>Sáb: 8:00 - 14:00</p>
                    <p>Dom: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 Repuestos Bolivia. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terminos" className="text-gray-300 hover:text-white text-sm transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="/privacidad" className="text-gray-300 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/59167751732?text=Hola%2C%20quiero%20información%20sobre%20repuestos%20automotrices"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-50 bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center w-16 h-16 transition-all duration-300 hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.01L0 24l6.25-1.64A11.9 11.9 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.7 0-3.36-.44-4.8-1.28l-.34-.2-3.72.98.99-3.62-.22-.36A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.28-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
        </svg>
        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
          !
        </span>
      </a>
    </>
  )
}