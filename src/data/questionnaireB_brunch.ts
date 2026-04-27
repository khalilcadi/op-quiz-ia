import type { Questionnaire } from '../types';

const questionnaireB_brunch: Questionnaire = [
  {
    id: 'B0',
    messages: [
      'Hey 👋 Tu veux tenter de gagner 2 places pour {{EVENT_NAME}} le {{EVENT_DATE}} ?',
      'Réponds à 5 questions rapides (2 min chrono) et t\'es dans le tirage. C\'est parti ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Go ! 🎶', value: 'go' },
      { label: 'Je participe', value: 'je_participe' },
    ],
    next: 'B1',
    dataKey: 'opt_in',
  },
  {
    id: 'B1',
    messages: [
      'Tu sors combien de fois par mois ?',
    ],
    inputType: 'buttons',
    options: [
      { label: '1-2 fois', value: '1-2' },
      { label: '3-4 fois', value: '3-4' },
      { label: '5+ fois', value: '5+' },
      { label: "Moins d'une fois", value: 'moins_1' },
    ],
    next: 'B2',
    dataKey: 'frequence_sortie',
  },
  {
    id: 'B2',
    messages: [
      'À quelle fréquence t\'aimerais recevoir des plans de sorties ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Chaque jour', value: 'chaque_jour' },
      { label: '2-3 fois par semaine', value: '2_3_semaine' },
      { label: '1 fois par semaine', value: '1_semaine' },
      { label: 'Que le weekend', value: 'weekend' },
      { label: 'Seulement quand je demande', value: 'sur_demande' },
    ],
    next: 'B3',
    dataKey: 'ideal_frequency',
  },
  {
    id: 'B3',
    messages: [
      'Qu\'est-ce qui te ferait revenir sur OnParty chaque semaine ?',
      'Choisis les 2 qui te parlent le plus :',
    ],
    inputType: 'multi_select',
    maxSelections: 2,
    options: [
      { label: 'Alertes sur mes artistes préférés', value: 'alertes_artistes' },
      { label: 'Des plans que personne d\'autre a', value: 'plans_exclusifs' },
      { label: 'Un groupe de gens pour sortir', value: 'groupe_sortie' },
      { label: 'Des guest list exclusives', value: 'guest_list' },
      { label: 'Du contenu drôle sur la nightlife', value: 'contenu_drole' },
      { label: 'Des prix cassés sur les entrées', value: 'prix_casses' },
    ],
    next: 'B4',
    dataKey: 'retention_hook',
  },
  {
    id: 'B4',
    messages: [
      'Tu préférerais recevoir tes plans de sorties comment ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Un message WhatsApp', value: 'whatsapp' },
      { label: 'Une notification push', value: 'push' },
      { label: 'Un email', value: 'email' },
      { label: 'Direct dans le chat OnParty', value: 'chat_onparty' },
      { label: 'Un post Instagram', value: 'instagram' },
    ],
    next: 'B5',
    dataKey: 'preferred_channel',
  },
  {
    id: 'B5',
    messages: [
      'Et pour finir',
      'Si OnParty te trouvait chaque semaine le plan parfait + guest list + le bon crew, tu paierais combien ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Gratuit sinon rien', value: 'gratuit' },
      { label: '2-5 €/mois', value: '2-5' },
      { label: '5-10 €/mois', value: '5-10' },
      { label: "10 €+ si c'est vraiment ouf", value: '10+' },
    ],
    next: 'B6',
    dataKey: 'willingness_to_pay',
  },
  {
    id: 'B6',
    messages: [
      'Top. Dernières infos pour le tirage :',
      'T\'as quel âge ?',
    ],
    inputType: 'buttons',
    options: [
      { label: '18-21', value: '18-21' },
      { label: '22-25', value: '22-25' },
      { label: '26-30', value: '26-30' },
      { label: '31+', value: '31+' },
    ],
    next: 'B7',
    dataKey: 'age',
  },
  {
    id: 'B7',
    messages: [
      'Tu te définis comment ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Homme', value: 'homme' },
      { label: 'Femme', value: 'femme' },
      { label: 'Non-binaire', value: 'non_binaire' },
      { label: 'Préfère ne pas dire', value: 'prefere_pas_dire' },
    ],
    next: 'B8',
    dataKey: 'genre',
  },
  {
    id: 'B8',
    messages: [
      'Comment tu t\'appelles ?',
    ],
    inputType: 'text',
    minTextLength: 2,
    relanceMessage: 'Juste ton prénom !',
    next: 'B9',
    dataKey: 'prenom',
  },
  {
    id: 'B9',
    messages: [
      'Et ton email pour le tirage ? 🎟️',
    ],
    inputType: 'text',
    inputMode: 'email',
    relanceMessage: 'J\'ai besoin d\'un email valide pour le tirage 📧',
    next: 'B10',
    dataKey: 'email',
  },
  {
    id: 'B10',
    messages: [
      'C\'est bon {{prenom}}, t\'es dans le tirage pour {{EVENT_NAME}} 🎉',
      'Résultat le {{DRAW_DATE}} — je te recontacte ici.',
      'D\'ici là, tu peux tester le chatbot OnParty : demande-lui "quoi faire ce week-end à Paris" et vois ce qu\'il te propose 😏',
    ],
    inputType: 'none',
    next: '',
    dataKey: 'completion',
  },
];

export default questionnaireB_brunch;
