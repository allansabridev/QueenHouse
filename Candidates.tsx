import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { X, TrendingUp, ArrowUp, ArrowDown, Minus, Crown, LogOut, Play, ChevronDown, ChevronUp, Users, Sparkles, Zap, Star, Search } from 'lucide-react';
import { Candidate } from '../types';
import { Link } from 'react-router-dom';

const Candidates: React.FC = () => {
  const { candidates } = useData();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
      const storedVote = localStorage.getItem('dailyVote');
      const storedDate = localStorage.getItem('dailyVoteDate');
      const today = new Date().toDateString();
      if (storedVote && storedDate === today) {
          setUserVote(storedVote);
      }
  }, []);

  // Sort by ranking for barometer (Present candidates only)
  // Boost the user's voted candidate locally by reducing their rank value slightly to push them up
  const rankedCandidates = [...candidates]
    .filter(c => c.status === 'PRESENT')
    .map(c => {
        if (c.id === userVote) {
            return { ...c, ranking: (c.ranking || 99) - 1.5 }; // Boost logic
        }
        return c;
    })
    .sort((a, b) => (a.ranking || 99) - (b.ranking || 99));

  // All candidates for grid
  const allCandidates = [...candidates].sort((a, b) => {
      // Present first, then others
      if (a.status === 'PRESENT' && b.status !== 'PRESENT') return -1;
      if (a.status !== 'PRESENT' && b.status === 'PRESENT') return 1;
      return 0;
  });

  // Filter based on search query
  const filteredRankedCandidates = rankedCandidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAllCandidates = allCandidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200&bold=true&format=svg`;
  };

  const openModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-[#050505]">
      
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tight">
          Les <span className="text-pink-500 text-glow">Candidats</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base">Suis le classement en temps réel.</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12 relative animate-fade-in">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-500" size={20} />
        </div>
        <input
            type="text"
            placeholder="Rechercher un habitant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:bg-black/40 transition-all shadow-lg focus:shadow-pink-500/20"
        />
      </div>

      {/* Barometer - Compact Vertical List Style */}
      {filteredRankedCandidates.length > 0 && (
        <div className="max-w-xl mx-auto mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
                <div className="bg-pink-600/20 p-1.5 rounded-lg border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                    <TrendingUp className="text-pink-500" size={18} />
                </div>
                <h2 className="text-xl font-black text-white uppercase italic tracking-wider">
                    Le Baromètre
                </h2>
            </div>

            <div className="space-y-2">
            {filteredRankedCandidates.map((candidate, index) => {
                // Calculate original rank index based on the full sorted list to maintain correct rank numbers even when filtering
                const originalIndex = rankedCandidates.findIndex(c => c.id === candidate.id);
                const rank = originalIndex + 1;
                
                const isTop1 = rank === 1;
                const isUserVoted = candidate.id === userVote;

                let trendIcon = <Minus size={14} className="text-gray-500" />;
                let trendLabel = "Stable";
                let trendColor = "text-gray-500";

                if (isUserVoted) {
                    trendIcon = <Zap size={14} className="text-pink-500 fill-pink-500" />;
                    trendLabel = "Votre Boost";
                    trendColor = "text-pink-500";
                }
                else if (rank === 1) {
                    trendIcon = <Crown size={16} className="text-yellow-400" />;
                    trendLabel = "Leader";
                    trendColor = "text-yellow-400";
                }
                else if (rank < 3) {
                    trendIcon = <ArrowUp size={14} className="text-green-400" />;
                    trendLabel = "En hausse";
                    trendColor = "text-green-400";
                }
                else if (rank > 5) {
                    trendIcon = <ArrowDown size={14} className="text-red-400" />;
                    trendLabel = "En danger";
                    trendColor = "text-red-400";
                }

                return (
                <div 
                    key={candidate.id}
                    onClick={() => openModal(candidate)}
                    className={`relative flex items-center gap-3 p-2 pr-4 rounded-xl border transition-all duration-300 cursor-pointer group
                        ${isTop1 
                            ? 'bg-gradient-to-r from-yellow-900/10 to-black border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.05)]' 
                            : isUserVoted
                                ? 'bg-gradient-to-r from-pink-900/10 to-black border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.05)]'
                                : 'liquid-glass border-white/5 hover:border-pink-500/30 hover:bg-white/5'}
                    `}
                >
                    {/* Rank Number */}
                    <div className={`w-8 text-center font-black text-lg italic ${isTop1 ? 'text-yellow-400' : isUserVoted ? 'text-pink-500' : 'text-gray-600 group-hover:text-white transition-colors'}`}>
                        #{rank}
                    </div>
                    
                    {/* Avatar */}
                    <div className={`relative w-10 h-10 rounded-full p-[1px] ${isTop1 ? 'bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : isUserVoted ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.4)]' : 'bg-white/10 group-hover:bg-pink-500 transition-colors'}`}>
                        <img 
                            src={candidate.image} 
                            onError={(e) => handleImageError(e, candidate.name)}
                            className="w-full h-full rounded-full object-cover border border-black" 
                            alt={candidate.name} 
                        />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className={`font-bold text-sm truncate leading-tight ${isTop1 ? 'text-yellow-100' : isUserVoted ? 'text-pink-100' : 'text-white'}`}>{candidate.name}</h3>
                        <p className="text-pink-500 text-[10px] font-medium truncate">{candidate.handle}</p>
                    </div>

                    {/* Trend / Action */}
                    <div className="flex flex-col items-end justify-center min-w-[60px]">
                        {trendIcon}
                        <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${trendColor}`}>{trendLabel}</span>
                    </div>
                </div>
                );
            })}
            </div>
        </div>
      )}


      {/* Grid List - Compact Cards */}
      <section className="max-w-7xl mx-auto border-t border-white/10 pt-12">
        <h3 className="text-sm font-black text-center mb-10 flex items-center justify-center gap-3 text-gray-400 uppercase tracking-[0.2em]">
          {filteredAllCandidates.length > 0 ? 'Tous les Habitants' : 'Aucun candidat trouvé'}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAllCandidates.map((candidate) => {
             const isEliminated = candidate.status === 'ELIMINATED';
             const isLeft = candidate.status === 'LEFT';
             const isInactive = isEliminated || isLeft;
             
             return (
                <div 
                    key={candidate.id} 
                    onClick={() => openModal(candidate)}
                    className={`
                        relative liquid-glass rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 cursor-pointer border border-white/5 group
                        ${isInactive 
                            ? 'opacity-60 hover:opacity-100 scale-95 hover:scale-100' 
                            : 'hover:scale-[1.03] hover:-translate-y-1 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]'}
                    `}
                >
                    {/* Avatar Container */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3">
                        <div className={`absolute inset-0 rounded-full animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md
                            ${isInactive ? 'bg-gray-700' : 'bg-gradient-to-tr from-pink-500 to-purple-600'}`}>
                        </div>
                        <img 
                            src={candidate.image} 
                            onError={(e) => handleImageError(e, candidate.name)}
                            alt={candidate.name} 
                            className={`relative w-full h-full object-cover rounded-full border-2 transition-all duration-300 group-hover:scale-105
                                ${isInactive
                                    ? 'grayscale border-gray-700 opacity-70' 
                                    : 'border-white/10 group-hover:border-pink-500'}
                            `} 
                        />
                        {isEliminated && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                                <X className="text-red-500 w-8 h-8 drop-shadow-lg" strokeWidth={3} />
                            </div>
                        )}
                        {isLeft && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                                <LogOut className="text-gray-300 w-6 h-6 drop-shadow-lg" />
                            </div>
                        )}
                    </div>
                    
                    {/* Text Info */}
                    <h4 className={`font-bold text-sm md:text-base mb-0.5 truncate w-full ${isInactive ? 'text-gray-500 line-through decoration-red-500/50' : 'text-white'}`}>
                        {candidate.name}
                    </h4>
                    <p className="text-pink-500 text-[10px] md:text-xs font-bold mb-2 truncate w-full opacity-80 group-hover:text-pink-400 transition-colors">{candidate.handle}</p>
                    
                    <div className={`mt-auto w-full pt-2 border-t border-white/5`}>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium group-hover:text-white transition-colors">
                            Voir le profil
                        </span>
                    </div>
                </div>
             )
          })}
        </div>
      </section>

      {/* Enhanced Modal Details */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
           <div className="min-h-full md:min-h-0 flex items-center justify-center w-full py-10"> 
              <div className="liquid-glass-strong rounded-[2.5rem] max-w-md w-full overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.15)] relative animate-scale-up border border-white/10 flex flex-col transition-all duration-500">
                
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute top-4 right-4 bg-black/40 text-white rounded-full p-2 hover:bg-pink-600 transition-colors z-30 backdrop-blur-md"
                >
                  <X size={20} />
                </button>

                {/* Immersive Header */}
                <div className="relative h-52">
                    <div className="absolute inset-0 bg-gradient-to-b from-pink-900/30 to-[#050505] z-10"></div>
                    <img 
                        src={selectedCandidate.image} 
                        onError={(e) => handleImageError(e, selectedCandidate.name)}
                        alt="Background" 
                        className="w-full h-full object-cover opacity-50 blur-xl"
                    />
                    
                    {/* Floating Profile Pic */}
                    <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 z-20">
                        <div className={`relative w-32 h-32 rounded-full p-1.5 shadow-[0_0_40px_rgba(236,72,153,0.5)] bg-[#050505]
                            ${selectedCandidate.status === 'PRESENT' ? 'border-2 border-pink-500' : 'border-2 border-gray-600 grayscale'}`}>
                            <img 
                                src={selectedCandidate.image} 
                                onError={(e) => handleImageError(e, selectedCandidate.name)}
                                alt={selectedCandidate.name} 
                                className="w-full h-full rounded-full object-cover border-4 border-[#050505]"
                            />
                            {selectedCandidate.status === 'PRESENT' && (
                                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-[#050505] shadow-[0_0_10px_#22c55e]"></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Info */}
                <div className="pt-16 pb-8 px-8 text-center relative z-10 flex-1">
                    
                    <div className="mb-6">
                        <h2 className="text-4xl font-black text-white mb-1 drop-shadow-lg">{selectedCandidate.name}</h2>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-pink-500 font-bold text-lg flex items-center gap-1">
                                {selectedCandidate.handle}
                            </span>
                            {selectedCandidate.status === 'ELIMINATED' && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">ÉLIMINÉ</span>}
                            {selectedCandidate.status === 'LEFT' && <span className="bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">ABANDON</span>}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 min-w-[80px] flex flex-col items-center">
                            <Users size={16} className="text-pink-400 mb-1" />
                            <span className="font-black text-white text-sm">{selectedCandidate.followers}</span>
                            <span className="text-[9px] text-gray-500 uppercase font-bold">Abonnés</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 min-w-[80px] flex flex-col items-center">
                            <Sparkles size={16} className="text-purple-400 mb-1" />
                            <span className="font-black text-white text-sm">{selectedCandidate.age} ans</span>
                            <span className="text-[9px] text-gray-500 uppercase font-bold">Age</span>
                        </div>
                        {selectedCandidate.ranking && (
                             <div className="bg-white/5 border border-white/10 rounded-2xl p-3 min-w-[80px] flex flex-col items-center">
                                <TrendingUp size={16} className="text-yellow-400 mb-1" />
                                <span className="font-black text-white text-sm">#{selectedCandidate.ranking}</span>
                                <span className="text-[9px] text-gray-500 uppercase font-bold">Classement</span>
                            </div>
                        )}
                    </div>

                    {/* Bio Quote */}
                    <div className="relative mb-8">
                        <div className="absolute -top-4 -left-2 text-6xl text-white/5 font-serif">"</div>
                        <p className="text-gray-300 italic text-sm font-light leading-relaxed px-4">
                            {selectedCandidate.bio}
                        </p>
                        <div className="absolute -bottom-8 -right-2 text-6xl text-white/5 font-serif rotate-180">"</div>
                    </div>

                    {/* See More / Toggle */}
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all mb-6 group"
                    >
                        {showDetails ? 'Masquer les détails' : 'En savoir plus'}
                        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Expanded Content */}
                    {showDetails && (
                        <div className="animate-fade-in space-y-6 mb-6">
                             {/* Fake Video Player */}
                             <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
                                <img 
                                    src={selectedCandidate.image} 
                                    onError={(e) => handleImageError(e, selectedCandidate.name)}
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                                    alt="Video thumbnail"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(236,72,153,0.6)] group-hover:scale-110 transition-transform">
                                        <Play fill="white" className="text-white" size={20} />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                                    Dernier Buzz
                                </div>
                             </div>

                             {/* RPG Stats */}
                             <div className="space-y-3 bg-black/20 p-4 rounded-2xl">
                                <h4 className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Zap size={12} className="text-yellow-500" /> Statistiques
                                </h4>
                                {[
                                    { label: "Drama", value: 85, color: "bg-red-500" },
                                    { label: "Stratégie", value: 60, color: "bg-blue-500" },
                                    { label: "Popularité", value: 92, color: "bg-pink-500" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs">
                                        <span className="w-20 text-left font-bold text-gray-400">{stat.label}</span>
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${stat.color} shadow-[0_0_10px_currentColor]`} 
                                                style={{ width: `${stat.value}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white font-mono">{stat.value}%</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    <a 
                        href={selectedCandidate.tiktok}
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all duration-300 shadow-[0_5px_20px_rgba(236,72,153,0.4)]"
                    >
                        Voir sur TikTok
                    </a>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;