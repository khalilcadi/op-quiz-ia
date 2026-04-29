import type { Questionnaire } from '../types';

const questionnaireA_brunch: Questionnaire = [
  {
    id: 'A0',
    messages: [
      'Yooo 👋 Bienvenue dans le tirage au sort pour 2 places pour {{EVENT_NAME}} le {{EVENT_DATE}} !',
      'Pour participer c\'est simple : tu réponds à quelques questions (ça prend 3 min max) et t\'es inscrit·e au tirage.',
      'Cette fois on explore un truc précis : le social en soirée. Prêt·e ?',
    ],
    inputType: 'buttons',
    options: [
      { label: "Let's go 🎶", value: 'lets_go' },
      { label: "C'est parti", value: 'cest_parti' },
    ],
    next: 'A1',
    dataKey: 'opt_in',
  },
  {
    id: 'A1',
    messages: [
      'Première question facile — tu sors combien de fois par mois en soirée / club / festival ?',
    ],
    inputType: 'buttons',
    options: [
      { label: '1-2 fois', value: '1-2' },
      { label: '3-4 fois', value: '3-4' },
      { label: '5+ fois', value: '5+' },
      { label: "Moins d'une fois", value: 'moins_1' },
    ],
    next: 'A2',
    dataKey: 'frequence_sortie',
  },
  {
    id: 'A2',
    messages: [
      'Si tu pouvais voir en temps réel qui va où ce soir — tes potes, des gens que tu connais — ça te motiverait à sortir ?',
    ],
    inputType: 'text',
    minTextLength: 10,
    relanceMessage: 'Sois honnête — ça t\'intéresse, ça t\'inquiète ? 👀',
    next: 'A3',
    dataKey: 'realtime_social',
  },
  {
    id: 'A3',
    messages: [
      "Au final, qu'est-ce qui te motiverait à sortir plus souvent ?",
    ],
    inputType: 'text',
    minTextLength: 10,
    relanceMessage: 'Allez dis-moi ce qui ferait vraiment la diff 😄',
    next: 'A4',
    dataKey: 'motivation_sortir',
  },
  {
    id: 'A4',
    messages: [
      "Si l'IA pouvait te faire rencontrer des gens qui ont la même vibe que toi pour sortir ce soir, t'essaierais ?",
    ],
    inputType: 'text',
    minTextLength: 10,
    relanceMessage: 'Tente ou flippe — dis-moi pourquoi 😏',
    next: 'A5',
    dataKey: 'meet_people',
  },
  {
    id: 'A5',
    messages: [
      'Top, merci pour tes réponses 🙏',
      'Allez on finit par les trucs rapides pour le tirage 🎰',
      'T\'as quel âge ?',
    ],
    inputType: 'buttons',
    options: [
      { label: '18-21', value: '18-21' },
      { label: '22-25', value: '22-25' },
      { label: '26-30', value: '26-30' },
      { label: '31+', value: '31+' },
    ],
    next: 'A6',
    dataKey: 'age',
  },
  {
    id: 'A6',
    messages: [
      'Et tu te définis comment ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Homme', value: 'homme' },
      { label: 'Femme', value: 'femme' },
      { label: 'Non-binaire', value: 'non_binaire' },
      { label: 'Préfère ne pas dire', value: 'prefere_pas_dire' },
    ],
    next: 'A7',
    dataKey: 'genre',
  },
  {
    id: 'A7',
    messages: [
      'Comment tu t\'appelles ?',
    ],
    inputType: 'text',
    minTextLength: 2,
    relanceMessage: 'Juste ton prénom !',
    next: 'A8',
    dataKey: 'prenom',
  },
  {
    id: 'A8',
    messages: [
      'Et ton email ? C\'est pour te recontacter si tu gagnes les places 🎟️',
    ],
    inputType: 'text',
    inputMode: 'email',
    relanceMessage: 'J\'ai besoin d\'un email valide pour le tirage 📧',
    next: 'A9',
    dataKey: 'email',
  },
  {
    id: 'A9',
    messages: [
      'C\'est bon {{prenom}}, t\'es inscrit·e au tirage pour {{EVENT_NAME}} ! 🎉',
      'Le tirage a lieu le {{DRAW_DATE}}, je te recontacte ici si t\'as gagné.',
      'En attendant, si tu veux tester le chatbot OnParty pour tes prochaines sorties, tu peux lui demander ce que tu veux — genre "quoi faire ce samedi à Paris" ou "c\'est quoi le dress code pour [CLUB]"',
      'Bon Brunch 🌞',
    ],
    inputType: 'none',
    next: '',
    dataKey: 'completion',
  },
];

export default questionnaireA_brunch;
