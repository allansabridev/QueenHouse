import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Heart, AlertTriangle, CheckCircle, Lock, Zap, Activity, ShieldCheck } from 'lucide-react';
import { VoteTemplate } from '../types';

const Vote: React.FC = () => {
  const { candidates, siteConfig } = useData();
  const activeCandidates = candidates.filter(c => c.status === 'PRESENT');
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState<string | null>(null); // ID of candidate being voted for
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    if (votedFor || isVoting) return;
    
    setIsVoting(id);

    // Simulation of network/dramatic delay
    setTimeout(() => {
        setVotedFor(id);
        setIsVoting(null);
        
        // Play success sound
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-new-item-game-notification-254.mp3');
        audio.volume = 0.5;
        audio.play().catch(error => console.log("Audio playback prevented:", error));
    }, 1500);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200&bold=true&format=svg`;
  };

  const template = siteConfig.voteTemplate;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-[#050505] relative overflow-x-hidden">
      
      {/* Background Atmospherics */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-pink-500/10 to-transparent blur-xl -z-10"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/50 rounded-full text-red-400 text-xs font-bold tracking-[0.2em] mb-6 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span> VOTE ÉLIMINATOIRE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
                Sauve ton <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 animate-gradient-x">Favori</span>
            </h1>
        </div>

        {/* --- TEMPLATE: POSTERS (DEFAULT) --- */}
        {template === 'POSTERS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
                {activeCandidates.map((candidate) => {
                    const isSelected = votedFor === candidate.id;
                    const isProcessing = isVoting === candidate.id;
                    const isDimmed = (hoveredId !== null && hoveredId !== candidate.id) || (votedFor !== null && !isSelected);
                    const isLocked = votedFor !== null && !isSelected;

                    return (
                        <div 
                            key={candidate.id}
                            onMouseEnter={() => !votedFor && setHoveredId(candidate.id)}
                            onMouseLeave={() => !votedFor && setHoveredId(null)}
                            onClick={() => handleVote(candidate.id)}
                            className={`
                                relative group rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer h-[450px] border
                                ${isSelected 
                                    ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)] scale-[1.02] z-10 ring-4 ring-green-500/20' 
                                    : isProcessing
                                        ? 'border-pink-500 scale-95 animate-pulse'
                                        : isDimmed
                                            ? 'border-white/5 opacity-40 grayscale scale-95 blur-[2px]'
                                            : 'liquid-glass border-white/10 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] hover:-translate-y-2'
                                }
                            `}
                        >
                            <img src={candidate.image} onError={(e) => handleImageError(e, candidate.name)} alt={candidate.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${isSelected ? 'opacity-90' : 'opacity-60 group-hover:opacity-40'}`}></div>
                            
                            {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"><Lock className="text-gray-500" size={48} /></div>}
                            {isProcessing && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
                                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <span className="text-pink-500 font-bold text-sm tracking-widest animate-pulse">ENREGISTREMENT...</span>
                                </div>
                            )}
                            {isSelected && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 animate-scale-up">
                                    <div className="bg-green-500 rounded-full p-4 mb-4 shadow-[0_0_30px_#22c55e]"><CheckCircle size={48} className="text-black" strokeWidth={3} /></div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-1">Vote Validé</h3>
                                </div>
                            )}

                            <div className={`absolute bottom-0 left-0 w-full p-6 transform transition-all duration-500 ${isSelected ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                                <h2 className="text-3xl font-black text-white mb-1 uppercase italic tracking-tighter group-hover:text-pink-500 transition-colors">{candidate.name}</h2>
                                <p className="text-gray-300 text-xs font-bold tracking-widest mb-6">{candidate.handle}</p>
                                <button className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 ${votedFor ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-pink-600 hover:text-white hover:scale-[1.02] shadow-lg'}`}>
                                    {votedFor ? <Lock size={14} /> : <ShieldCheck size={16} />} {votedFor ? 'Verrouillé' : 'Sauver'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {/* --- TEMPLATE: GRID (COMPACT) --- */}
        {template === 'GRID' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {activeCandidates.map((candidate) => {
                     const isSelected = votedFor === candidate.id;
                     return (
                        <div key={candidate.id} onClick={() => handleVote(candidate.id)} className={`relative liquid-glass rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 cursor-pointer border ${isSelected ? 'border-green-500 bg-green-900/20' : 'border-white/10 hover:border-pink-500 hover:shadow-lg'}`}>
                            <div className="w-20 h-20 rounded-full p-1 mb-3 bg-gradient-to-tr from-gray-700 to-gray-800">
                                <img src={candidate.image} onError={(e) => handleImageError(e, candidate.name)} className="w-full h-full rounded-full object-cover" alt={candidate.name} />
                            </div>
                            <h4 className="font-bold text-white">{candidate.name}</h4>
                            {isSelected && <span className="text-green-500 font-bold text-xs mt-2">VOTÉ</span>}
                        </div>
                     );
                })}
            </div>
        )}

        {/* --- TEMPLATE: LIST (SIMPLE) --- */}
        {template === 'LIST' && (
            <div className="max-w-3xl mx-auto space-y-4">
                {activeCandidates.map((candidate) => {
                     const isSelected = votedFor === candidate.id;
                     return (
                        <div key={candidate.id} onClick={() => handleVote(candidate.id)} className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-green-900/20 border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                            <div className="flex items-center gap-4">
                                <img src={candidate.image} onError={(e) => handleImageError(e, candidate.name)} className="w-12 h-12 rounded-full object-cover" alt={candidate.name} />
                                <div>
                                    <h4 className="font-bold text-white">{candidate.name}</h4>
                                    <p className="text-xs text-gray-400">{candidate.handle}</p>
                                </div>
                            </div>
                            <button className={`px-6 py-2 rounded-full font-bold text-xs uppercase ${isSelected ? 'bg-green-500 text-black' : 'bg-white text-black'}`}>
                                {isSelected ? 'Validé' : 'Voter'}
                            </button>
                        </div>
                     );
                })}
            </div>
        )}

        {/* Footer Warning */}
        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 bg-white/5 px-6 py-3 rounded-full border border-white/5">
                <AlertTriangle size={14} className="text-yellow-500" />
                <span className="uppercase tracking-widest">Attention : Le vote est définitif et irréversible.</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Vote;
