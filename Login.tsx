import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useData();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
        navigate('/admin');
    } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>

        <div className="max-w-md w-full relative z-10">
            <div className="liquid-glass-strong rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center border border-white/10 shadow-inner relative">
                        <div className="absolute inset-0 rounded-full border border-pink-500/30 animate-spin-slow"></div>
                        <Lock size={32} className="text-pink-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-center text-white mb-2 uppercase tracking-tighter">
                    Accès <span className="text-pink-500">Admin</span>
                </h1>
                <p className="text-center text-gray-500 text-xs mb-8 uppercase tracking-widest">Zone restreinte • Staff Only</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <div className={`relative transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
                            <input 
                                type="password" 
                                placeholder="Entrez le code d'accès..." 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-6 py-4 bg-black/50 border rounded-xl text-white text-center font-bold tracking-[0.5em] placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:bg-black transition-all
                                    ${error ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 focus:border-pink-500 focus:shadow-[0_0_20px_rgba(236,72,153,0.3)]'}
                                `}
                            />
                        </div>
                        {error && (
                            <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider animate-fade-in">
                                <AlertCircle size={12} /> Accès refusé
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-pink-500 hover:text-white transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2 group"
                    >
                        Connexion <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Login;