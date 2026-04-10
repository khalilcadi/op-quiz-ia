import type { Questionnaire } from '../types';

const questionnaireA: Questionnaire = [
  {
    id: 'A0',
    messages: [
      'Yooo 👋 Bienvenue dans le tirage au sort pour 2 places pour {{EVENT_NAME}} le {{EVENT_DATE}} !',
      'Pour participer c\'est simple : tu réponds à quelques questions (ça prend 4 min max) et t\'es inscrit·e au tirage.',
      'Mais c\'est pas un questionnaire relou promis — je veux juste comprendre comment tu sors à Paris. Prêt·e ?',
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
      'Et quand tu décides de sortir, ça se passe comment ? Tu fais quoi concrètement pour trouver ta soirée ?',
      'Dis-moi ton process, même si c\'est le bordel 😄',
    ],
    inputType: 'text',
    minTextLength: 10,
    relanceMessage: 'Allez dis-moi un peu plus, même en 2 phrases 😄',
    next: 'A3',
    dataKey: 'process_decision',
  },
  {
    id: 'A3',
    messages: [
      'Ok je vois.',
      'Et c\'est quoi le truc qui te saoule le plus dans tout ça ? Le moment où tu te dis "putain c\'est chiant" quand tu veux sortir ?',
    ],
    inputType: 'text',
    minTextLength: 10,
    relanceMessage: 'T\'as bien un truc qui te gonfle, non ? 😏',
    next: 'A4a',
    dataKey: 'frustration_principale',
  },
  {
    id: 'A4a',
    messages: [
      'Et tu sors plutôt solo, en petit crew, ou en mode grosse bande ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Solo', value: 'solo' },
      { label: 'Duo-trio', value: 'duo_trio' },
      { label: 'Crew de 4-8', value: 'crew_4_8' },
      { label: 'Grosse bande 8+', value: 'grosse_bande_8+' },
      { label: 'Ça dépend', value: 'ca_depend' },
    ],
    next: 'A4b',
    dataKey: 'crew_size',
  },
  {
    id: 'A4b',
    messages: [
      'Et c\'est facile de motiver le crew ou c\'est toujours le même bordel ?',
    ],
    inputType: 'text',
    minTextLength: 10,
    relanceMessage: 'Genre ça se passe comment d\'habitude ?',
    next: 'A5',
    dataKey: 'crew_dynamique',
  },
  {
    id: 'A5',
    messages: [
      'Ok maintenant on va un peu rêver 🌙',
      'Si tu avais un assistant magique pour tes soirées — genre un truc qui fait EXACTEMENT ce que tu veux — il ferait quoi pour toi ?',
      'Lâche-toi, y\'a pas de mauvaise réponse',
    ],
    inputType: 'text',
    minTextLength: 15,
    relanceMessage: 'Vas-y rêve un peu plus grand 🌙 qu\'est-ce qu\'il ferait ton assistant parfait ?',
    next: 'A6',
    dataKey: 'reve_assistant',
  },
  {
    id: 'A6',
    messages: [
      'Et est-ce que des fois tu sors aussi pour rencontrer des gens ? Nouveaux potes, nouvelles connexions, tout ça ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Oui clairement', value: 'oui_clairement' },
      { label: 'Des fois', value: 'des_fois' },
      { label: 'Pas vraiment, je sors avec mon crew', value: 'pas_vraiment' },
      { label: "C'est pas mon délire", value: 'pas_mon_delire' },
    ],
    next: (response) => {
      if (response.value === 'oui_clairement' || response.value === 'des_fois') return 'A6b';
      return 'A7';
    },
    dataKey: 'interet_rencontres',
  },
  {
    id: 'A6b',
    messages: [
      "C'est quoi le truc qui manque pour que ce soit plus facile de rencontrer du monde en soirée ?",
    ],
    inputType: 'text',
    minTextLength: 10,
    relanceMessage: 'Qu\'est-ce qui rendrait ça plus simple selon toi ?',
    next: 'A7',
    dataKey: 'friction_rencontres',
  },
  {
    id: 'A7',
    messages: [
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
    next: 'A7b',
    dataKey: 'age',
  },
  {
    id: 'A7b',
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
    next: 'A7c',
    dataKey: 'genre',
  },
  {
    id: 'A7c',
    messages: [
      'Comment tu t\'appelles ?',
    ],
    inputType: 'text',
    minTextLength: 2,
    relanceMessage: 'Juste ton prénom !',
    next: 'A7d',
    dataKey: 'prenom',
  },
  {
    id: 'A7d',
    messages: [
      'Et ton email ? C\'est pour te recontacter si tu gagnes les places 🎟️',
    ],
    inputType: 'text',
    inputMode: 'email',
    relanceMessage: 'J\'ai besoin d\'un email valide pour le tirage 📧',
    next: 'A8',
    dataKey: 'email',
  },
  {
    id: 'A8',
    messages: [
      'C\'est bon {{prenom}}, t\'es inscrit·e au tirage pour {{EVENT_NAME}} ! 🎉',
      'Le tirage a lieu le {{DRAW_DATE}}, je te recontacte ici si t\'as gagné.',
      'En attendant, si tu veux tester le chatbot OnParty pour tes prochaines sorties, tu peux lui demander ce que tu veux — genre "quoi faire ce samedi à Paris" ou "c\'est quoi le dress code pour [CLUB]"',
      'Bonne soirée ! 🌙',
    ],
    inputType: 'none',
    next: '',
    dataKey: 'completion',
  },
];

export default questionnaireA;
