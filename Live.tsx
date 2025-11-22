import React from 'react';
import { useData } from '../context/DataContext';

const Live: React.FC = () => {
  const { liveConfig, liveUpdates } = useData();

  return (
    <div className="min-h-screen bg-black pt-20 pb-10 px-4 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Video Section (Main) */}
        <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center relative overflow-hidden group">
                {liveConfig.videoEmbedUrl ? (
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={liveConfig.videoEmbedUrl} 
                        title="Live Player"
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-purple-900/20 animate-pulse"></div>
                        <div className="text-center z-10">
                            <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm mb-4 animate-pulse ${liveConfig.isLive ? 'bg-green-600' : 'bg-red-600'}`}>
                                ● {liveConfig.isLive ? 'EN DIRECT' : 'HORS LIGNE'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-300">{liveConfig.title}</h2>
                            <p className="text-gray-500 mt-2">Abonnes-toi pour la notif ! 🔔</p>
                        </div>
                    </>
                )}
            </div>
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{liveConfig.title}</h1>
                    <p className="text-gray-400 text-sm">{liveConfig.episodeInfo}</p>
                </div>
                <button className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-full font-bold transition-colors">
                    Partager
                </button>
            </div>
        </div>

        {/* Chat / Info Sidebar */}
        <div className="lg:col-span-1 bg-gray-900/50 rounded-2xl border border-gray-800 p-6 h-fit">
            <h3 className="font-bold text-lg mb-6 border-b border-gray-800 pb-2">En direct du Chat</h3>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 text-sm text-gray-300 scrollbar-thin">
                 {/* Simulated Chat */}
                <p><span className="text-pink-500 font-bold">@sarah_fan:</span> J'espère que Enzo va rester !!</p>
                <p><span className="text-purple-500 font-bold">@team_chloe:</span> Chloé la reine 👑</p>
                <p><span className="text-blue-500 font-bold">@user123:</span> C'est à quelle heure le résultat ?</p>
                <p><span className="text-yellow-500 font-bold">@modo_queen:</span> Pas de spam svp les amis</p>
                <div className="border-t border-gray-800 pt-4 mt-4">
                    <p className="font-bold text-xs text-gray-500 mb-2 uppercase">Dernières Actus</p>
                    {liveUpdates.slice(0, 3).map((update, i) => (
                        <p key={i} className="text-xs text-gray-400 mb-1">• {update}</p>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
                <h4 className="font-bold text-pink-400 mb-1 text-sm">PROCHAIN ÉVÉNEMENT</h4>
                <p className="font-bold text-lg">La Cérémonie</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Live;
