# Questionnaire B — Validation

**Objectif :** Tester rapidement les hypothèses produit (features prioritaires, willingness to pay, positionnement) sur un grand volume de répondants.

**Durée estimée :** ~2 minutes

**Ton :** Rapide, direct, peu d'emojis, pas de relances longues.

---

## Étape 1 — Accueil & opt-in

> Hey 👋 Tu veux tenter de gagner 2 places pour **{nom de l'événement}** le **{date de l'événement}** ?
>
> Réponds à 6 questions rapides (2 min chrono) et t'es dans le tirage. C'est parti ?

**Type de réponse :** Boutons (choix unique)

**Options :**
- Go ! 🎶
- Je participe

→ On passe à l'étape 2.

---

## Étape 2 — Fréquence de sortie

> Tu sors combien de fois par mois ?

**Type de réponse :** Boutons (choix unique)

**Options :**
- 1-2 fois
- 3-4 fois
- 5+ fois
- Moins d'une fois

→ On passe à l'étape 3.

---

## Étape 3 — Plateformes de découverte

> Et tu utilises quoi pour trouver tes soirées ? (Tu peux en choisir plusieurs)

**Type de réponse :** Multi-sélection (aucune limite)

**Options :**
- Resident Advisor
- Shotgun
- Dice
- Instagram
- Bouche à oreille
- Autre

→ On passe à l'étape 4.

---

## Étape 4 — Top features

> Imagine une app ou un chatbot pour tes soirées. C'est quoi LE truc qui te ferait l'utiliser ?
>
> Choisis les 2 qui te parlent le plus :

**Type de réponse :** Multi-sélection (**maximum 2 choix**)

**Options :**
- Recos perso selon mes goûts
- Guest list / bons plans exclusifs
- Organiser la sortie avec mon crew
- Savoir qui sort où ce soir
- Avis de gens qui y sont allés
- Dress code et vibe du lieu

→ On passe à l'étape 5 (le texte affiché à l'étape 5 dépend du 1er choix).

---

## Étape 5 — Willingness to pay *(question dynamique)*

Le message affiché dépend du **premier choix** coché à l'étape précédente :

| 1er choix à l'étape 4 | Question posée à l'étape 5 |
|---|---|
| Recos perso selon mes goûts | *"Si un service te trouvait LA soirée parfaite pour toi chaque semaine, tu serais prêt·e à payer combien par mois ?"* |
| Guest list / bons plans exclusifs | *"Si un service te mettait sur guest list ou te trouvait des bons plans exclu chaque semaine, tu paierais combien par mois ?"* |
| Organiser la sortie avec mon crew | *"Si un service gérait toute la coordination de tes sorties avec ton crew, ça vaudrait combien par mois pour toi ?"* |
| Savoir qui sort où ce soir | *"Si un service te montrait en temps réel qui sort où ce soir, tu paierais combien par mois ?"* |
| Avis de gens qui y sont allés | *"Si un service te donnait des vrais retours fiables sur les soirées avant d'y aller, ça vaudrait combien par mois ?"* |
| Dress code et vibe du lieu | *"Si un service te donnait le dress code et la vraie vibe de chaque lieu, tu paierais combien par mois ?"* |

*(Fallback : si aucun choix n'a été fait, on pose la question "Recos perso".)*

**Type de réponse :** Boutons (choix unique)

**Options :**
- Gratuit sinon rien
- 2-5 €/mois
- 5-10 €/mois
- 10 €+ si c'est vraiment ouf

→ On passe à l'étape 6.

---

## Étape 6 — Positionnement

> Dernière question un peu random — si ce service existait, ce serait plutôt quoi pour toi ?

**Type de réponse :** Boutons (choix unique)

**Options :**
- Un pote qui connaît toutes les soirées
- Un concierge VIP nightlife
- Un groupe WhatsApp mais en mieux
- Un Waze des soirées

→ On passe à l'étape 7.

---

## Étape 7 — Âge

> Top. Dernières infos pour le tirage :
>
> T'as quel âge ?

**Type de réponse :** Boutons (choix unique)

**Options :**
- 18-21
- 22-25
- 26-30
- 31+

→ On passe à l'étape 8.

---

## Étape 8 — Genre

> Tu te définis comment ?

**Type de réponse :** Boutons (choix unique)

**Options :**
- Homme
- Femme
- Non-binaire
- Préfère ne pas dire

→ On passe à l'étape 9.

---

## Étape 9 — Prénom

> Comment tu t'appelles ?

**Type de réponse :** Texte libre (minimum 2 caractères)

**Message de relance si trop court :** *"Juste ton prénom !"*

→ On passe à l'étape 10.

---

## Étape 10 — Email

> Et ton email pour le tirage ? 🎟️

**Type de réponse :** Texte libre (format email)

**Message de relance si invalide :** *"J'ai besoin d'un email valide pour le tirage 📧"*

→ On passe à l'écran final.

---

## Étape 11 — Confirmation

> C'est bon **{prénom}**, t'es dans le tirage pour **{nom de l'événement}** 🎉
>
> Résultat le **{date du tirage}** — je te recontacte ici.
>
> D'ici là, tu peux tester le chatbot OnParty : demande-lui "quoi faire ce week-end à Paris" et vois ce qu'il te propose 😏

**Type de réponse :** Aucune (fin du questionnaire)

---

## Récapitulatif du flux

| # | Étape | Type | Note |
|---|-------|------|------|
| 1 | Opt-in | Boutons | — |
| 2 | Fréquence de sortie | Boutons | — |
| 3 | Plateformes discovery | Multi-select | Sans limite |
| 4 | Top features | Multi-select | Max 2 choix |
| 5 | Willingness to pay | Boutons | Texte dynamique selon étape 4 |
| 6 | Positionnement | Boutons | — |
| 7 | Âge | Boutons | — |
| 8 | Genre | Boutons | — |
| 9 | Prénom | Texte | — |
| 10 | Email | Texte | — |
| 11 | Confirmation | — | — |

**Total : 10 questions** (flux linéaire, aucun branchement conditionnel).

---

## Différences clés vs Questionnaire A

- **Plus court** (10 questions vs 13)
- **Quasi pas de texte libre** (seulement prénom et email)
- **Multi-sélection** introduite pour les plateformes et les features
- **Question dynamique** à l'étape 5 qui s'adapte au 1er choix de l'étape 4
- **Ton plus direct**, moins de relances, moins d'emojis
- **Pas de branchement conditionnel** : tout le monde suit le même chemin
