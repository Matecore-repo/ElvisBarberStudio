'use client';

import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

export const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const links = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Barberos', href: '#barberos' },
    { label: 'Contacto', href: '#contacto' },
  ];

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full border-b border-transparent md:mx-auto md:max-w-7xl md:rounded-md md:border md:transition-all md:ease-out',
        {
          'bg-black/90 supports-[backdrop-filter]:bg-black/70 border-neutral-800 backdrop-blur-lg md:top-4 md:max-w-5xl md:shadow-lg md:shadow-black/20':
            scrolled && !open,
          'bg-black/95': open,
          'bg-black/80 border-neutral-800': !scrolled && !open,
        },
      )}
    >
      <nav
        className={cn(
          'flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-8 md:transition-all md:ease-out',
          {
            'md:h-14 md:px-4': scrolled,
          },
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <span className="font-bold text-white group-hover:text-yellow-400 transition-colors text-lg">
            Elvis Barber Studio
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              className={buttonVariants({
                variant: 'ghost',
                className: 'text-gray-400 hover:text-yellow-500 hover:bg-neutral-800/50'
              })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <Link href="/login">
            <Button
              variant="outline"
              className="border-amber-500/50 bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 text-amber-400 cursor-pointer hover:bg-transparent hover:from-amber-600/20 hover:via-yellow-500/20 hover:to-amber-600/20"
            >
              Entrar
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden border-neutral-700 text-yellow-500 hover:bg-neutral-800 hover:text-yellow-400"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'bg-black/95 fixed top-20 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-t border-neutral-800 md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col justify-between gap-y-2 p-4',
          )}
        >
          <div className="grid gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start text-gray-400 hover:text-yellow-500 hover:bg-neutral-800/50 text-lg',
                })}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 pb-8">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 border border-amber-500/50 text-amber-400 font-semibold">
                Entrar al Sistema
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
