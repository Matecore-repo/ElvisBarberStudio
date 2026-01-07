import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { TeamSection } from '@/components/landing/TeamSection';
import { Footer } from '@/components/landing/Footer';

interface Staff {
  id: string;
  name: string;
  active: boolean;
  commissionRateDefault: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

async function getStaff(): Promise<Staff[]> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/staff`, {
      cache: 'no-store',
    });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/services`, {
      cache: 'no-store',
    });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const staff = await getStaff();
  const services = await getServices();

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-neutral-950 to-black pointer-events-none" />

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Services */}
      <ServicesSection services={services} />

      {/* Team */}
      <TeamSection staff={staff} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
