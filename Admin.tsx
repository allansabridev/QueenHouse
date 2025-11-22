import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Navigate } from 'react-router-dom';
import { 
    Users, Activity, Radio, Layout, Type, 
    Settings, Plus, X, Edit2, Trash2, Save, 
    Image as ImageIcon, Sliders, Crown, AlertTriangle, 
    Megaphone, MonitorPlay, BarChart3, UserCheck, Clock,
    LogOut, CheckCircle, Play
} from 'lucide-react';
import { Candidate, VoteTemplate, Boss } from '../types';

const InputGroup = ({ label, children }: { label: string, children?: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
        {children}
    </div>
);

const Admin: React.FC = () => {
  const { 
    isAdmin, logout, 
    candidates, setCandidates, updateCandidate, updateCandidateStatus, updateCandidateRanking,
    bosses, updateBoss,
    liveConfig, updateLiveConfig, liveUpdates, setLiveUpdates,
    siteConfig, updateSiteConfig,
    faqs, addFaq, removeFaq, updateFaq,
    isCastingOpen, setIsCastingOpen
  } = useData();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'candidates' | 'production' | 'config'>('dashboard');
  
  // Candidate Editing State
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);

  // Boss Editing State
  const [editingBoss, setEditingBoss] = useState<Boss | null>(null);
  const [isBossModalOpen, setIsBossModalOpen] = useState(false);

  // Ticker State
  const [newTickerMsg, setNewTickerMsg] = useState('');

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  const handleSaveCandidate = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingCandidate) {
          // Check if new or existing
          const exists = candidates.find(c => c.id === editingCandidate.id);
          if (exists) {
              updateCandidate(editingCandidate.id, editingCandidate);
          } else {
              setCandidates([...candidates, editingCandidate]);
          }
          setIsCandidateModalOpen(false);
          setEditingCandidate(null);
      }
  };

  const handleSaveBoss = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingBoss) {
          updateBoss(editingBoss.id, editingBoss);
          setIsBossModalOpen(false);
          setEditingBoss(null);
      }
  };

  const handleAddTicker = (e: React.FormEvent) => {
      e.preventDefault();
      if (newTickerMsg) {
          setLiveUpdates([...liveUpdates, newTickerMsg]);
          setNewTickerMsg('');
      }
  };

  const handleRemoveTicker = (index: number) => {
      setLiveUpdates(liveUpdates.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex font-sans text-white">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-black border-r border-white/10 flex flex-col fixed h-full z-20">
            <div className="p-6 flex items-center gap-3 border-b border-white/10">
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-sm animate-pulse">👑</div>
                <div>
                    <h1 className="font-black text-lg tracking-tighter leading-none">QUEEN <span className="text-pink-500">CMS</span></h1>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Control Room</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                    { id: 'candidates', label: 'Candidats', icon: Users },
                    { id: 'production', label: 'Production TV', icon: MonitorPlay },
                    { id: 'config', label: 'Configuration', icon: Settings },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                            ${activeTab === item.id 
                                ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                        `}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors font-bold text-sm"
                >
                    <LogOut size={16} /> Déconnexion
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 ml-64 p-8">
            
            {/* --- TAB: DASHBOARD --- */}
            {activeTab === 'dashboard' && (
                <div className="animate-fade-in space-y-8">
                    <header className="flex justify-between items-center">
                        <h2 className="text-3xl font-black text-white">Vue d'ensemble</h2>
                        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-widest">Système Opérationnel</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Candidats en lice</span>
                            <span className="text-4xl font-black text-white">{candidates.filter(c => c.status === 'PRESENT').length}</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Status Live</span>
                            <span className={`text-4xl font-black ${liveConfig.isLive ? 'text-green-500' : 'text-gray-500'}`}>
                                {liveConfig.isLive ? 'EN DIRECT' : 'OFF'}
                            </span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Casting</span>
                            <div className="flex items-center gap-4">
                                <span className={`text-2xl font-black ${isCastingOpen ? 'text-green-400' : 'text-red-400'}`}>
                                    {isCastingOpen ? 'OUVERT' : 'FERMÉ'}
                                </span>
                                <button 
                                    onClick={() => setIsCastingOpen(!isCastingOpen)}
                                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full"
                                >
                                    Changer
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/20 p-8 rounded-3xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-2">Bienvenue dans la Tour de Contrôle</h3>
                            <p className="text-gray-300 max-w-2xl">
                                Utilisez le menu latéral pour gérer les candidats, configurer l'émission en direct, ou modifier les paramètres globaux du site.
                                Toutes les modifications sont appliquées en temps réel.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: CANDIDATES --- */}
            {activeTab === 'candidates' && (
                <div className="animate-fade-in space-y-6">
                    <header className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-black text-white">Gestion des Candidats</h2>
                            <p className="text-gray-400 text-sm">Ajoutez, modifiez ou éliminez les habitants.</p>
                        </div>
                        <button 
                            onClick={() => {
                                setEditingCandidate({
                                    id: `p${Date.now()}`,
                                    name: '',
                                    status: 'PRESENT',
                                    image: '',
                                    tiktok: '',
                                    handle: '@',
                                    age: 18,
                                    followers: '0k',
                                    bio: '',
                                    ranking: 99,
                                    stats: { drama: 50, strategy: 50, popularity: 50 }
                                });
                                setIsCandidateModalOpen(true);
                            }}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                        >
                            <Plus size={18} /> Nouveau Candidat
                        </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {candidates.map(candidate => (
                            <div key={candidate.id} className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden group ${candidate.status !== 'PRESENT' ? 'opacity-60' : ''}`}>
                                <div className="relative h-48">
                                    <img src={candidate.image} className="w-full h-full object-cover" alt={candidate.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="font-bold text-lg text-white">{candidate.name}</h3>
                                        <p className="text-pink-500 text-xs font-bold">{candidate.handle}</p>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                                            candidate.status === 'PRESENT' ? 'bg-green-500 text-black' : 
                                            candidate.status === 'LEFT' ? 'bg-gray-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                            {candidate.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                        <span>Rang: #{candidate.ranking}</span>
                                        <span>{candidate.followers} subs</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                setEditingCandidate(candidate);
                                                setIsCandidateModalOpen(true);
                                            }}
                                            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                        >
                                            <Edit2 size={12} /> Éditer
                                        </button>
                                        {candidate.status === 'PRESENT' && (
                                            <button 
                                                onClick={() => updateCandidateStatus(candidate.id, 'ELIMINATED')}
                                                className="flex-1 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                            >
                                                <X size={12} /> Éliminer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- TAB: PRODUCTION --- */}
            {activeTab === 'production' && (
                <div className="animate-fade-in space-y-12">
                    
                    {/* LIVE CONTROL */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black border-b border-white/10 pb-4 flex items-center gap-3">
                            <Radio className="text-red-500" /> Régie Live
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">État du Flux</h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={liveConfig.isLive}
                                            onChange={(e) => updateLiveConfig({ isLive: e.target.checked })}
                                        />
                                        <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-300">{liveConfig.isLive ? 'ON AIR' : 'OFF AIR'}</span>
                                    </label>
                                </div>
                                <InputGroup label="Titre de l'épisode">
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-pink-500 outline-none"
                                        value={liveConfig.title}
                                        onChange={(e) => updateLiveConfig({ title: e.target.value })}
                                    />
                                </InputGroup>
                                <InputGroup label="Sous-titre / Info">
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-pink-500 outline-none"
                                        value={liveConfig.episodeInfo}
                                        onChange={(e) => updateLiveConfig({ episodeInfo: e.target.value })}
                                    />
                                </InputGroup>
                                <InputGroup label="Embed URL (YouTube/Twitch)">
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-pink-500 outline-none"
                                        value={liveConfig.videoEmbedUrl}
                                        onChange={(e) => updateLiveConfig({ videoEmbedUrl: e.target.value })}
                                        placeholder="https://www.youtube.com/embed/..."
                                    />
                                </InputGroup>
                            </div>

                            {/* TICKER MANAGEMENT */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                                <h3 className="font-bold text-lg mb-4">Messages "En Direct"</h3>
                                <div className="flex-1 overflow-y-auto max-h-48 space-y-2 mb-4 scrollbar-thin pr-2">
                                    {liveUpdates.map((msg, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 text-sm">
                                            <span>{msg}</span>
                                            <button onClick={() => handleRemoveTicker(idx)} className="text-red-500 hover:text-white"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleAddTicker} className="flex gap-2 mt-auto">
                                    <input 
                                        type="text" 
                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-pink-500 outline-none"
                                        placeholder="Nouveau message..."
                                        value={newTickerMsg}
                                        onChange={(e) => setNewTickerMsg(e.target.value)}
                                    />
                                    <button type="submit" className="bg-pink-600 px-4 py-2 rounded-lg font-bold text-sm">Ajouter</button>
                                </form>
                            </div>
                        </div>
                    </section>

                    {/* BANNER CONFIG */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black border-b border-white/10 pb-4 flex items-center gap-3">
                            <Megaphone className="text-yellow-500" /> Bandeau "Breaking News"
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={siteConfig.banner.isVisible}
                                        onChange={(e) => updateSiteConfig({ banner: { ...siteConfig.banner, isVisible: e.target.checked } })}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                    <span className="ml-3 text-sm font-bold uppercase">Activer le bandeau</span>
                                </label>
                                
                                <div className="flex gap-2">
                                    {['INFO', 'ALERT', 'LIVE'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => updateSiteConfig({ banner: { ...siteConfig.banner, type: type as any } })}
                                            className={`px-3 py-1 rounded text-xs font-bold border ${siteConfig.banner.type === type ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-gray-600'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <InputGroup label="Texte du bandeau">
                                <input 
                                    type="text" 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-pink-500 outline-none font-mono text-yellow-400"
                                    value={siteConfig.banner.text}
                                    onChange={(e) => updateSiteConfig({ banner: { ...siteConfig.banner, text: e.target.value } })}
                                />
                            </InputGroup>
                        </div>
                    </section>

                    {/* BOSS MANAGEMENT */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black border-b border-white/10 pb-4 flex items-center gap-3">
                            <Crown className="text-purple-500" /> Les Bosses
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {bosses.map(boss => (
                                <div key={boss.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-800 mb-4 overflow-hidden border-2 border-white/10">
                                        <img src={boss.image} className="w-full h-full object-cover" alt={boss.name} />
                                    </div>
                                    <h3 className="font-bold text-white">{boss.name}</h3>
                                    <p className="text-pink-500 text-xs mb-4">{boss.role}</p>
                                    <button 
                                        onClick={() => { setEditingBoss(boss); setIsBossModalOpen(true); }}
                                        className="mt-auto bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                                    >
                                        <Edit2 size={12} /> Modifier
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {/* --- TAB: CONFIG --- */}
            {activeTab === 'config' && (
                <div className="animate-fade-in space-y-12">
                    
                    {/* SITE SETTINGS */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black border-b border-white/10 pb-4">Paramètres Généraux</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Layout size={18}/> Navigation</h3>
                                <InputGroup label="Label Accueil">
                                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" value={siteConfig.nav.homeLabel} onChange={(e) => updateSiteConfig({ nav: { ...siteConfig.nav, homeLabel: e.target.value } })} />
                                </InputGroup>
                                <InputGroup label="Label Candidats">
                                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" value={siteConfig.nav.candidatesLabel} onChange={(e) => updateSiteConfig({ nav: { ...siteConfig.nav, candidatesLabel: e.target.value } })} />
                                </InputGroup>
                                <InputGroup label="Label Vote">
                                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" value={siteConfig.nav.voteLabel} onChange={(e) => updateSiteConfig({ nav: { ...siteConfig.nav, voteLabel: e.target.value } })} />
                                </InputGroup>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock size={18}/> Compte à Rebours</h3>
                                <InputGroup label="Date Cible (ISO Format)">
                                    <input 
                                        type="datetime-local" 
                                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white"
                                        value={siteConfig.countdownTarget ? new Date(siteConfig.countdownTarget).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => updateSiteConfig({ countdownTarget: new Date(e.target.value).toISOString() })}
                                    />
                                </InputGroup>
                                <p className="text-xs text-gray-500">Cela contrôle le timer affiché sur la page d'accueil.</p>
                            </div>
                        </div>
                    </section>

                    {/* VOTE TEMPLATE */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black border-b border-white/10 pb-4">Design Page Vote</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'POSTERS', label: 'Affiches (Posters)' },
                                { id: 'GRID', label: 'Grille Compacte' },
                                { id: 'LIST', label: 'Liste Simple' }
                            ].map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => updateSiteConfig({ voteTemplate: tpl.id as VoteTemplate })}
                                    className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all
                                        ${siteConfig.voteTemplate === tpl.id 
                                            ? 'border-pink-500 bg-pink-500/10 shadow-lg' 
                                            : 'border-white/10 hover:bg-white/5'}
                                    `}
                                >
                                    <Layout size={24} className={siteConfig.voteTemplate === tpl.id ? 'text-pink-500' : 'text-gray-500'} />
                                    <span className="font-bold text-sm">{tpl.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* FAQ EDITOR */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black border-b border-white/10 pb-4">FAQ</h2>
                        <div className="space-y-4">
                            {faqs.map(faq => (
                                <div key={faq.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <input 
                                            className="w-full bg-transparent font-bold text-white outline-none border-b border-transparent focus:border-pink-500"
                                            value={faq.question}
                                            onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
                                        />
                                        <textarea 
                                            className="w-full bg-transparent text-sm text-gray-400 outline-none resize-none h-16 border-b border-transparent focus:border-pink-500"
                                            value={faq.answer}
                                            onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
                                        />
                                    </div>
                                    <button onClick={() => removeFaq(faq.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded h-fit">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={() => addFaq("Nouvelle Question ?", "Réponse ici...")}
                                className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-500 hover:text-white hover:border-white/40 font-bold text-sm flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Ajouter une question
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </main>

        {/* --- MODAL: EDIT CANDIDATE --- */}
        {isCandidateModalOpen && editingCandidate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#111] border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111] z-10">
                        <h3 className="text-2xl font-black">Éditer Candidat</h3>
                        <button onClick={() => setIsCandidateModalOpen(false)}><X className="text-gray-400 hover:text-white" /></button>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-black rounded-xl aspect-square w-full overflow-hidden border-2 border-dashed border-white/20 flex items-center justify-center relative group">
                                {editingCandidate.image ? (
                                    <img src={editingCandidate.image} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <ImageIcon className="mx-auto mb-2" size={32} />
                                        <span className="text-xs">Aperçu Image</span>
                                    </div>
                                )}
                            </div>
                            <InputGroup label="URL Image">
                                <input 
                                    type="text" 
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm focus:border-pink-500 outline-none"
                                    value={editingCandidate.image}
                                    onChange={(e) => setEditingCandidate({ ...editingCandidate, image: e.target.value })}
                                />
                            </InputGroup>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Nom">
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none font-bold"
                                        value={editingCandidate.name} onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })} />
                                </InputGroup>
                                <InputGroup label="Handle (@)">
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none text-pink-500"
                                        value={editingCandidate.handle} onChange={(e) => setEditingCandidate({ ...editingCandidate, handle: e.target.value })} />
                                </InputGroup>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <InputGroup label="Age">
                                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none"
                                        value={editingCandidate.age} onChange={(e) => setEditingCandidate({ ...editingCandidate, age: parseInt(e.target.value) })} />
                                </InputGroup>
                                <InputGroup label="Abonnés">
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none"
                                        value={editingCandidate.followers} onChange={(e) => setEditingCandidate({ ...editingCandidate, followers: e.target.value })} />
                                </InputGroup>
                                <InputGroup label="Classement">
                                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none text-yellow-400 font-bold"
                                        value={editingCandidate.ranking || 99} onChange={(e) => setEditingCandidate({ ...editingCandidate, ranking: parseInt(e.target.value) })} />
                                </InputGroup>
                            </div>

                            <InputGroup label="Statut">
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none"
                                    value={editingCandidate.status}
                                    onChange={(e) => setEditingCandidate({ ...editingCandidate, status: e.target.value as any })}
                                >
                                    <option value="PRESENT">PRESENT</option>
                                    <option value="ELIMINATED">ELIMINATED</option>
                                    <option value="LEFT">LEFT (ABANDON)</option>
                                </select>
                            </InputGroup>

                            <InputGroup label="Bio">
                                <textarea className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none h-24 resize-none"
                                    value={editingCandidate.bio} onChange={(e) => setEditingCandidate({ ...editingCandidate, bio: e.target.value })} />
                            </InputGroup>

                            {/* SLIDERS */}
                            <div className="bg-white/5 p-4 rounded-xl space-y-4">
                                <h4 className="font-bold text-sm flex items-center gap-2"><Sliders size={14}/> Stats RPG</h4>
                                {[
                                    { label: 'Drama', key: 'drama', color: 'accent-red-500' },
                                    { label: 'Stratégie', key: 'strategy', color: 'accent-blue-500' },
                                    { label: 'Popularité', key: 'popularity', color: 'accent-pink-500' }
                                ].map((stat) => (
                                    <div key={stat.key} className="flex items-center gap-3 text-xs">
                                        <span className="w-20">{stat.label}</span>
                                        <input 
                                            type="range" 
                                            min="0" max="100" 
                                            className={`flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${stat.color}`}
                                            value={editingCandidate.stats?.[stat.key as keyof typeof editingCandidate.stats] || 50}
                                            onChange={(e) => setEditingCandidate({
                                                ...editingCandidate,
                                                stats: { ...editingCandidate.stats!, [stat.key]: parseInt(e.target.value) }
                                            })}
                                        />
                                        <span className="w-8 text-right font-mono">{editingCandidate.stats?.[stat.key as keyof typeof editingCandidate.stats]}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 flex justify-end gap-4 sticky bottom-0 bg-[#111]">
                        <button onClick={() => setIsCandidateModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5">Annuler</button>
                        <button onClick={handleSaveCandidate} className="px-8 py-3 rounded-xl font-bold bg-pink-600 text-white hover:bg-pink-700 shadow-lg flex items-center gap-2">
                            <Save size={18} /> Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- MODAL: EDIT BOSS --- */}
        {isBossModalOpen && editingBoss && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#111] border border-white/20 rounded-2xl w-full max-w-xl p-8 shadow-2xl space-y-6">
                    <h3 className="text-2xl font-black">Modifier Boss: {editingBoss.name}</h3>
                    
                    <div className="space-y-4">
                        <InputGroup label="Nom">
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none"
                                value={editingBoss.name} onChange={(e) => setEditingBoss({ ...editingBoss, name: e.target.value })} />
                        </InputGroup>
                        <InputGroup label="Rôle">
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none text-pink-500"
                                value={editingBoss.role} onChange={(e) => setEditingBoss({ ...editingBoss, role: e.target.value })} />
                        </InputGroup>
                        <InputGroup label="URL Image">
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none"
                                value={editingBoss.image} onChange={(e) => setEditingBoss({ ...editingBoss, image: e.target.value })} />
                        </InputGroup>
                        <InputGroup label="Description">
                             <textarea className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-pink-500 outline-none h-24 resize-none"
                                    value={editingBoss.description} onChange={(e) => setEditingBoss({ ...editingBoss, description: e.target.value })} />
                        </InputGroup>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button onClick={() => setIsBossModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-gray-400 hover:bg-white/5">Annuler</button>
                        <button onClick={handleSaveBoss} className="px-6 py-2 rounded-lg font-bold bg-pink-600 text-white hover:bg-pink-700">Sauvegarder</button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default Admin;