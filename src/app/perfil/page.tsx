"use client";

import { useAuth } from '../../../contexts/AuthContext';
import Link from "next/link";
import { UserCircle, LogOut, Edit } from "lucide-react";

export default function PerfilPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <UserCircle className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No has iniciado sesión</h2>
          <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <UserCircle className="text-blue-600 mr-4" size={64} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.nombre || user.email}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Datos de la cuenta</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Nombre:</strong> {user.nombre || '-'}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
