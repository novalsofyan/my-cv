'use client'

import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'App', path: '/app' },
    { label: 'Tentang', path: '/about' },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  // Tutup menu otomatis kalau layar dilebarkan ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  return (
    <nav
      className={`backdrop-blur-md fixed top-0 left-0 w-full shadow-md z-50 transition-colors duration-300 ${
        isOpen ? 'bg-white' : 'bg-white/30'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-8 md:max-w-[1200px] md:mx-auto">
        {/* Logo kiri */}
        <div className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-800 select-none">
          <FileText className="text-red-600 w-6 h-6 md:w-7 md:h-7" />
          <span>MyCV!</span>
        </div>

        {/* Tombol hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 cursor-pointer"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-gray-700 rounded transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-gray-700 rounded my-1.5 transition-all duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-gray-700 rounded transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-4 text-xl font-semibold text-gray-700">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="hover:text-red-600 transition-colors duration-300">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Menu mobile */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full border-t border-gray-200 transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <ul className="flex flex-col space-y-4 p-4 text-lg bg-white shadow-md">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="hover:text-red-600 transition-colors duration-300" onClick={closeMenu}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
