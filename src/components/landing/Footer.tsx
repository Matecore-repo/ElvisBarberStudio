'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-600 flex items-center justify-center">
                <span className="text-black font-bold text-lg">E</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">Elvis</span>
                <span className="text-xs text-gray-500">Barber Studio</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Tu destino para cortes modernos, barba impecable y un servicio excepcional.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navegación</h4>
            <ul className="space-y-3">
              <li>
                <a href="#inicio" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#barberos" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Barberos
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-white font-semibold mb-4">Servicios</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Corte Clásico
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Corte Degradado
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Afeitado
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Tinte
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-400 text-sm">+54 9 11 XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-400 text-sm">info@elvis.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-neutral-800 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2026 Elvis Barber Studio. Todos los derechos reservados.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-lg bg-neutral-900 hover:bg-yellow-600/20 border border-neutral-800 hover:border-yellow-600/30 flex items-center justify-center text-gray-400 hover:text-yellow-500 transition-all"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg bg-neutral-900 hover:bg-yellow-600/20 border border-neutral-800 hover:border-yellow-600/30 flex items-center justify-center text-gray-400 hover:text-yellow-500 transition-all"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg bg-neutral-900 hover:bg-yellow-600/20 border border-neutral-800 hover:border-yellow-600/30 flex items-center justify-center text-gray-400 hover:text-yellow-500 transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
