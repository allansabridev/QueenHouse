import { Boss, Candidate, FAQItem } from './types';

export const BOSSES: Boss[] = [
  {
    id: 'ricardo',
    name: 'Ricardo',
    role: 'Le Pilier',
    description: "Toujours là pour remettre de l'ordre quand ça part en vrille.",
    image: 'https://ik.imagekit.io/cowouiutw/Image/ricardo.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@ricardo'
  },
  {
    id: 'yuma',
    name: 'Yuma',
    role: 'La Bestie',
    description: "L'énergie solaire, mais attention si on touche à ses amis.",
    image: 'https://ik.imagekit.io/cowouiutw/Image/Yuma.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@yuma'
  },
  {
    id: 'benoit',
    name: 'Benoît Chevalier',
    role: 'Le Créateur',
    description: "The Queen herself. C'est lui qui décide tout, drama queen assumée.",
    image: 'https://ik.imagekit.io/cowouiutw/benoit.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@benoit_chevalier'
  }
];

export const CANDIDATES: Candidate[] = [
  // PRESENT (7)
  {
    id: 'p1',
    name: 'Kayliah',
    status: 'PRESENT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Kayliah.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@kayliah',
    age: 19,
    followers: '2.1M',
    bio: "La reine du dancefloor, intouchable cette saison.",
    ranking: 1
  },
  {
    id: 'p2',
    name: 'Les Jumelles',
    status: 'PRESENT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/lesjumelles.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@lesjumelles',
    age: 20,
    followers: '3.5M',
    bio: "Laurelia et Ameliane. Deux fois plus de style, deux fois plus de drama.",
    ranking: 2
  },
  {
    id: 'p3',
    name: 'Matteo',
    status: 'PRESENT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Matteo.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@matteo',
    age: 21,
    followers: '2.3M',
    bio: "Le charme italien qui fait craquer toute la villa.",
    ranking: 3
  },
  {
    id: 'p4',
    name: 'Sarah',
    status: 'PRESENT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Sarah.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@sarah',
    age: 18,
    followers: '1.5M',
    bio: "Petite mais redoutable. Ne la sous-estimez pas.",
    ranking: 4
  },
  {
    id: 'p5',
    name: 'Jaydan',
    status: 'PRESENT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Jaydan.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@jaydan',
    age: 22,
    followers: '900k',
    bio: "Toujours le mot pour rire, mais stratège dans l'âme.",
    ranking: 5
  },
  {
    id: 'p6',
    name: 'Adam',
    status: 'PRESENT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Adam.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@adam',
    age: 23,
    followers: '1.1M',
    bio: "Le sportif de la maison, mental d'acier.",
    ranking: 6
  },
  {
    id: 'p7',
    name: 'Jeanine',
    status: 'PRESENT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/jeanine.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@jeanine',
    age: 24,
    followers: '800k',
    bio: "La maman du groupe, mais gare à qui la cherche.",
    ranking: 7
  },

  // LEFT (Voluntary Departure) (5)
  {
    id: 'l1',
    name: 'Adel',
    status: 'LEFT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Adel.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@adel',
    age: 21,
    followers: '1.8M',
    bio: "A quitté l'aventure pour des raisons personnelles.",
    ranking: 99
  },
  {
    id: 'l2',
    name: 'Nicolas',
    status: 'LEFT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Nicola.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@nicolas',
    age: 20,
    followers: '1.2M',
    bio: "N'a pas supporté la pression de la villa.",
    ranking: 99
  },
  {
    id: 'l3',
    name: 'Malou',
    status: 'LEFT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Malou.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@malou',
    age: 19,
    followers: '600k',
    bio: "Partie vers de nouveaux horizons.",
    ranking: 99
  },
  {
    id: 'l4',
    name: 'Assia',
    status: 'LEFT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Assia.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@assia',
    age: 22,
    followers: '950k',
    bio: "Une décision difficile mais nécessaire.",
    ranking: 99
  },
  {
    id: 'l5',
    name: 'Timéo',
    status: 'LEFT',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Timeo.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@timeo',
    age: 20,
    followers: '750k',
    bio: "L'aventure était trop intense pour lui.",
    ranking: 99
  },

  // ELIMINATED (5)
  {
    id: 'e1',
    name: 'Alice',
    status: 'ELIMINATED',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Alice.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@alice',
    age: 19,
    followers: '400k',
    bio: "Éliminée aux portes de la finale.",
    ranking: 8
  },
  {
    id: 'e2',
    name: 'Linda',
    status: 'ELIMINATED',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Linda.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@linda',
    age: 21,
    followers: '550k',
    bio: "Son franc-parler lui a coûté sa place.",
    ranking: 9
  },
  {
    id: 'e3',
    name: 'Enzo',
    status: 'ELIMINATED',
    image: 'https://ik.imagekit.io/cowouiutw/Image/enzo.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@enzo',
    age: 23,
    followers: '800k',
    bio: "Game over pour le gamer.",
    ranking: 10
  },
  {
    id: 'e4',
    name: 'Marouane',
    status: 'ELIMINATED',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Marouane.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@marouane',
    age: 22,
    followers: '1.0M',
    bio: "Le public a tranché.",
    ranking: 11
  },
  {
    id: 'e5',
    name: 'Jeanny',
    status: 'ELIMINATED',
    image: 'https://ik.imagekit.io/cowouiutw/Image/Jeanny.jpg',
    tiktok: 'https://tiktok.com',
    handle: '@jeanny',
    age: 20,
    followers: '650k',
    bio: "Une aventure courte mais intense.",
    ranking: 12
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'q1',
    question: "C'est quoi la Queen House ?",
    answer: "C'est LA villa où tout se passe ! Benoît a réuni ses créateurs préférés pour vivre ensemble, créer du contenu de ouf et relever des défis incroyables."
  },
  {
    id: 'q2',
    question: "Comment on regarde ?",
    answer: "Tout se passe sur TikTok et Instagram ! Check les lives tous les soirs à 20h."
  },
  {
    id: 'q3',
    question: "C'est fake ou pas ?",
    answer: "100% réel ma chérie. Les embrouilles, les rires, les larmes... tout est vrai."
  },
  {
    id: 'q4',
    question: "Je peux venir visiter ?",
    answer: "Mdr non, c'est une résidence privée ! Mais t'inquiète, on te montre tout en story."
  }
];
