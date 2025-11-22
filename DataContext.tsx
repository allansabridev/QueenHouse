import React, { createContext, useContext, useState, useEffect } from 'react';
import { CANDIDATES as INITIAL_CANDIDATES, FAQS as INITIAL_FAQS, BOSSES as INITIAL_BOSSES } from '../constants';
import { Candidate, SiteConfig, LiveConfig, FAQItem, VoteTemplate, CandidateStats, Boss, BannerConfig } from '../types';

interface DataContextType {
  // CMS Data
  candidates: Candidate[];
  bosses: Boss[];
  liveUpdates: string[];
  faqs: FAQItem[];
  siteConfig: SiteConfig;
  liveConfig: LiveConfig;
  isCastingOpen: boolean;
  
  // Auth
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;

  // Actions
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  setLiveUpdates: React.Dispatch<React.SetStateAction<string[]>>;
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
  setIsCastingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  updateCandidate: (id: string, data: Partial<Candidate>) => void;
  updateCandidateStatus: (id: string, status: 'PRESENT' | 'ELIMINATED' | 'LEFT') => void;
  updateCandidateRanking: (id: string, rank: number) => void;
  
  updateBoss: (id: string, data: Partial<Boss>) => void;
  
  updateSiteConfig: (data: Partial<SiteConfig>) => void;
  updateLiveConfig: (data: Partial<LiveConfig>) => void;
  
  addFaq: (question: string, answer: string) => void;
  removeFaq: (id: string) => void;
  updateFaq: (id: string, data: Partial<FAQItem>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_LIVE_UPDATES = [
    "Matteo est au confessionnal...",
    "Grosse dispute dans la cuisine entre Sarah et Jaydan !",
    "Kayliah prépare une chorégraphie au bord de la piscine.",
    "Les Jumelles complotent dans la chambre rose...",
    "Ricardo vient d'arriver dans la villa !",
    "Adam s'entraîne encore à la salle de sport.",
    "Silence radio... Quelque chose se prépare."
];

// Default Configs
const DEFAULT_SITE_CONFIG: SiteConfig = {
    nav: {
        homeLabel: "Accueil",
        candidatesLabel: "Candidats",
        voteLabel: "Vote",
        liveLabel: "Live"
    },
    voteTemplate: 'POSTERS',
    countdownTarget: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    banner: {
        isVisible: false,
        text: "BREAKING NEWS : Un candidat va quitter l'aventure ce soir !",
        type: 'ALERT'
    }
};

const DEFAULT_LIVE_CONFIG: LiveConfig = {
    isLive: false,
    title: "Le Live reprend à 20h00",
    episodeInfo: "Saison 1 • Épisode 14",
    videoEmbedUrl: "" // Empty means placeholder
};

// Transform initial FAQs to have IDs
const HYDRATED_FAQS: FAQItem[] = INITIAL_FAQS.map((f, i) => ({ ...f, id: `faq-${i}` }));

// Transform Initial Candidates to have stats
const HYDRATED_CANDIDATES: Candidate[] = INITIAL_CANDIDATES.map(c => ({
    ...c,
    stats: c.stats || {
        drama: Math.floor(Math.random() * 40) + 60,
        strategy: Math.floor(Math.random() * 40) + 50,
        popularity: Math.floor(Math.random() * 40) + 60
    }
}));

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- State ---
  const [candidates, setCandidates] = useState<Candidate[]>(HYDRATED_CANDIDATES);
  const [bosses, setBosses] = useState<Boss[]>(INITIAL_BOSSES);
  const [liveUpdates, setLiveUpdates] = useState<string[]>(INITIAL_LIVE_UPDATES);
  const [faqs, setFaqs] = useState<FAQItem[]>(HYDRATED_FAQS);
  
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [liveConfig, setLiveConfig] = useState<LiveConfig>(DEFAULT_LIVE_CONFIG);
  
  const [isCastingOpen, setIsCastingOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check for existing session
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'true') {
        setIsAdmin(true);
    }
  }, []);

  // --- Auth Logic ---
  const login = (password: string) => {
    if (password === "queen123") {
        setIsAdmin(true);
        localStorage.setItem('admin_session', 'true');
        return true;
    }
    return false;
  };

  const logout = () => {
      setIsAdmin(false);
      localStorage.removeItem('admin_session');
  };

  // --- Actions ---

  const updateCandidate = (id: string, data: Partial<Candidate>) => {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const updateCandidateStatus = (id: string, status: 'PRESENT' | 'ELIMINATED' | 'LEFT') => {
      updateCandidate(id, { status });
  };

  const updateCandidateRanking = (id: string, rank: number) => {
      updateCandidate(id, { ranking: rank });
  };

  const updateBoss = (id: string, data: Partial<Boss>) => {
      setBosses(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const updateSiteConfig = (data: Partial<SiteConfig>) => {
      setSiteConfig(prev => ({ ...prev, ...data }));
  };

  const updateLiveConfig = (data: Partial<LiveConfig>) => {
      setLiveConfig(prev => ({ ...prev, ...data }));
  };

  const addFaq = (question: string, answer: string) => {
      const newFaq: FAQItem = { id: `faq-${Date.now()}`, question, answer };
      setFaqs(prev => [...prev, newFaq]);
  };

  const removeFaq = (id: string) => {
      setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const updateFaq = (id: string, data: Partial<FAQItem>) => {
      setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };

  return (
    <DataContext.Provider value={{
        candidates,
        setCandidates,
        bosses,
        liveUpdates,
        setLiveUpdates,
        faqs,
        setFaqs,
        siteConfig,
        liveConfig,
        isCastingOpen,
        setIsCastingOpen,
        isAdmin,
        login,
        logout,
        updateCandidate,
        updateCandidateStatus,
        updateCandidateRanking,
        updateBoss,
        updateSiteConfig,
        updateLiveConfig,
        addFaq,
        removeFaq,
        updateFaq
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};