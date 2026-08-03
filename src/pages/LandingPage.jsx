import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShaderBackground from '../components/landing/ShaderBackground';
import ThreeJSGlobe from '../components/landing/ThreeJSGlobe';
import Particles from '../components/landing/Particles';
import { AnimatedNavFramer } from '../components/ui/navigation-menu';
import OrbitingCirclesGlobe from '../components/ui/orbiting-circles-02';

export default function LandingPage() {
  const [txCount, setTxCount] = useState(1849201);

  useEffect(() => {
    const interval = setInterval(() => {
      setTxCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background text-on-surface min-h-screen relative overflow-x-hidden font-body-md selection:bg-primary selection:text-on-primary">
      {/* Cinematic Background Shader */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ShaderBackground />
        {/* Overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90 mix-blend-overlay"></div>
      </div>
      
      {/* Floating Particles Layer */}
      <Particles />
      
      <AnimatedNavFramer />
      
      {/* Main Content Canvas */}
      <main className="relative z-20 container mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-24 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          
          {/* Hero Text Content */}
          <div className="col-span-1 lg:col-span-6 flex flex-col gap-stack-md z-30">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-tertiary/30 bg-tertiary/10 w-fit backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
              <span className="font-data-sm text-data-sm text-tertiary tracking-wide uppercase">Institutional Grade Subnet Active</span>
            </div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile lg:font-display-lg lg:text-display-lg text-on-surface drop-shadow-lg">
              ChainVest <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-tertiary to-secondary">Finance Platform</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Secure • Transparent • Decentralized Finance. Experience unprecedented control and analytics over your digital assets with our next-generation architecture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-stack-xs">
              <Link to="/dashboard" className="btn-primary px-8 py-4 rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-2 group">
                Launch Dashboard
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
              <Link to="/register" className="btn-secondary px-8 py-4 rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-2">
                Explore Platform
                <span className="material-symbols-outlined">visibility</span>
              </Link>
            </div>
          </div>
          
          {/* Hero 3D Graphic */}
          <div className="col-span-1 lg:col-span-6 relative w-full flex items-center justify-center mt-12 lg:mt-0">
            <OrbitingCirclesGlobe>
              <ThreeJSGlobe />
            </OrbitingCirclesGlobe>
            {/* Floating Node Details (Decorative Glass Cards) */}
            <div className="absolute top-1/4 right-10 glass-panel p-4 rounded-xl shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                  <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">Consensus</p>
                  <p className="font-data-sm text-data-sm text-on-surface">Secured</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-1/4 left-10 glass-panel p-4 rounded-xl shadow-2xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50">
                  <span className="material-symbols-outlined text-secondary text-[16px]">speed</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">Latency</p>
                  <p className="font-data-sm text-data-sm text-on-surface">1.2ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Live Network Stats (Bento-style Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-stack-lg z-30">
          {/* Stat Card 1 */}
          <div className="glass-panel rounded-2xl p-6 group hover:bg-white/[0.03] transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[64px]">account_balance</span>
            </div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Total Value Locked</p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-data-lg text-data-lg text-on-surface text-3xl">$4,285,910,234</h3>
              <span className="font-data-sm text-data-sm text-tertiary flex items-center">+2.4% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
            </div>
          </div>
          {/* Stat Card 2 */}
          <div className="glass-panel rounded-2xl p-6 group hover:bg-white/[0.03] transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[64px]">receipt_long</span>
            </div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Live Transactions (24h)</p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-data-lg text-data-lg text-on-surface text-3xl">{txCount.toLocaleString()}</h3>
              <span className="font-data-sm text-data-sm text-on-surface-variant">TPS: ~21.4</span>
            </div>
          </div>
          {/* Stat Card 3 */}
          <div className="glass-panel rounded-2xl p-6 group hover:bg-white/[0.03] transition-colors relative overflow-hidden border-t-tertiary/30">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[64px]">dns</span>
            </div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Network Uptime</p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-data-lg text-data-lg text-on-surface text-3xl">99.999%</h3>
              <div className="flex items-center gap-1 bg-tertiary/10 px-2 py-1 rounded text-tertiary text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Optimal
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}