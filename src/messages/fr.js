export default {

  common: {
    accept: "Accepter",
    accepted: "Accepté",
    pending: "En attente",
    applied: "Appliqué",

    viewProfile: "Voir le profil",

    cancelApply: "Supprimer mon application",

    postedRelative: "Publiée {formattedAgo}",
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
      name: "Multimédia",
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
    nelpcenter: "Centre Nelp",
    taskDetail: "Ma tâche",
    applicationDetail: "Mon application",
    taskApplicationDetail: "Profile du Nelper",
    browse: "Parcourir les tâches",
    browseProfile: "Profile de l'afficheur",
  },

  navBar: {
    login: "Connexion",
    browse: "Parcourir les tâches",
    center: "Centre Nelp",
    post: "Publier une tâche",
    profile: "Profile",
    settings: "Paramètres",
    logout: "Déconnexion",
    howItWorks: "Comment ça fonctionne?",
    nelperPay: "NelperPay",
    faq: "FAQ",
  },

  home: {
    topSectionTitle: "Marché en ligne d'achèvement de tâches",
    topSectionDesc: "Avec Nelper, entrez en contact avec des gens près de vous et faites compléter vos tâches ou faites de l'arget à compléter celles d'autres.",

    browseTitle: "Parcourir les tâches",
    browseDesc: "Appliquez pour compléter des tâches.",
    nelpcenterTitle: "Centre Nelp",
    nelpcenterDesc: "Gérez vos tâches et applications.",
    postTitle: "Publier une tâche",
    postDesc: "Trouvez un Nelper pouvant compléter votre tâche.",

    getCompletedTitle: "Faites compléter vos tâches",
    getCompletedDesc: "Il y a quelqu'un dans votre voisinage qui peut vous aider.<br />Publier une tâche est <strong>gratuit</strong>.",
    getStarted: "Publier une tâche",

    categoriesTitle: "Catégories simples, options multiples",
    categoriesDesc: "De la tonte de pelouse à l’installation d’un routeur, toutes vos tâches peuvent être complétées sur Nelper.",

    becomeNelperTitle: "Devenez un Nelper",
    becomeNelperDesc: "Vous souhaitez mettre à profit vos talents et faire de l’argent en complétant des tâches? Rejoignez la communauté dès maintenant.",
    browseTasks: "Parcourir les tâches",

    nelperpayTitle: "NelperPay",
    nelperpayDesc: "Plateforme de paiement simple et sécuritaire",
    nelperpayFeature1: "Aucun compte en ligne requis.",
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
    date: "Date de publication",

    myOffer: "Mon offre",
    makeOffer: "Faire une offre",
    viewApplication: "Voir mon application",
    profile: "Profile",
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

      noApplication: "Aucune application!",
    },

    myTasks: {
      noTask: "Vous n'avez pas de tâche active.",
      post: "Publier une tâche",
      nelperAccepted: "Nelper accepté",
      activeTasks: "Tâches actives",
      completedTasks: "Tâches complétées",
    },

    myApplications: {
      noApplication: "Vous n'avez pas d'application active.",
      browse: "Parcourir les tâches",
    },

    applicationDetail: {

      status: "État de l'application",
      agreed: "Prix convenu",
      offer: "Votre offre",

      progressAccepted: "Accepté",
      progressSent: "Paiement envoyé",
      progressPayment: "Paiement demandé",
      progressReleased: "Paiement libéré",
      completed: "J'ai complété la tâche!",
      progressHelp: `
      <h2>Quelle est la procédure pour compléter la tâche et recevoir le paiement? </h2>
      <ol>
        <li>
          Le publieur de la tâche envoie le paiement. Celui-ci sera sécuritairement gelé via notre plateforme {nelperPay},
          jusqu'à ce que vous complétiez la tâche. Ainsi, vous pouvez commencer à travailler sur la tâche tout en
          sachant que le paiement est en attente pour vous.
        </li>
        <li>
          Vous complétez la tâche.
        </li>
        <li>
          Lorsque vous avez complété la tâche, cliquez sur <em>J'ai complété la tâche</em>.
        </li>
        <li>
          Le publieur de la tâche confirme que vous avez bel et bien complété sa tâche et vous recevez votre paiement.
        </li>
      </ol>
      `,

      chat: "Ouvrir le chat",

      offering: "{name} offre",
      locationShown: "Emplacement exact de la tâche affiché",
      locationWithin: "Emplacement de la tâche dans un rayon de 400m",
    },

    taskDetail: {

      nelperPending: "Nelpers",
      nelperDenied: "Nelpers refusés",
      nelperAccepted: "Nelper accepté",
      deleteConfirm: "Êtes-vous certain de vouloir supprimer '{title}'?",

      progressAccepted: "Nelper accepté",
      progressSent: "Paiement envoyé",
      progressApproved: "Confirmation",
      progressRating: "Évaluation",
      progressHelp: `
      <h2>Quelle est la procédure pour envoyer le paiement et faire compléter ma tâche?</h2>
      <ol>
        <li>
          Cliquez sur <em>Procéder au paiement</em>. Entrez vos informations de carte de crédit/débit et effectuez le paiement. Un reçu sera envoyé automatiquement à votre adresse courriel.
        </li>
        <li>
          Lorsque vous aurez envoyé le paiement, celui-ci sera sécuritairement gelé via notre plateforme {nelperPay}, jusqu'à ce que votre tâche soit complétée.
        </li>
        <li>
          Votre Nelper complète votre tâche.
        </li>
        <li>
          Lorsque votre tâche est complétée, vous devez libérer le paiement de votre Nelper. Pour ce faire, confirmez que votre tâche a été complétée en cliquant sur <em>Mon Nelper a complété ma tâche</em>. Ceci conclue la transaction.
        </li>
        <li>
          Finalement, évaluez et critiquez la performance de votre Nelper.
        </li>
      </ol>
      `,

      removeApplicant: "Changer de Nelper",

      confirmAcceptTitle: "Êtes-vous certain de vouloir accepter ce Nelper?",
      confirmNelperAccepted: "Nelper accepté",

      paymentTitle: "Payment",
      paymentTo: "to {name}",
      paymentPlaceholderName: "Cardholder name",
      paymentPlaceholderCard: "Card number",
      paymentPlaceholderExpiry: "MM / YY",
      paymentPlaceholderCVC: "CVC",
      paymentPay: "Pay {amount}",
      paymentTerms: "Terms of use",
      paymentErrorName: "Enter your name.",
      paymentErrorCard: "Invalid card number.",
      paymentErrorExpiry: "Invalid expiry date.",
      paymentErrorCVC: "Invalid CVC code.",
      paymentError: "Une erreur est survenu veuillez réessayer.",
      paymentCompleted: "Payment successfully completed!",
    },

    acceptedTaskView: {
      proceedPayment: "Procéder au paiement",
      aboutNelperPay: "À propos de NelperPay",
      taskCompleted: "{name} a complété ma tâche",
      paidOn: "payé le {date}",

      chat: "Ouvrir le chat",
    },
  },

  post: {
    selectCategory: "Sélectionnez une catégorie",
    changeCategory: "Sélectionner une autre catégorie",
    taskTitle: "Entrez un titre",
    taskDescription: "Décrivez ce dont vous avez besoin",
    taskOffer: "Combien offrez-vous?",
    taskLocation: "Ajoutez l'emplacement de la tâche",
    taskPictures: "Ajoutez des photos",
    post: "Publier ma tâche!",

    errorTitle: "Please enter a title.",
    errorDesc: "Please enter a description.",
    errorPrice: "Please enter a price between {min, number, CAD} and {max, number, CAD}.",
    errorLocation: "Please select or add a location.",

    deleteLocationTitle: "Supprimer l'emplacement",
    deleteLocationMessage: "Êtes-vous certain de vouloir supprimer l'emplacement '{name}'?",
  },

  profile: {
    editPicture: "Changer photo",
    about: "À propos",
    skills: "Talents",
    addSkill: "Ajouter",
    education: "Éducation",
    addEducation: "Ajouter",
    experience: "Expérience de travail",
    addExperience: "Ajouter",
    feedback: "Feedback",

    noFeedback: "No feedback yet",
  },

  faq: {
    pageTitle_01: "Voici des questions/réponses pour vous aider à comprendre le fonctionnement de Nelper.",
    pageTitle_02: "Si vous ne trouvez pas de réponse à votre question, ou avez besoin d’assistance supplémentaire, contactez-nous sur le {supportCenter}.",
    supportCenter: "Centre d'aide'",

    generalSectionTitle: "Général",
    generalTitle_00: "Qu’est-ce que Nelper?",
    generalDesc_00: "Nelper est un marché en ligne pour entrer en contact avec votre communauté et faire compléter vos tâches ou compléter celles des autres, pour de l’argent. Nelper est utilisable sur web ou sur {iOS}.",
    generalTitle_01: "Pourquoi devrais-je utiliser Nelper?",
    generalDesc_01: "Vous en assez de payer trop cher pour faire compléter des tâches simples comme faire vider vos gouttières ou faire réparer votre ordinateur? Vous en avez assez d’attendre toute la journée à la maison un technicien qui peut arriver n’importe quand entre 8h et 17h? Vous en avez assez de toujours chercher parmi les mêmes petites compagnies locales peu efficaces?<br /><br />Commencez à utiliser Nelper dès maintenant et réglez ces problèmes. Sur Nelper, vous pouvez facilement trouver quelqu’un de qualifié deux fois plus rapidement et qui habite à quelques rues de chez vous.",
    generalTitle_02: "Comment ça fonctionne?",
    generalDesc_02: "Veuillez visiter la page {howItWorks}. Elle contient tout ce que vous devez savoir sur le déroulement global de Nelper ainsi que toutes les explications servant à publier une tâche, parcourir les tâches, compléter une tâche et utiliser votre Centre Nelp",
    generalTitle_03: "Quelle est la différence entre un publieur de tâche et un Nelper?",
    generalDesc_03: "Un <strong>publieur de tâche</strong> est un personne qui publie une tâche, dans le but de se la faire compléter. Un <strong>Nelper</strong> est une personne qui complète des tâches.",
    generalTitle_04: "Quel genre de tâche peut être complété sur Nelper?",
    generalDesc_04: "N’importe quel genre! De la tonte de pelouse à l’installation d’un routeur, vous pouvez trouver ou publier de tout sur Nelper.",
    generalTitle_05: "Est-ce gratuit?",
    generalDesc_05: "Publier une tâche, parcourir les tâches et appliquer pour une tâche sont <strong>gratuits</strong>, pas de frais cachés. En tant que publieur de tâche, vous payez toujours le prix convenu de votre tâche, jamais plus.<br /><br />Pour les Nelpers, des frais de 7.5% du montant total d’une tâche s’appliquent par transaction, pour la sécurité de paiement de {nelperPay}.",
    posterSectionTitle: "Publieur de tâche",
    posterTitle_00: "Comment publier une tâche?",
    posterDesc_00: "Allez dans {postATask}. Choisissez votre catégorie, donnez un titre à vote tâche, décrivez ce dont vous avez besoin, entrez votre offre de prix, ajoutez l'emplacement de la tâche et ajoutez des photos, au besoin.",
    posterTitle_01: "Comment savoir quel prix offrir pour ma tâche?",
    posterDesc_01: "Lorsque vous publiez une tâche, le prix que vous offrez ne peut servir que de point de départ. Lorsqu’ils appliquent pour une tâche, les Nelpers ont l'option de faire leur propre offre de prix afin de négocier et parvenir à un prix équitable pour les deux parties.<br /><br />Il n’y a pas de règles quant au montant que vous devriez débourser pour une tâche mais gardez en tête que le prix d'une tâche plus complexe ou plus longue à compléter devrait être plus élevé. Nous vous recommandons aussi de parcourir les tâches de la même catégorie dans {browseTasks} avant de publier la vôtre. Ainsi, vous aurez une meilleure idée de prix pour votre tâche.",
    posterTitle_02: "Où ma tâche peut-elle être vue par les autres utilisateurs?",
    posterDesc_02: "Dans {browseTasks}. Toutes les tâches publiées se retrouvent sur cette page.",
    posterTitle_03: "Où puis-je voir et modifier les détails de ma tâche une fois publiée?",
    posterDesc_03: "Dans votre {nelpCenter}, sous Mes tâches. Toutes vos tâches actives ainsi que ceux qui ont déjà été complétées s’y retrouvent avec leur prix, date de publication et le nombre de Nelpers ayant appliqué.<br /><br />Si vous cliquez sur une tâche, vous avez accès à tous ses détails, avez la possibilité d’y effectuer des changements et pouvez voir la liste complète de Nelpers ayant appliqué.",
    posterTitle_04: "Comment choisir un Nelper?",
    posterDesc_04: "Cliquez sur votre tâche et faites votre choix parmi la liste de Nelpers ayant appliqué. Vous y voyez leurs noms, leurs évaluations, le nombre de tâches qu’ils ont complété ainsi que leurs offres de prix.<br /><br />Si vous cliquez sur la photo de profil d’un Nelper, vous accédez à sa page de profil ainsi qu’à ses critiques de tâches accomplies antérieurement. Vous pouvez également ouvrir une page de chat entre vous et le Nelper, pour discuter des détails de votre tâche ou pour lui poser des questions.",
    posterTitle_05: "Quel est la procédure pour envoyer le paiement et faire compléter ma tâche?",
    posterDesc_05: `Lorsque vous acceptez un Nelper et vous êtes entendus sur les détails, vous êtes prêt à procéder au paiement et à faire compléter votre tâche. Toutes les étapes restantes se font directement sur votre page de tâche.
    <ol>
      <li>
        Cliquez sur <em>Procéder au paiement</em>. Entrez vos informations de carte de crédit/débit et effectuez le paiement. Un reçu vous sera envoyé automatiquement par courriel.
      </li>
      <li>
        Lorsque vous aurez envoyé le paiement, celui-ci sera sécuritairement gelé via notre plateforme {nelperPay}, jusqu'à ce que votre tâche soit complétée.
      </li>
      <li>
        Votre Nelper complète votre tâche.
      </li>
      <li>
        Lorsque votre tâche est complétée, vous devez libérer le paiement de votre Nelper. Pour ce faire, confirmez que votre tâche a été complétée en cliquant sur <em>Mon Nelper a complété ma tâche</em>. Ceci conclue la transaction.
      </li>
      <li>
        Finalement, évaluez et critiquez la performance de votre Nelper.
      </li>
    </ol>`,
    posterTitle_06: "Qu’arrive-t-il si je ne reçois pas d'application?",
    posterDesc_06: "Rien, votre tâche reste active jusqu'à ce que vous la supprimez ou jusqu'à ce que vous acceptez un Nelper. Il n’y a pas de conséquences si personne n’applique pour votre tâche. Cela peut cependant être un indicateur que celle-ci est trop complexe, mal expliquée ou que votre prix offert est trop bas.",
    nelperSectionTitle: "Nelper",
    nelperTitle_00: "Comment parcourir les tâches?",
    nelperDesc_00: "Allez dans {browseTasks}. La carte et la liste de tâches liées ensemble. Si vous cliquez sur une tâche dans la liste, vous verrez sa location sur la carte. Tandis que si vous cliquez une une tâche sur la carte (une punaise), vous la verrez dans la liste, avec ses détails complets.<br /><br />Vous pouvez filtrer les tâches que vous désirez voir tant sur la carte que dans la liste par catégorie, intervalle de prix et proximité. Le filtre de proximité est basé selon votre emplacement que vous pouvez ajouter ou modifier dans vos {settings}. Vous pouvez également trier la liste de tâches par prix, distance et date de publication.",
    nelperTitle_01: "Comment appliquer pour une tâche?",
    nelperDesc_01: "Lorsque vous avez choisi la tâche que vous voulez compléter, cliquez sur <em>Faire une offre</em>. Vous avez le choix d’appliquer pour le prix offert par le publieur ou faire votre propre offre. Le choix vous revient, selon ce que vous croyez être un prix juste pour la tâche en question.",
    nelperTitle_02: "Où puis-je voir mes applications?",
    nelperDesc_02: "Dans votre {nelpCenter}, sous Mes Applications. Toutes vos applications actives y sont, accompagnées de leurs status (En attente, Acceptée ou Refusée). Vous pouvez également y voir vos tâches complétées antérieurement.<br /><br />Si vous cliquez l’une de vos applications, vous pouvez revoir les détails de votre application et ouvrir une fenêtre de chat entre vous et le publieur de tâche.",
    nelperTitle_03: "Comment augmenter mes chances d’être accepté?",
    nelperDesc_03: "Assurez-vous de bien remplir votre {profile}. Écrivez sur vous, vos talents, votre éducation et vos expériences de travail. Un publieur de tâche va probablement regarder votre profil lorsque vous appliquez pour sa tâche donc il est important d’inclure beaucoup de détails.",
    nelperTitle_04: "Quel est la procédure pour compléter une tâche et recevoir le paiement? ",
    nelperDesc_04: `Si votre application est acceptée, vous recevez une notification et votre statut d’application change. Lorsque vous vous êtes entendus sur les détails avec le publieur de la tâche, vous êtes prêt à compléter la tâche et recevoir le paiement.
    <ol>
      <li>
        Le publieur de la tâche envoie le paiement. Celui-ci sera sécuritairement gelé via notre plateforme {nelperPay}, jusqu'à ce que vous complétiez la tâche. Ainsi, vous pouvez commencer à travailler sur la tâche tout en sachant que le paiement est en attente pour vous.
      </li>
      <li>
        Vous complétez la tâche.
      </li>
      <li>
        Lorsque vous avez complété la tâche, cliquez sur <em>J'ai complété la tâche!</em>
      </li>
      <li>
        Le publieur de la tâche confirme que vous avez bel et bien complété sa tâche et vous recevez votre paiement.
      </li>
    </ol>`,
    nelperTitle_05: "Qu’arrive-t-il si mon application est refusée ou si la tâche se fait supprimer?",
    nelperDesc_05: "Si votre application se fait refuser, vous recevez une notification et votre statut d’application change. Si la tâche pour laquelle vous avez appliqué se fait supprimer, votre application sera également supprimée dans le processus.",
    privacySectionTitle: "Confidentialité",
    privacyTitle_00: "Est-ce que l’emplacement d’une tâche sur la carte est celui de l’adresse exacte?",
    privacyDesc_00: "Non. L’emplacement vu sur la carte est dans un rayon aléatoire de 400 mètres autour de l’emplacement exact. Un Nelper a seulement accès à l’adresse exacte lorsque son application se fait accepter.<br /><br />Vous pouvez créer un nouvel emplacement lorsque vous publiez une tâche ou en sélectionner un déjà existant, préalablement ajouté dans vos {settings}.",
    privacyTitle_01: "Est-ce que mon adresse courriel et mon numéro de téléphone peuvent être vus publiquement?",
    privacyDesc_01: "Non. Ils ne sont montrés que lorsqu’un publieur de tâche accepte l’application d’un Nelper. Les deux ont accès au numéro de téléphone et à l’adresse courriel de l’autre, à des fins de communication.<br /><br />Vous pouvez ajouter ou changer votre numéro de téléphone et votre adresse courriel dans vos {settings}.",
    privacyTitle_02: "Est-ce possible de voir où habite un Nelper avant d’accepter son application?",
    privacyDesc_02: "Oui. Lorsque vous visitez le profil d’un Nelper à partir de la liste d’applications, vous pouvez voir la ville dans laquelle il habite.",
    paymentSectionTitle: "Paiement & Aide",
    paymentTitle_00: "Qu’est-ce que NelperPay?",
    paymentDesc_00: "NelperPay est notre plateforme de paiement. Toutes les transactions passent par NelperPay. Vous n’avez pas besoin de programme externe ou de compte bancaire en ligne (tel que Paypal). C’est simple, rapide, sécuritaire et fiable.<br /><br />Vous pouvez en apprendre plus sur la procédure des transactions, les options de paiement ainsi que sur les caratéristiques de fiabilité sur la page {nelperPay}.",
    paymentTitle_01: "Comment envoyer un paiement?",
    paymentDesc_01: "Sur votre page de tâche, cliquez sur <em>Procéder au paiement</em> et entrez vos informations de paiement. Vous pouvez payer par crédit ou débit avec votre Mastercard, VISA, ou American Express.<br /><br />Lorsque vous effectuez un paiement, un reçu vous est envoyé automatiquement par courriel",
    paymentTitle_02: "Comment recevoir un paiement?",
    paymentDesc_02: "Lorsque votre paiement se fait libérer par le publieur de la tâche, l’argent est automatiquement déposé dans votre compte de banque. Pour que cela se produise, vous devez avoir lié un compte de banque à votre compte Nelper. Pour ce faire, allez dans la sous-section <em>Dépôts bancaires</em> dans vos {settings}. Cliquez sur <em>Lier un compte</em> et remplissez les champs requis.<br /><br /><strong>Nous nous recommandons de lier un compte de banque à votre compte Nelper le plus tôt possible si vous avez l’intention de compléter des tâches</strong>. Puisqu’il peut y avoir un petit délai de temps pour que vos informations bancaires soient validées, lier un compte de banque à votre compte Nelper le plus tôt possible est préférable. Si aucun compte de banque n’est lié lorsque l’argent est supposé être déposé, il sera gardé sécuritairement via {nelperPay}, jusqu’à ce que vous en ajoutiez un. Lorsque ce sera fait, le paiement et tous ceux à venir seront déposé automatiquement dans votre compte de banque.",
    paymentTitle_03: "Que faire en cas de dispute ou mésentente avec un Nelper?",
    paymentDesc_03: "Si votre Nelper réclâme son paiement sans avoir complété votre tâche, cliquez sur <em>Mon Nelper n’a pas complété ma tâche</em> dans le bas de votre page de tâche. Remplissez les champs requis, fournissez le plus de détails possible et incluez des preuves photos, si vous en avez.<br /><br />Nous allons examiner en détail votre dispute le plus tôt possible et vous receverez un courriel lorsque nous aurons résolu la dispute. Si votre Nelper n’a bel et bien jamais complété votre tâche, vous serez remboursé.<br /><br />Notre priorité la plus importante est de résoudre vos problèmes et disputes rapidement et en profondeur. Nous voulons vous offrir le meilleur service à la clientèle qui soit. Donc, à cet effect, si vous n’êtes pas satisfait avec l’une de nos décisions ou avez des questions après la résolution d’une dispute, vous pouvez nous contacter <u>n'importe quand</u> sur le {supportCenter}. Nous sommes là pour vous et allons répondre dans les plus brefs délais.",
    paymentTitle_04: "Que faire en cas de dispute ou mésentente avec un publieur de tâche?",
    paymentDesc_04: "Si le publieur de la tâche refuse de confirmer que vous avez complété la tâche, affirmant que le travail était mal fait ou que vous ne l’avez complété du tout, cliquez sur <em>Le publieur refuse de libérer le paiement</em> dans le page de votre page d’application. Remplissez les champs requis, fournissez le plus de détails possible et incluez des preuves photos, si vous en avez.<br /><br />Nous allons examiner en détail votre dispute le plus tôt possible et vous receverez un courriel lorsque nous aurons résolu la dispute. Si nous jugeons que la tâche a été complétée dans des mesures acceptables, vous receverez votre paiement.<br /><br />Notre priorité la plus importante est de résoudre vos problèmes et disputes rapidement et en profondeur. Nous voulons vous offrir le meilleur service à la clientèle qui soit. Donc, à cet effect, si vous n’êtes pas satisfait avec l’une de nos décisions ou avez des questions après la résolution d’une dispute, vous pouvez nous contacter <u>n'importe quand</u> sur le {supportCenter}. Nous sommes là pour vous et allons répondre dans les plus brefs délais.",
    paymentTitle_05: "Où puis-je obtenir du service à la clientèle?",
    paymentDesc_05: "Si vous avez besoin d’aide, avez des questions, désirez rapporter une erreur or voulez nous donner votre avis sur notre service, veuillez visiter le {supportCenter}. Vous pouvez nous rejoindre <u>n'importe quand</u> et nous vous répondrons dans les plus brefs délais!",
  },

  nelperPay: {
    headerTitle: "NelperPay",
    headerText: "A <strong>safe</strong> payment platform for everyone",

    whatIsTitle: "What is NelperPay?",
    whatIsText: "NelperPay is our payment platform. It's simple, safe and trustworthy.",
  },

  settings: {
    common: {
      settings: "Paramètres",
    },
    account: {
      title: "Compte",

      general: "Général",
      email: "Adresse courriel",
      phone: "Téléphone",
      language: "Langue",
      french: "Français",
      english: "Anglais",

      locations: "Emplacement",
      locationAdd: "Ajouter nouvel",
      locationName: "Nom",
      locationAddress: "Adresse",
      noLocations: "<em>Aucun emplacement ajouté</em>",

      password: "Mot de passe",
      passwordCurrent: "Actuel",
      passwordNew: "Nouveau",
      passwordConfirm: "Saisir à nouveau",

      deleteAccount: "Supprimer mon compte",
      deleteAccountMessage: "La suppression du compte est permanente",
      deleteAccountButton: "Supprimer mon compte",

      saveGeneral: "Sauvegarder les modifications",
      changePassword: "Changer le mot de passe",
    },
    notifications: {
      title: "Notifications",

      email: "Notifications par courriel",
      emailMe: "M'envoyer un courriel quand",
      sendMe: "M'envoyer",

      poster: "Publieur de tâche",
      posterSetting1: "Un Nelper applique pour ma tâche",
      posterSetting2: "Mon Nelper demande que son paiement soit libéré",

      nelper: "Nelper",
      nelperSetting1: "Mon statut d'application change",
      nelperSetting2: "Je reçois un paiement",

      newsletter: "Courriel d'informations",
      newsletterSetting1: "Notre courriel d'informations contenant les nouveautés sur Nelper",
    },
    nelperpay: {
      title: "Dépôts bancaires",
      creditCards: "Compte de banque",
      creditCardAdd: "Lier un compte",
    },
    history: {
      title: "Historique des transactions",
    },
  },
};
