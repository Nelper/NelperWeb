export default {

  common: {
    accepted: "Accepté",
    pending: "En attente",
    applied: "Appliqué",

    viewProfile: "Voir le profile",

    cancelApply: "Annuler l'application",

    postedRelative: "Créée {formattedAgo}",
    expiresRelative: "Expire {formattedAgo}",

    warning: "Attention!",
    cancel: "Annuler",
    add: "Ajouter",
    delete: "Supprimer",

    browse: "Parcourir...",
  },

  categories: {
    technology: {
      name: "Support informatique & électronique",
      examples: "Réparation d’ordinateur, Support pour e-mail, Installation de routeur & imprimante, Support pour tablettes & téléphones intelligents, Installation de télévision, et plus!",
    },
    business: {
      name: "Affaires & Administration",
      examples: "Comptabilité, Organisation de fichiers, Rédaction de CV & lettres professionnelles, Stratégies de publicité, Médias sociaux, Saisie de données, et plus!",
    },
    multimedia: {
      name: "Multimédia & Conception graphique",
      examples: "Développement de site web, Montage vidéo, Services de photographie & d’imprimerie, Conception graphique, Production musicale, Création de logo, et plus!",
    },
    gardening: {
      name: "Jardinage",
      examples: "Entretien floral & du potager, Aménagement paysager, Tonte de pelouse, Ratissage de feuilles, Contrôle antiparasitaire, Taillage d’arbres & haies, et plus!",
    },
    handywork: {
      name: "Travail manuel",
      examples: "Assemblage de meubles, Menuiserie, Travail électrique, Peinture, Plomberie, Toiture, Réparation d’électroménagers, Pose de plancher, et plus!",
    },
    housecleaning: {
      name: "Nettoyage",
      examples: "Ménage de maison, Lessive & service de nettoyage, Enlèvement de déchets, Entretien de piscine & spa, Nettoyage de gouttières, Lavage de voiture, et plus!",
    },
    other: {
      name: "Autre",
    },
  },

  routes: {
    nelpcenter: "Nelp Center",
    taskDetail: "Détails de la tâche",
    applicationDetail: "Détails de l'application",
  },

  navBar: {
    howWorks: "Comment ça marche?",
    browse: "Parcourir",
    post: "Publier une tâche",
    login: "Connexion",
    center: "Nelp Center",
  },

  home: {
    topSectionTitle: "Votre marché en ligne d’échange de services",
    topSectionDesc: "Avec Nelper, entrez en contact avec votre communauté et faites compléter vos tâches ou complétez celles des autres.",

    browseTitle: "Parcourir les tâches",
    browseDesc: "Appliquez pour compéter des tâches.",
    nelpcenterTitle: "Centre Nelp",
    nelpcenterDesc: "Gérez vos tâches et applications.",
    postTitle: "Publier une tâche",
    postDesc: "Trouvez un Nelper pour faire compléter votre tâche.",

    getCompletedTitle: "Faites compléter vos tâches",
    getCompletedDesc: "Il y a des gens de votre communauté qui peuvent vous aider.<br />Publier une tâche est <strong>gratuit</strong>.",
    getStarted: "Publier une tâche",

    categoriesTitle: "Catégories simples, plusieurs options",
    categoriesDesc: "N’importe quoi peut être complété sur Nelper, de la tonte de pelouse à l’installation d’un routeur.",

    becomeNelperTitle: "Devenez un Nelper",
    becomeNelperDesc: "Vous souhaitez mettre à profit vos talents et faire de l’argent? Rejoignez la communauté dès maintenant et complétez les tâches publiées.",
    browseTasks: "Parcourir les tâches",

    nelperpayTitle: "NelperPay",
    nelperpayDesc: "Paix d’esprit pour les Nelpers et les publieurs de tâches",
    nelperpayFeature1: "Aucun compte bancaire externe requis.",
    nelperpayFeature2: "Aucun frais d’adhésion.",
    nelperpayFeature3: "<strong>Aucun soucis.</strong>",
  },

  browse: {
    moreFilters: "Plus de filtres",
    higherThan: "Plus de",
    within: "À moins de",
    priceRange: "Prix",
    disRange: "Emplacement",

    noTask: "Aucune tâche trouvée",

    price: "Prix",
    distance: "Distance",
    date: "Date de création",

    myOffer: "Mon offre",
  },

  nelpcenter: {
    main: {
      myTasks: "Mes tâches",
      myApplications: "Mes applications",

      applied: "Appliqué {moment}",
      awayFrom: "{distance, number} km de votre emplacement",
    },

    common: {
      nelperCount: "{num, plural, =0 {Aucun Nelper en attente} =1 {{num} Nelper en attente} other {{num} Nelpers en attente}}",
      deleteTask: "Supprimer cette tâche",
      editPic: "Modifier mes images",

      completion: "Progrès de la tâche",
    },

    applicationDetail: {

      status: "État de l'application",
      agreed: "Prix convenu",
      offer: "Votre offre",

      progressAccepted: "Accepté",
      progressSent: "Paiement envoyé",
      progressPayment: "Paiement demandé",
      progressReleased: "Fonds transférés",
      completed: "J'ai complété la tâche!",
      progressHelp: `
      <h2>En tant que Nelper, quel est le processus pour compléter la tâche ainsi que pour le paiement?</h2>
      <p>Toutes les étapes sont complétées sur cette page-ci :</p>
      <ol>
        <li>
          Le publieur de tâche envoie le paiement. Une fois le paiement envoyé, celui-ci est mis en attente via notre plateforme de paiement NelperPay,
          jusqu'à ce que la tâche soit complétée. De cette manière, vous pouvez commencer à travailler sur la tâche tout en
          sachant qu'il est en attente pour vous.
        </li>
        <li>
          Vous complétez la tâche.
        </li>
        <li>
          Lorsque vous avez complété la tâche, cliquez sur <em>J'ai complété la tâche</em>.
        </li>
        <li>
          Le publieur de tâche confirme que vous avez complété sa tâche et vos fonds sont libérés.
        </li>
      </ol>
      `,

      chat: "Discuter avec l'afficheur",

      offering: "L'afficheur offre",
      locationShown: "Location affichée",
      locationWithin: "Emplacement de la tâche dans un rayon de 400m",
    },

    taskDetail: {

      nelperPending: "Nelpers",
      nelperDenied: "Nelpers refusés",
      nelperAccepted: "Nelper accepté",
      deleteConfirm: "Êtes-vous certain de vouloir supprimer '{title}'?",

      progressAccepted: "Nelper Accepted",
      progressSent: "Payment sent",
      progressApproved: "Approved Task Completion",
      progressRating: "Rating & Feedback",
      progressHelp: `
      <h2>En tant que publieur de tâche, quel est le processus pour faire compléter ma tâche ainsi que pour le paiement?</h2>
      <p>Toutes les étapes sont complétées sur cette page-ci :</p>
      <ol>
        <li>
          Cliquez sur <em>Procéder au paiement</em>. Lorsque vous envoyez le paiement, celui-ci est sécuritairement
          mis en attente via notre plateforme de paiement NelperPay, jusqu'à ce que votre tâche soit complétée.
        </li>
        <li>
          Votre Nelper complète votre tâche.
        </li>
        <li>
          Lorsque votre tâche est complétée, votre Nelper va demander que son paiement soit libéré.
          Pour ce faire, vous n'avez qu'à confirmer que votre tâche a été complétée en cliquant sur <em>Mon Nelper a complété ma tâche</em>.
        </li>
        <li>
          Vous donnez une note & une critique à votre Nelper, en lien avec sa performance.
        </li>
      </ol>
      `,
    },

    acceptedTaskView: {
      proceedPayment: "Passer au paiement",
      aboutNelperPay: "À propos de NelperPay",

      chat: "Discuter avec votre Nelper",
    },
  },

  post: {
    selectCategory: "Sélectionnez une catégorie",
    changeCategory: "Sélectionner une autre catégorie",
    taskTitle: "Entrez le titre de votre tâche",
    taskDescription: "Décrivez brièvement ce que vous avez besoin",
    taskOffer: "Combien offrez-vous?",
    taskLocation: "Choississez votre emplacement",
    taskPictures: "Ajouter des photos",
    post: "Créer la tâche!",
  },
};
