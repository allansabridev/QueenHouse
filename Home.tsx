import React, { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, Lock, Bell, CheckCircle, Star, Info, X, Zap, Trophy, Smartphone, Radio, Scan, Crown, Clock, AlertCircle, Megaphone } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { Boss } from '../types';

const Home: React.FC = () => {
  const { candidates, bosses, liveUpdates, isCastingOpen, faqs, siteConfig } = useData();

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showClosedMessage, setShowClosedMessage] = useState(!isCastingOpen);
  const [isGlitching, setIsGlitching] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [dailyVotedId, setDailyVotedId] = useState<string | null>(null);
  
  // New States for Features
  const [currentLiveUpdateIndex, setCurrentLiveUpdateIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Sync local state with admin context when it changes
  useEffect(() => {
      setShowClosedMessage(!isCastingOpen);
  }, [isCastingOpen]);

  useEffect(() => {
    // Check for existing daily vote
    const storedVote = localStorage.getItem('dailyVote');
    const storedDate = localStorage.getItem('dailyVoteDate');
    const today = new Date().toDateString();

    if (storedVote && storedDate === today) {
      setDailyVotedId(storedVote);
    } else if (storedDate !== today) {
      // Reset vote if it's a new day
      localStorage.removeItem('dailyVote');
      localStorage.removeItem('dailyVoteDate');
    }

    // Live Updates Rotation
    if (liveUpdates.length > 0) {
        const interval = setInterval(() => {
            setCurrentLiveUpdateIndex((prev) => (prev + 1) % liveUpdates.length);
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [liveUpdates]);

  useEffect(() => {
    // Dynamic Countdown Timer Logic from siteConfig
    const targetDate = new Date(siteConfig.countdownTarget);

    const timer = setInterval(() => {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();
        
        if (difference > 0) {
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        } else {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
    }, 1000);

    return () => {
        clearInterval(timer);
    };
  }, [siteConfig.countdownTarget]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const handleCandidatureClick = () => {
    // Trigger Glitch Effect
    setIsGlitching(true);
    setTimeout(() => {
        setIsGlitching(false);
        setShowClosedMessage(true);
    }, 1200);
  };

  const handleDailyVote = (id: string) => {
    if (dailyVotedId) return;
    setDailyVotedId(id);
    localStorage.setItem('dailyVote', id);
    localStorage.setItem('dailyVoteDate', new Date().toDateString());
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200&bold=true&format=svg`;
  };

  const presentCandidates = candidates.filter(c => c.status === 'PRESENT');
  const pastCandidates = candidates.filter(c => c.status === 'ELIMINATED' || c.status === 'LEFT');

  // Reorder bosses specifically: Ricardo, Benoit, Yuma
  const orderedBosses = [
    bosses.find(b => b.id === 'ricardo'),
    bosses.find(b => b.id === 'benoit'),
    bosses.find(b => b.id === 'yuma')
  ].filter(Boolean) as Boss[];

  const votedCandidateName = dailyVotedId ? presentCandidates.find(c => c.id === dailyVotedId)?.name : '';

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#050505] relative">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes noise {
          0%, 100% { background-position: 0 0; }
          10% { background-position: -5% -10%; }
          20% { background-position: -15% 5%; }
          30% { background-position: 7% -25%; }
          40% { background-position: 20% 25%; }
          50% { background-position: -25% 10%; }
          60% { background-position: 15% 5%; }
          70% { background-position: 0% 15%; }
          80% { background-position: 25% 35%; }
          90% { background-position: -10% 10%; }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-scanline {
          animation: scanline 4s ease-in-out infinite;
        }
        .animate-noise {
          animation: noise 0.2s steps(8) infinite;
          background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
        }
      `}</style>
      
      {/* Breaking News Banner */}
      {siteConfig.banner.isVisible && (
        <div className={`w-full py-2 overflow-hidden z-[60] relative
            ${siteConfig.banner.type === 'ALERT' ? 'bg-red-600' : siteConfig.banner.type === 'LIVE' ? 'bg-green-600' : 'bg-blue-600'}
        `}>
            <div className="animate-marquee whitespace-nowrap flex gap-10 items-center">
                {Array(10).fill(siteConfig.banner.text).map((txt, i) => (
                    <span key={i} className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <Megaphone size={14} className="animate-pulse" /> {txt}
                    </span>
                ))}
            </div>
        </div>
      )}

      {/* Floating Live Widget */}
      {liveUpdates.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-float hidden sm:flex flex-col items-end gap-2 pointer-events-none">
            <div className="liquid-glass-strong bg-black/60 rounded-2xl p-4 max-w-xs border-l-4 border-pink-600 backdrop-blur-xl shadow-2xl pointer-events-auto">
                <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">En direct de la villa</span>
                </div>
                <p className="text-white text-sm font-medium leading-snug animate-fade-in key={currentLiveUpdateIndex}">
                    {liveUpdates[currentLiveUpdateIndex]}
                </p>
            </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        {/* Dark Abstract Background */}
        <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/20 rounded-full filter blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full filter blur-[120px] animate-pulse animation-delay-2000"></div>
        </div>

        <div className="z-10 space-y-8 max-w-5xl mx-auto flex flex-col items-center">
          <span className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-pink-400 text-xs font-bold tracking-[0.3em] backdrop-blur-md uppercase">
            La Téléréalité 2.0
          </span>
          
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] drop-shadow-2xl">
            QUEEN <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 text-glow animate-float inline-block">
              HOUSE
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Une villa. <span className="text-pink-500 font-bold">12 Créateurs</span>. Un seul règne.<br/>
            Bienvenue dans la maison la plus convoitée d'Espagne.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
                onClick={() => document.getElementById('concept')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-pink-600 text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]"
            >
                <span className="relative z-10 flex items-center gap-2">Découvrir la Queen House <ArrowRight size={20} /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce text-gray-500">
            <ArrowRight className="rotate-90" size={24} />
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-10 bg-black border-y border-white/5">
          <div className="max-w-4xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                  <div className="flex items-center gap-3 text-pink-500">
                      <Clock className="animate-pulse" />
                      <span className="font-bold uppercase tracking-widest text-sm">Prochaine Cérémonie</span>
                  </div>
                  
                  <div className="flex items-center gap-4 md:gap-8">
                      {[
                          { val: timeLeft.days, label: "Jours" },
                          { val: timeLeft.hours, label: "Heures" },
                          { val: timeLeft.minutes, label: "Min" },
                          { val: timeLeft.seconds, label: "Sec" }
                      ].map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                              <div className="text-3xl md:text-5xl font-black text-white tabular-nums leading-none">
                                  {item.val.toString().padStart(2, '0')}
                              </div>
                              <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">{item.label}</span>
                          </div>
                      ))}
                  </div>
                  
                  <div className="hidden md:block h-12 w-[1px] bg-white/10"></div>
                  
                  <Link to="/live" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                      <Info size={14} />
                      Détails
                  </Link>
              </div>
          </div>
      </section>

      {/* Concept Section */}
      <section id="concept" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-pink-500"></div>
                <span className="text-pink-500 font-bold tracking-widest uppercase text-sm">Le Concept</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none">
              VIVRE LE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">RÊVE DIGITAL</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-white/10 pl-6">
              La Queen House est un laboratoire de créativité et de drama. 
              Influenceurs, TikTokeurs, et créateurs de contenu se réunissent pour cohabiter, créer, et s'affronter.
              Chaque semaine, le public et les Boss décident du sort des habitants.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-[2rem] opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-700"></div>
            <div className="relative liquid-glass-strong rounded-[2rem] p-2 transform rotate-2 group-hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://ik.imagekit.io/cowouiutw/Queen%20House%20IMG.jpeg?updatedAt=1763735956829" 
                alt="Villa Queen House" 
                className="w-full h-full object-cover rounded-[1.5rem] filter brightness-90 contrast-120"
              />
              <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md text-pink-500 font-bold px-4 py-2 rounded-full border border-pink-500/30">
                📍 Espagne
              </div>
              <div className="absolute bottom-6 left-6">
                  <span className="text-5xl font-black text-white drop-shadow-lg">SAISON 1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Bosses Section */}
      <section className="py-32 px-4 bg-[#0a0a0a] relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         
         {/* Spotlight effects */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none"></div>

         <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
             <h2 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter drop-shadow-lg">
               Les <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Boss</span> 👑
             </h2>
             <p className="text-gray-400 text-lg max-w-xl mx-auto">Le trio qui dirige la villa d'une main de fer... et de velours.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
            {orderedBosses.map((boss) => {
              const isCenter = boss.id === 'benoit';
              return (
                <div 
                  key={boss.id}
                  className={`
                    relative rounded-[2.5rem] text-center transition-all duration-500 ease-out flex flex-col items-center group
                    ${isCenter 
                      ? 'md:scale-110 z-20 bg-gradient-to-b from-[#1a0b14] to-black border-2 border-pink-500 shadow-[0_0_60px_rgba(236,72,153,0.25)] order-2' 
                      : 'md:scale-95 z-10 bg-black/40 border border-white/10 hover:border-pink-500/40 hover:bg-black/60 order-1 md:order-none backdrop-blur-sm'
                    }
                  `}
                >
                  {/* Card Header / Image */}
                  <div className={`relative w-full pt-8 pb-4 px-4 flex flex-col items-center ${isCenter ? 'pt-12' : ''}`}>
                    <div className={`relative rounded-full p-1 transition-transform duration-500 group-hover:scale-105
                        ${isCenter 
                            ? 'w-40 h-40 bg-gradient-to-tr from-pink-500 via-purple-500 to-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)]' 
                            : 'w-32 h-32 bg-gradient-to-tr from-gray-700 to-gray-800 group-hover:from-pink-900 group-hover:to-purple-900'}
                    `}>
                       <img 
                          src={boss.image} 
                          alt={boss.name} 
                          className="w-full h-full object-cover rounded-full border-4 border-black"
                        />
                        {isCenter && (
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
                                 <Crown size={40} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] fill-yellow-400" />
                             </div>
                        )}
                    </div>

                    <h3 className={`font-black uppercase tracking-tight mt-6 mb-1 transition-colors
                        ${isCenter ? 'text-3xl text-white' : 'text-2xl text-gray-200 group-hover:text-white'}
                    `}>
                        {boss.name}
                    </h3>
                    <p className="text-pink-500 font-bold text-sm tracking-widest mb-4 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]">
                        {boss.handle}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="px-8 pb-8 w-full flex flex-col items-center flex-grow">
                     <p className={`text-sm leading-relaxed italic mb-8 line-clamp-3
                        ${isCenter ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-300'}
                     `}>
                         "{boss.description}"
                     </p>
                     
                     <div className="mt-auto">
                        <button 
                            onClick={() => setSelectedBoss(boss)}
                            className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center gap-2
                                ${isCenter 
                                    ? 'bg-pink-600 text-white hover:bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]' 
                                    : 'bg-transparent border border-white/20 text-white hover:bg-white hover:text-black hover:border-white'}
                            `}
                        >
                            <span>Voir le profil</span> {isCenter && <ArrowRight size={16} />}
                        </button>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Daily Vote Section */}
      <section className="py-20 px-4 border-y border-white/5 bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 text-pink-500 font-bold uppercase tracking-widest text-xs mb-4 animate-pulse">
                <Zap size={14} /> Sondage Express
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2">BOOST TON <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">MVP</span></h2>
            <p className="text-gray-400 mb-10 text-sm md:text-base">Ton vote influence directement le <Link to="/candidates" className="text-white underline decoration-pink-500 hover:text-pink-400 transition-colors">Baromètre</Link> des candidats.</p>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {presentCandidates.map(c => {
                    const isVoted = dailyVotedId === c.id;
                    const isOtherVoted = dailyVotedId && !isVoted;
                    return (
                        <div key={c.id} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${isOtherVoted ? 'opacity-30 grayscale' : 'opacity-100'}`}>
                            <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] transition-all duration-300
                                ${isVoted 
                                    ? 'bg-yellow-500 scale-110 shadow-[0_0_20px_rgba(234,179,8,0.5)]' 
                                    : 'bg-gradient-to-b from-gray-700 to-gray-900 group-hover:from-pink-500 group-hover:to-purple-600'}
                            `}>
                                <img 
                                  src={c.image} 
                                  onError={(e) => handleImageError(e, c.name)}
                                  className="w-full h-full rounded-full object-cover border-2 border-black" 
                                  alt={c.name} 
                                />
                                {isVoted && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-1 animate-bounce z-10">
                                        <Star size={14} fill="black" />
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <p className={`text-xs font-bold mb-2 ${isVoted ? 'text-yellow-400' : 'text-white'}`}>{c.name}</p>
                                <button 
                                    onClick={() => handleDailyVote(c.id)}
                                    disabled={!!dailyVotedId}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all
                                        ${isVoted 
                                            ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' 
                                            : dailyVotedId 
                                                ? 'opacity-0 cursor-default'
                                                : 'bg-white/5 border-white/10 hover:bg-pink-600 hover:border-pink-600 text-white'}
                                    `}
                                >
                                    {isVoted ? 'BOOSTÉ !' : 'BOOST +1'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {dailyVotedId && (
                <div className="mt-8 animate-scale-up inline-block">
                    <div className="bg-green-900/20 border border-green-500/30 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                        <div className="flex items-center gap-2 text-green-400 font-black text-sm uppercase tracking-widest mb-1">
                            <CheckCircle size={16} /> Vote Enregistré
                        </div>
                        <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                            Tu as boosté <span className="text-white font-bold">{votedCandidateName}</span>.<br/>
                            Son impact sur le baromètre est immédiat.
                        </p>
                    </div>
                </div>
            )}
        </div>
      </section>

      {/* Boss Modal */}
      {selectedBoss && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="liquid-glass-strong rounded-3xl max-w-lg w-full relative overflow-hidden">
            <button onClick={() => setSelectedBoss(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full z-20 transition-colors">
              <X className="text-white" />
            </button>
            
            <div className="relative h-48">
                <img src={selectedBoss.image} alt={selectedBoss.name} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-purple-600">
                        <img src={selectedBoss.image} alt={selectedBoss.name} className="w-full h-full object-cover rounded-full border-4 border-black" />
                    </div>
                </div>
            </div>

            <div className="pt-16 pb-8 px-8 text-center">
                <h2 className="text-3xl font-black text-white mb-1">{selectedBoss.name}</h2>
                <p className="text-pink-500 font-bold mb-4">{selectedBoss.role}</p>
                <p className="text-gray-300 italic mb-8 leading-relaxed">"{selectedBoss.description}"</p>
                
                <a href={selectedBoss.tiktok} target="_blank" rel="noreferrer" className="block w-full py-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all shadow-lg shadow-pink-900/20">
                    Suivre sur TikTok
                </a>
            </div>
          </div>
        </div>
      )}

      {/* Participants */}
      <section className="py-32 px-4 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="max-w-7xl mx-auto">
          
          {/* Present */}
          <div className="mb-24">
            <h3 className="text-3xl font-black text-center mb-16 flex items-center justify-center gap-4 text-white">
              <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></span>
              LES HABITANTS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {presentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex flex-col items-center group">
                  <div className="relative w-28 h-28 md:w-40 md:h-40 mb-5">
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>
                    <Link to={`/candidates`}>
                      <img 
                        src={candidate.image} 
                        onError={(e) => handleImageError(e, candidate.name)}
                        alt={candidate.name} 
                        className="relative w-full h-full object-cover rounded-full border-2 border-white/10 group-hover:border-pink-500 transition-all duration-300" 
                      />
                    </Link>
                  </div>
                  <h4 className="font-bold text-xl text-white mb-1">{candidate.name}</h4>
                  <a href={candidate.tiktok} className="text-pink-500 text-sm font-bold hover:text-pink-400 mb-3">{candidate.handle}</a>
                  <Link to="/candidates" className="text-xs text-gray-500 group-hover:text-white transition-colors border-b border-transparent group-hover:border-pink-500">
                    Voir le profil
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Past Candidates (Eliminated or Left) */}
          <div>
            <h3 className="text-xl font-bold text-center mb-12 text-gray-600 flex items-center justify-center gap-3 uppercase tracking-widest">
              Ils nous ont quittés
            </h3>
            <div className="flex flex-wrap justify-center gap-10 opacity-60 hover:opacity-100 transition-opacity duration-500">
              {pastCandidates.map((candidate) => (
                <div key={candidate.id} className="flex flex-col items-center group grayscale hover:grayscale-0 transition-all">
                  <div className="w-20 h-20 rounded-full p-[2px] bg-gray-700 mb-3 group-hover:bg-pink-900 transition-colors relative">
                    <img 
                        src={candidate.image} 
                        onError={(e) => handleImageError(e, candidate.name)}
                        alt={candidate.name} 
                        className="w-full h-full object-cover rounded-full border-2 border-black" 
                    />
                    {candidate.status === 'ELIMINATED' ? (
                        <div className="absolute bottom-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded font-bold">XX</div>
                    ) : (
                        <div className="absolute bottom-0 right-0 bg-gray-500 text-white text-[10px] px-1 rounded font-bold">OUT</div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-400 group-hover:text-white">{candidate.name}</h4>
                  <span className="text-pink-500 text-xs">{candidate.handle}</span>
                  <Link to="/candidates" className="text-xs text-gray-600 mt-1 hover:text-pink-500">Voir le profil</Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Candidature Dynamic Block */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 bg-[#050505]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* The Ultra Immersive Card */}
          <div className={`relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ease-out
                ${isGlitching ? 'animate-noise border-white scale-95 shadow-none' : 'border-white/10 hover:border-pink-500/50 hover:shadow-[0_0_60px_rgba(236,72,153,0.2)]'} 
                shadow-[0_0_40px_rgba(0,0,0,0.8)] group perspective-1000
          `}>
            
            {/* Top Marquee */}
            <div className="absolute top-0 left-0 w-full h-8 bg-pink-500/10 border-b border-pink-500/20 flex items-center overflow-hidden z-20">
                 <div className="animate-marquee flex whitespace-nowrap gap-8 text-[10px] font-bold tracking-[0.4em] text-pink-500/80 uppercase">
                    {Array(10).fill("/// CASTING QUEEN HOUSE /// SAISON 1 /// RECRUTEMENT EN COURS /// ").map((text, i) => (
                        <span key={i}>{text}</span>
                    ))}
                 </div>
            </div>

            {/* Glitch Overlay */}
            {isGlitching && (
                <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center animate-pulse">
                    <div className="text-8xl font-black text-white mix-blend-difference animate-bounce tracking-tighter">FATAL ERROR</div>
                    <div className="text-red-500 font-mono mt-4">SYSTEM_LOCKED_BY_ADMIN</div>
                </div>
            )}

            {/* Scanline Animation */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-pink-400 shadow-[0_0_20px_rgba(236,72,153,1)] z-30 animate-scanline opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            {!showClosedMessage ? (
              // OPEN STATE
              <div className="relative p-10 pt-24 pb-20 md:p-24 flex flex-col items-center justify-center text-center">
                
                {/* Animated Cyber Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none animate-[pulse_4s_ease-in-out_infinite]"></div>
                
                {/* Live Indicators */}
                <div className="flex items-center gap-6 mb-12 relative z-10">
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <span className="text-red-500 text-xs font-black tracking-widest">ENREGISTREMENT</span>
                    </div>
                </div>

                {/* Floating Holographic Icons */}
                <div className="absolute top-32 left-12 hidden lg:block animate-float opacity-60 mix-blend-screen">
                    <Crown size={56} className="text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
                </div>
                <div className="absolute bottom-32 right-12 hidden lg:block animate-float opacity-60 mix-blend-screen" style={{ animationDelay: '1.5s' }}>
                    <Smartphone size={56} className="text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                </div>

                <h2 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.85] relative z-10 group-hover:scale-105 transition-transform duration-500">
                  DEVIENS <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-300 to-white bg-[length:200%_auto] animate-[shine_3s_linear_infinite]">LA STAR</span>
                </h2>

                <p className="text-xl text-gray-400 mb-14 max-w-lg mx-auto relative z-10 font-light leading-relaxed">
                    La villa t'attend. Les caméras sont prêtes. <br/>
                    <span className="text-white font-bold border-b border-pink-500">Il ne manque que toi.</span>
                </p>
                
                {/* Spots Counter Radar */}
                <div className="flex justify-center items-center gap-4 mb-16 relative z-10 bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="relative w-12 h-12 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-[spin_2s_linear_infinite] opacity-50"></div>
                        <Scan size={20} className="text-green-400 relative z-10" />
                    </div>
                    <div className="text-left">
                        <p className="text-green-400 font-black text-2xl leading-none">02</p>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Places Restantes</p>
                    </div>
                </div>

                <button 
                  onClick={handleCandidatureClick}
                  className="relative px-14 py-6 bg-white text-black rounded-full font-black text-xl overflow-hidden transition-all duration-300 hover:scale-105 z-20 shadow-[0_0_0_0_rgba(255,255,255,0.7)] hover:shadow-[0_0_0_10px_rgba(255,255,255,0.1)]"
                >
                  <span className="relative z-10 flex items-center gap-3 uppercase tracking-wider">
                    Postuler Maintenant <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]"></div>
                </button>

              </div>
            ) : (
              // CLOSED STATE (LOCKED)
              <div className="relative p-10 pt-24 pb-20 md:p-24 flex flex-col items-center justify-center text-center min-h-[700px]">
                 
                 {/* Locked Atmosphere */}
                 <div className="absolute inset-0 bg-red-950/20 pointer-events-none"></div>
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>

                 {/* Icon */}
                 <div className="mb-10 relative group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute -inset-10 bg-red-600 blur-[60px] opacity-20 animate-pulse"></div>
                    <div className="relative bg-black border border-red-500/50 p-6 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                        <Lock className="text-red-500" size={48} />
                    </div>
                 </div>

                <h2 className="text-5xl md:text-7xl font-black mb-4 text-white tracking-tighter uppercase">
                  Casting <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700">Fermé</span>
                </h2>
                
                <div className="flex items-center gap-4 mb-8 opacity-70">
                    <div className="h-[1px] w-12 bg-red-500"></div>
                    <p className="text-red-400 font-mono text-xs uppercase tracking-[0.2em]">Accès refusé • Saison 1 Complète</p>
                    <div className="h-[1px] w-12 bg-red-500"></div>
                </div>

                <p className="text-xl text-gray-300 mb-12 max-w-lg font-light">
                  Ne rate pas le prochain train. <br/> La <span className="font-bold text-white border-b border-pink-500">Saison 2</span> arrive plus vite que prévu.
                </p>
                
                {/* VIP Waitlist Card */}
                <div className="w-full max-w-md liquid-glass rounded-2xl p-1 border border-white/10 relative overflow-hidden group/form hover:border-pink-500/30 transition-colors">
                  <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8">
                      <h3 className="font-bold text-white mb-2 text-lg flex items-center justify-center gap-2">
                          <Star size={18} className="text-yellow-400 fill-yellow-400" /> LISTE D'ATTENTE VIP
                      </h3>
                      <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider font-medium">Sois notifié 24h avant le public</p>
                      
                      {!isSubscribed ? (
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-3 relative z-10">
                          <div className="relative group-focus-within:scale-[1.02] transition-transform">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Bell size={18} className="text-gray-500" />
                              </div>
                              <input 
                                type="email" 
                                placeholder="Ton adresse email..." 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-pink-500 focus:bg-black focus:outline-none text-white placeholder-gray-600 transition-all font-medium"
                              />
                          </div>
                          <button type="submit" className="bg-white text-black font-black py-4 rounded-xl hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2 uppercase text-sm tracking-widest hover:scale-[1.02]">
                            Rejoindre la liste
                          </button>
                        </form>
                      ) : (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-xl flex flex-col items-center justify-center gap-3 font-bold animate-[scale-up_0.3s_ease-out]">
                          <CheckCircle size={40} className="text-green-500 drop-shadow-lg" /> 
                          <span className="text-lg">INSCRIPTION VALIDÉE</span>
                          <span className="text-xs font-normal text-green-500/70 uppercase tracking-wider">On se revoit bientôt.</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Marquee */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-black/50 border-t border-white/5 flex items-center overflow-hidden z-20">
                 <div className="animate-marquee flex whitespace-nowrap gap-8 text-[10px] font-bold tracking-[0.4em] text-gray-600 uppercase" style={{ animationDirection: 'reverse' }}>
                    {Array(10).fill("/// NE LAISSE PAS PASSER TA CHANCE /// DEVIENS UNE LÉGENDE /// ").map((text, i) => (
                        <span key={i}>{text}</span>
                    ))}
                 </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-[#050505] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12 text-white">QUESTIONS FRÉQUENTES</h2>
          <div className="space-y-4">
            {faqs.length === 0 ? (
                <p className="text-center text-gray-500">Aucune question pour le moment.</p>
            ) : (
                faqs.map((faq, index) => (
                <div key={faq.id} className="liquid-glass rounded-2xl overflow-hidden transition-all hover:border-pink-500/30">
                    <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-8 py-6 text-left hover:bg-white/5 transition-colors flex justify-between items-center gap-4"
                    >
                    <span className="font-bold text-white text-lg">{faq.question}</span>
                    <span className={`transform transition-transform duration-300 text-pink-500 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                    </button>
                    {openFaqIndex === index && (
                    <div className="px-8 py-6 bg-white/5 text-gray-300 leading-relaxed border-t border-white/5">
                        {faq.answer}
                    </div>
                    )}
                </div>
                ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;