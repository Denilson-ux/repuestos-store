'use client'

import { useState, useEffect } from 'react'
import { useCart } from '../../../contexts/CartContext'
import { Search, Filter, Grid, List, ShoppingCart, Star } from 'lucide-react'

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  precio_oferta?: number
  stock: number
  marca: string
  imagen_url: string
  categoria_nombre: string
}

interface Categoria {
  id: number
  nombre: string
  descripcion: string
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos')
  const [vistaGrid, setVistaGrid] = useState(true)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const { addToCart } = useCart();

  useEffect(() => {
    cargarCategorias()
    cargarProductos()
  }, [categoriaSeleccionada, busqueda])

  const cargarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias')
      const data = await response.json()
      setCategorias(data.categorias)
    } catch (error) {
      console.error('Error cargando categorías:', error)
    }
  }

  const cargarProductos = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoriaSeleccionada !== 'todos') {
        params.append('categoria', categoriaSeleccionada)
      }
      if (busqueda) {
        params.append('busqueda', busqueda)
      }

      const response = await fetch(`/api/productos?${params}`)
      const data = await response.json()
      setProductos(data.productos)
    } catch (error) {
      console.error('Error cargando productos:', error)
    }
    setLoading(false)
  }

  const handleBusqueda = (e: React.FormEvent) => {
    e.preventDefault()
    cargarProductos()
  }

  const calcularDescuento = (precio: number, precioOferta: number) => {
    return Math.round(((precio - precioOferta) / precio) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
          
          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Búsqueda */}
            <form onSubmit={handleBusqueda} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Controles */}
            <div className="flex items-center space-x-4">
              {/* Toggle vista */}
              <div className="flex items-center bg-white rounded-lg border p-1">
                <button
                  onClick={() => setVistaGrid(true)}
                  className={`p-2 rounded ${vistaGrid ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setVistaGrid(false)}
                  className={`p-2 rounded ${!vistaGrid ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Filtros móvil */}
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="lg:hidden bg-white border rounded-lg px-4 py-2 flex items-center space-x-2"
              >
                <Filter size={20} />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <div className={`lg:w-64 ${mostrarFiltros ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Filtros</h3>
              
              {/* Categorías */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categorías</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="categoria"
                      value="todos"
                      checked={categoriaSeleccionada === 'todos'}
                      onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2">Todos los productos</span>
                  </label>
                  {categorias.map((categoria) => (
                    <label key={categoria.id} className="flex items-center">
                      <input
                        type="radio"
                        name="categoria"
                        value={categoria.nombre}
                        checked={categoriaSeleccionada === categoria.nombre}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2">{categoria.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos</p>
              </div>
            ) : (
              <div className={vistaGrid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {productos.map((producto) => (
                  <div key={producto.id} className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${vistaGrid ? '' : 'flex'}`}>
                    {/* Imagen */}
                    <div className={vistaGrid ? 'aspect-square' : 'w-48 flex-shrink-0'}>
                      <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="w-full h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/300x300/3b82f6/ffffff?text=${encodeURIComponent(producto.nombre.substring(0, 15))}`;
                        }}
                      />
                    </div>

                    {/* Contenido */}
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{producto.nombre}</h3>
                        {producto.precio_oferta && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                            -{calcularDescuento(producto.precio, producto.precio_oferta)}%
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{producto.marca} • {producto.categoria_nombre}</p>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{producto.descripcion}</p>
                      
                      {/* Precio */}
                      <div className="flex items-center justify-between">
                        <div>
                          {producto.precio_oferta ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-green-600">
                                Bs {Number(producto.precio_oferta).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                Bs {Number(producto.precio).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              Bs {Number(producto.precio).toFixed(2)}
                            </span>
                          )}
                          <div className="text-xs text-gray-500">
                            Stock: {producto.stock} unidades
                          </div>
                        </div>
                        
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                          onClick={() => addToCart({
                            id: producto.id,
                            producto_id: producto.id,
                            nombre: producto.nombre,
                            precio: producto.precio,
                            precio_oferta: producto.precio_oferta,
                            cantidad: 1,
                            imagen_url: producto.imagen_url,
                            marca: producto.marca,
                            stock: producto.stock
                          })}
                        >
                          <ShoppingCart size={16} />
                          <span className="hidden sm:inline">Agregar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}