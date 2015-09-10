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
    delete: "Supprimer",
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
    topSectionTitle: "Your task completion marketplace",
    topSectionDesc: "With Nelper, connect with people around you and either have your tasks completed or complete other people's tasks.",

    browseTitle: "Browse Tasks",
    browseDesc: "Browse & find tasks to complete.",
    nelpcenterTitle: "Nelp Center",
    nelpcenterDesc: "Manage your tasks and applications.",
    postTitle: "Post a Task",
    postDesc: "Find a Nelper to complete your task.",

    getCompletedTitle: "Get your tasks completed",
    getCompletedDesc: "There's someone in your neighborhood who can help.<br />Posting a task is <strong>free</strong>.",
    getStarted: "Get started now",

    becomeNelperTitle: "Become a Nelper",
    becomeNelperDesc: "Join the community now by completing tasks",
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
  },

  nelpcenter: {
    main: {
      myTasks: "Mes tâches",
      myApplications: "Mes applications",

      applied: "Appliqué {moment}",
      awayFrom: "{distance, number} km de votre emplacement",

      posted: "Publiée {moment}",
      expires: "Expire {moment}",
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
      progressHelp: "",

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
    },

    acceptedTaskView: {
      proceedPayment: "Passer au paiement",
      aboutNelperPay: "À propos de NelperPay",

      chat: "Discuter avec votre Nelper",
    },
  },
};
