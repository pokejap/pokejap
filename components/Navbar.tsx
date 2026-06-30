'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { useAuthStore } from '@/lib/auth-store'
import CartSidebar from './CartSidebar'
import PokejapLogo from './PokejapLogo'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [mounted, setMounted]       = useState(false)
  const { getTotalItems, openCart } = useCartStore()
  const { user }                    = useAuthStore()
  const totalItems = mounted ? getTotalItems() : 0

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/',         label: 'Accueil'  },
    { href: '/boutique', label: 'Boutique' },
    { href: '/a-propos', label: 'À propos' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0A0A14]/95 backdrop-blur-md shadow-lg shadow-black/40 border-b border-white/[0.05]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                <PokejapLogo size={42} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-lg tracking-tight">
                  Poke<span className="shimmer-text">Jap</span>
                </span>
                <span className="text-[9px] text-white/30 tracking-[0.15em]" translate="no">ポケモンカード</span>
              </div>
            </Link>

            {/* Liens desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm font-medium relative group">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-pokemon-red group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Actions droite */}
            <div className="flex items-center gap-1">
              {/* Compte */}
              <Link href="/compte"
                className="relative p-2.5 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5 flex items-center justify-center"
                title={user ? `${user.prenom} ${user.nom}` : 'Mon compte'}
              >
                {mounted && user ? (
                  <span className="w-6 h-6 rounded-full bg-pokemon-red flex items-center justify-center text-white text-[10px] font-black leading-none">
                    {user.prenom.charAt(0).toUpperCase()}{user.nom.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={20} />
                )}
              </Link>

              {/* Panier */}
              <button onClick={openCart} className="relative p-2.5 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-pokemon-red text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce" style={{ width: '18px', height: '18px' }}>
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Menu burger mobile */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0A0A14]/98 backdrop-blur-md border-t border-white/[0.05] px-4 py-5 flex flex-col gap-4">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="text-gray-300 hover:text-white text-sm font-medium pl-2 border-l-2 border-red-800/40 hover:border-pokemon-red transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/compte" onClick={() => setMobileOpen(false)}
              className="text-gray-300 hover:text-white text-sm font-medium pl-2 border-l-2 border-red-800/40 hover:border-pokemon-red transition-colors flex items-center gap-2">
              <User size={14} />
              {mounted && user ? `${user.prenom} ${user.nom}` : 'Mon compte'}
            </Link>
          </div>
        )}
      </nav>
      <CartSidebar />
    </>
  )
}
