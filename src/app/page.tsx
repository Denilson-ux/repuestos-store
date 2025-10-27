import Link from 'next/link'
import { ArrowRight, Truck, Shield, CreditCard, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Los Mejores <span className="text-yellow-400">Repuestos</span> para tu Vehículo
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Encuentra repuestos originales y de calidad para todas las marcas. 
                Envío gratuito a toda Bolivia en compras mayores a 200 Bs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/productos" 
                  className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center"
                >
                  Ver Productos <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">🚗 Marcas Disponibles</h3>
                <div className="grid grid-cols-2 gap-4 text-lg">
                  <div>• Toyota</div>
                  <div>• Hyundai</div>
                  <div>• Suzuki</div>
                  <div>• Nissan</div>
                  <div>• Chevrolet</div>
                  <div>• Ford</div>
                  <div>• Volkswagen</div>
                  <div>• Y más...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir Repuestos Bolivia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En compras mayores a 200 Bs a toda Bolivia</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Garantía Total</h3>
              <p className="text-gray-600">6 meses de garantía en todos nuestros productos</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pagos Fáciles</h3>
              <p className="text-gray-600">QR, Tigo Money, transferencias bancarias</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">24-48 horas en Santa Cruz-San julian, 3-5 días resto del país</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Categorías Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Motor', icon: '🔧', count: '245 productos' },
              { name: 'Frenos', icon: '🛑', count: '189 productos' },
              { name: 'Suspensión', icon: '⚙️', count: '156 productos' },
              { name: 'Eléctrico', icon: '⚡', count: '203 productos' },
              { name: 'Carrocería', icon: '🚗', count: '167 productos' }
            ].map((category, index) => (
              <Link 
                key={index}
                href={`/#/${category.name.toLowerCase()}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Contáctanos y te ayudamos a encontrar el repuesto exacto que necesitas
          </p>
          <Link 
            href="#" 
            className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center"
          >
            Contactar Ahora <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}