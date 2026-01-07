import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { ValuesSection } from '@/components/landing/ValuesSection';
import { LocationsSection } from '@/components/landing/LocationsSection';
import { Footer } from '@/components/landing/Footer';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
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

      {/* Values */}
      <ValuesSection />

      {/* Locations */}
      <LocationsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
