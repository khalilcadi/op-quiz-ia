import type { Questionnaire, UserResponse } from '../types';

const B3_MESSAGES: Record<string, string> = {
  recos_perso: 'Si un service te trouvait LA soirée parfaite pour toi chaque semaine, tu serais prêt·e à payer combien par mois ?',
  guest_list: 'Si un service te mettait sur guest list ou te trouvait des bons plans exclu chaque semaine, tu paierais combien par mois ?',
  crew_planning: 'Si un service gérait toute la coordination de tes sorties avec ton crew, ça vaudrait combien par mois pour toi ?',
  social_realtime: 'Si un service te montrait en temps réel qui sort où ce soir, tu paierais combien par mois ?',
  reviews: 'Si un service te donnait des vrais retours fiables sur les soirées avant d\'y aller, ça vaudrait combien par mois ?',
  dress_code_vibe: 'Si un service te donnait le dress code et la vraie vibe de chaque lieu, tu paierais combien par mois ?',
};

const questionnaireB: Questionnaire = [
  {
    id: 'B0',
    messages: [
      'Hey 👋 Tu veux tenter de gagner 2 places pour {{EVENT_NAME}} le {{EVENT_DATE}} ?',
      'Réponds à 6 questions rapides (2 min chrono) et t\'es dans le tirage. C\'est parti ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Go ! 🎶', value: 'go' },
      { label: 'Je participe', value: 'je_participe' },
    ],
    next: 'B1a',
    dataKey: 'opt_in',
  },
  {
    id: 'B1a',
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
    next: 'B1b',
    dataKey: 'frequence_sortie',
  },
  {
    id: 'B1b',
    messages: [
      'Et tu utilises quoi pour trouver tes soirées ? (Tu peux en choisir plusieurs)',
    ],
    inputType: 'multi_select',
    options: [
      { label: 'Resident Advisor', value: 'resident_advisor' },
      { label: 'Shotgun', value: 'shotgun' },
      { label: 'Dice', value: 'dice' },
      { label: 'Instagram', value: 'instagram' },
      { label: 'Bouche à oreille', value: 'bouche_a_oreille' },
      { label: 'Autre', value: 'autre' },
    ],
    next: 'B2',
    dataKey: 'plateformes_discovery',
  },
  {
    id: 'B2',
    messages: [
      'Imagine une app ou un chatbot pour tes soirées. C\'est quoi LE truc qui te ferait l\'utiliser ?',
      'Choisis les 2 qui te parlent le plus :',
    ],
    inputType: 'multi_select',
    maxSelections: 2,
    options: [
      { label: 'Recos perso selon mes goûts', value: 'recos_perso' },
      { label: 'Guest list / bons plans exclusifs', value: 'guest_list' },
      { label: 'Organiser la sortie avec mon crew', value: 'crew_planning' },
      { label: 'Savoir qui sort où ce soir', value: 'social_realtime' },
      { label: 'Avis de gens qui y sont allés', value: 'reviews' },
      { label: 'Dress code et vibe du lieu', value: 'dress_code_vibe' },
    ],
    next: 'B3',
    dataKey: 'top_features',
  },
  {
    id: 'B3',
    messages: (responses: UserResponse[]): string[] => {
      const topFeatures = responses.find((r) => r.dataKey === 'top_features');
      const top1 = Array.isArray(topFeatures?.value) ? topFeatures.value[0] : topFeatures?.value;
      const message = (top1 && B3_MESSAGES[top1]) || B3_MESSAGES.recos_perso;
      return [message];
    },
    inputType: 'buttons',
    options: [
      { label: 'Gratuit sinon rien', value: 'gratuit' },
      { label: '2-5€/mois', value: '2-5' },
      { label: '5-10€/mois', value: '5-10' },
      { label: "10€+ si c'est vraiment ouf", value: '10+' },
    ],
    next: 'B4',
    dataKey: 'willingness_to_pay',
  },
  {
    id: 'B4',
    messages: [
      'Dernière question un peu random — si ce service existait, ce serait plutôt quoi pour toi ?',
    ],
    inputType: 'buttons',
    options: [
      { label: 'Un pote qui connaît toutes les soirées', value: 'pote_soirees' },
      { label: 'Un concierge VIP nightlife', value: 'concierge_vip' },
      { label: 'Un groupe WhatsApp mais en mieux', value: 'whatsapp_mieux' },
      { label: 'Un Waze des soirées', value: 'waze_soirees' },
    ],
    next: 'B5a',
    dataKey: 'positionnement',
  },
  {
    id: 'B5a',
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
    next: 'B5b',
    dataKey: 'age',
  },
  {
    id: 'B5b',
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
    next: 'B6',
    dataKey: 'genre',
  },
  {
    id: 'B6',
    messages: [
      'C\'est bon, t\'es dans le tirage pour {{EVENT_NAME}} 🎉',
      'Résultat le {{DRAW_DATE}} — je te recontacte ici.',
      'D\'ici là, tu peux tester le chatbot OnParty : demande-lui "quoi faire ce week-end à Paris" et vois ce qu\'il te propose 😏',
    ],
    inputType: 'none',
    next: '',
    dataKey: 'completion',
  },
];

export default questionnaireB;
