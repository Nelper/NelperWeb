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
    browse: "Parcourir les tâches",
    post: "Publier une tâche",
    login: "Connexion",
    center: "Centre Nelp",
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
      <h2>Quel est le processus pour compléter la tâche et pour le paiement?</h2>
      <ol>
        <li>
          Le publieur de tâche envoie le paiement. Celui-ci sera sécuritairement gelé via notre plateforme NelperPay,
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
          Le publieur de tâche confirme que vous avez bel et bien complété sa tâche et vous recevez votre paiement.
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

      progressAccepted: "Nelper accepté",
      progressSent: "Paiement envoyé",
      progressApproved: "Confirmation",
      progressRating: "Note & critique",
      progressHelp: `
      <h2>Quel est le processus pour faire compléter ma tâche ainsi que pour le paiement?</h2>
      <ol>
        <li>
          Cliquez sur <em>Procéder au paiement</em>. Lorsque vous aurez envoyé le paiement, celui-ci sera sécuritairement
          gelé via notre plateforme NelperPay, jusqu'à ce que votre tâche soit complétée.
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
    taskDescription: "Décrivez ce dont vous avez besoin",
    taskOffer: "Combien offrez-vous?",
    taskLocation: "Choississez votre emplacement",
    taskPictures: "Ajouter des photos",
    post: "Créer la tâche!",

    deleteLocationTitle: "Supprimer l'emplacement",
    deleteLocationMessage: "Êtes-vous sûr de vouloir supprimer l'emplacement '{name}'?",
  },

  faq: {
    pageTitle_01: "Here are some frequently asked questions to help you use Nelper.",
    pageTitle_02: "If you have questions or can’t find what you are looking, please visit our {supportCenter}.",
    supportCenter: "Support Center",

    generalSectionTitle: "General",
    generalTitle_00: "What is Nelper?",
    generalDesc_00: "Nelper is a community marketplace to connect with people around you and get your tasks completed or complete other people’s tasks, for money. You can use Nelper on web or on {iOS}.",
    generalTitle_01: "How does it work?",
    generalDesc_01: "You can visit the {howItWorks} page, it contains all the details you need to know about posting tasks, browsing tasks, completing tasks and the Nelp Center.",
    generalTitle_02: "Why should I use Nelper?",
    generalDesc_02: "If you are tired of paying way too much for simple tasks and having to wait all day at home for a representative or technician to come by, you should post your tasks on Nelper. You can easily find people close to you who will complete your tasks cheaper and faster than your usual small local companies.",
    generalTitle_03: "What is the difference between a Task Poster and a Nelper?",
    generalDesc_03: "A <strong>Task Poster</strong> is someone who posts a task, for other people to complete. A <strong>Nelper</strong> is someone completing tasks or looking for tasks to complete.",
    generalTitle_04: "What kind of tasks are completed on Nelper?",
    generalDesc_04: "Anything! From router installation to lawn mowing, you can find or post any kind of tasks on Nelper. Our simple categories and easy to understand interface make it easy to post or browse tasks.",
    generalTitle_05: "Is Nelper free?",
    generalDesc_05: "Posting tasks, browsing tasks and applying for tasks are <strong>free</strong>, no hidden fees. As a Task Poster, you only pay the agreed price for your task, nothing more.<br /><br />For Nelpers, there is a 7,5% transaction fee deducted from the total amount. It’s a small service for {nelperPay}’s secure payment handling.",
    posterSectionTitle: "Task Poster",
    posterTitle_00: "How do I post a task?",
    posterDesc_00: "Go to {postATask}. Select a task category, give your task a title, give it a description, enter the price you are looking for, choose a location (your address) and add pictures of the task, if needed.<br /><br />Simple as that, the whole process only take a few minutes.",
    posterTitle_01: "How do I know how much to pay for a task?",
    posterDesc_01: "When posting a task, the price you enter can only be a starting point, based on what you think is fair. When applying for a task, Nelpers have the option to make a price offer of their own in order to reach a fair price for both parties.<br /><br />There are no rules about how much you should pay or receive for a completed task, but keep in mind that tasks requiring more time or skills should cost more. We also recommend browsing similar tasks of the same category in {browseTasks} to have a better idea of how much you should offer.",
    posterTitle_02: "Where can other people see my task?",
    posterDesc_02: "All the posted tasks can be found in {browseTasks}, which is where yours will be once it has been posted.",
    posterTitle_03: "Where can I see & edit my task?",
    posterDesc_03: "In your {nelpCenter}, under My Tasks. All your active and completed tasks are there along with their price, creation date & number of Nelpers who applied.<br /><br />If you click on one of your active tasks, you can edit it and see the full list of Nelpers who applied for it.",
    posterTitle_04: "How do I choose a Nelper?",
    posterDesc_04: "Click on your task and browse from the list of Nelpers who applied for it. Their name, rating, number of tasks completed and price offer are there.<br /><br />If you click on their profile picture, you have access to their profile and feedback from previously completed tasks. You can also open a chat window between you and the Nelper.",
    posterTitle_05: "How does the payment & task completion process work as a Task Poster?",
    posterDesc_05: `Once you accept a Nelper and that all details have been taken care of, your task is ready for payment & completion. All the remaining steps are completed on your task page.
    <ol>
      <li>
        Click on 'Proceed to Payment'. Once the payment is sent, it will be held securely via {nelperPay} until your task gets completed. This way, your Nelper won’t have access to the money yet but will be able to start working on your task knowing they are secured for them.
      </li>
      <li>
        Your Nelper completes your task.
      </li>
      <li>
        Once your task is completed, your Nelper will request the payment. Click on 'The Nelper completed my task' and your Nelper's money will be released.
      </li>
      <li>
        Rate and give feedback to your Nelper.
      </li>
    </ol>`,
    posterTitle_06: "What happens if there aren’t any Nelpers applying for my task?",
    posterDesc_06: "For every task, there is a 30 days delay once it’s been posted. Once this delay expires, the task gets deleted automatically. There aren’t any consequences or obligations if no one applies to complete your task. It may however be an indicator that your task is unclear, too complicated or that the price offered is too low.",
    nelperSectionTitle: "Nelper",
    nelperTitle_00: "Where and how do I browse tasks?",
    nelperDesc_00: "Go to {browseTasks}. All the active tasks can be found there. The task list and the map are linked together. If you click on a task in the list, you see its location on the map. If you click on a task on the map, it gets displayed in the list, with its full details.<br /><br />You can filter the tasks displayed on both the map and task list by category, price range or proximity. Proximity filtering is based on your location, which you can add or edit in your {settings}. You can also sort the tasks by price, distance & creation date.",
    nelperTitle_01: "How do I apply for a task?",
    nelperDesc_01: "Once you have chosen a task you want to complete, click on 'Make an Offer'. You have the option of either applying for the price the task was listed for or make a price offer of your own. The choice is yours, based on what you think is fair.",
    nelperTitle_02: "Where can I see my task applications?",
    nelperDesc_02: "In your {nelpCenter}, under My Applications. All your active applications are there, along with their status (Pending, Accepted or Declined). You can also see the tasks you previously completed.<br /><br />If you click on one of your applications, you can review its details and open a chat window between you and the Task Poster.",
    nelperTitle_03: "How can I improve my chances of being accepted for a task?",
    nelperDesc_03: "Make sure to complete your {profile} thoroughly. Write about yourself, your skills, your education & work experience. A Task Poster will most likely look at it before making a decision, so being clear about your skills and including as many details as possible is important.",
    nelperTitle_04: "How does the payment & task completion process work as a Task Poster?",
    nelperDesc_04: `If your application gets accepted, you get notified and your application status changes in your {nelpCenter}. Once all details have been taken care of between you and the Task Poster, the task is ready for payment and completion. All the remaining steps are completed on your application’s page.
    <ol>
      <li>
        The Task Poster sends the payment via {nelperPay} where it will be held securely until you complete the task. This way, you can start working on the task knowing the money is held for you.
      </li>
      <li>
        You complete the task.
      </li>
      <li>
        Once the task has been completed, click on 'I have completed the task'.
      </li>
      <li>
        The Task Poster confirms that the task has been completed and you receive the payment.
      </li>
    </ol>`,
    nelperTitle_05: "What happens if my application gets declined or if the task gets deleted?",
    nelperDesc_05: "You receive a notification and your application status changes in your {nelpCenter}.",
    privacySectionTitle: "Privacy",
    privacyTitle_00: "Is the exact task location shown on the map?",
    privacyDesc_00: "No. When a task is posted, its location shown on the map is within a random 400m area around the exact location. Nelpers only have access to exact locations/addresses once they get accepted by Task Posters.<br /><br />You can add a new location when posting a task or select one you already added in your {settings}.",
    privacyTitle_01: "Are my email & phone number publicly shown?",
    privacyDesc_01: "No. They are only shown once a Task Poster accepts a Nelper’s application. Both the Task Poster and the Nelper can see each other’s email & phone number, for communication purposes.<br /><br />You can edit email accounts & phone numbers in your {settings}.",
    privacyTitle_02: "Can I see where a Nelper is from before accepting an application?",
    privacyDesc_02: "Yes. Under the list of Nelpers who applied for your task, you can visit a Nelper’s profile and see it there. Only their city is shown.",
    paymentSectionTitle: "Payment & Support",
    paymentTitle_00: "What is NelperPay?",
    paymentDesc_00: "It's our payment platform. Every transaction is done via {nelperPay}. No external program or online banking account (such as Paypal) are needed. It is simple, safe and trustworthy.<br /><br />You can learn more about the transaction process, payment options and trust features on the {nelperPay} page.",
    paymentTitle_01: "How do I send a payment?",
    paymentDesc_01: "In your task page, click on 'Proceed To Payment'. A window will open for you to enter your payment info.<br /><br />You can pay using your Mastercard, VISA or American Express credit/debit card. You can either choose an existing payment method you previously added or add a new one. Add and manage credit/debit cards in your {settings}.<br /><br />Everytime you send a payment, a receipt will be automatically sent to your registered email.",
    paymentTitle_02: "How do I receive a payment?",
    paymentDesc_02: "Once your payment gets released by a Task Poster, the money will be automatically deposited to your registered bank account. For this to happen, you need to have a bank account linked to your Nelper account. To do so, visit the NelperPay subsection in your {settings}, fill in the required fields and follow the steps.<br /><br /><strong>We recommend that you link your bank account as soon as possible if you plan on completing tasks</strong>, as there can be a small delay for the information to be validated. If you receive a payment and you still haven’t linked a bank account, it will be safely held via NelperPay until you do so. Once it is done, you don’t have to do it anymore and payments will always be automatically deposited in your bank account.",
    paymentTitle_03: "What do I do if I have issues with a Nelper during the payment/task completion?",
    paymentDesc_03: "If your Nelper requests the payment but didn’t complete your task, click on 'My Nelper never completed my task' at the bottom of your task page. Fill in the required fields and provide as many details & pictures as possible.<br /><br />We will review your issue at the earliest and resolve the dispute. You will receive an email once it is resolved. If your Nelper indeed never completed your task, you will get your money back.<br /><br />We make resolving issues our first priority and will always review disputes and issues thoroughly. We want to offer you the best customer service possible so if you are unsatisfied or still have questions after a resolved issue, please feel free to contact us <u>anytime</u> on the {supportCenter}. We’re here for you.",
    paymentTitle_04: "What do I do if I have issues with a Task Poster during the payment/task completion process?",
    paymentDesc_04: "If the Task Poster refuses to confirm the task completion, claiming that the task was either poorly completed or never completed and therefore not releasing your payment, click on 'The Task Poster refuses to release the payment' at the bottom of your application page. Fill in the required fields and provide as many details & pictures as possible.<br /><br />We will review your issue at the earliest and resolve the dispute. You will receive an email once it is resolved. If you indeed completed the task in a way we see fit, you will receive your payment.<br /><br />We make resolving issues our first priority and will always review disputes and issues thoroughly. We want to offer you the best customer service possible so if you are unsatisfied or still have questions after a resolved issue, please feel free to contact us <u>anytime</u> on the {supportCenter}. We’re here for you.",
    paymentTitle_05: "Where can I get customer support?",
    paymentDesc_05: "If you need help with something, have questions, want to report bugs or want to leave feedback, please visit our {supportCenter}. You can ask us <u>anything</u> 24/7, we will get back to you as soon as possible!",
  },
};
