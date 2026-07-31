import Hero from '../components/Hero';
import Features from '../components/Features';
import StatsCards from '../components/StatsCards';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <main>
        <Hero />
        <StatsCards />
        <Features />
      </main>
      <Footer />
    </div>
  );
}