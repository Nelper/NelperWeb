export default {

  common: {
    accepted: "Accepted",
    pending: "Pending",
    applied: "Applied",

    viewProfile: "View Profile",

    cancelApply: "Cancel Application",

    postedRelative: "Posted {formattedAgo}",
    expiresRelative: "Expires {formattedAgo}",

    warning: "Warning!",
    cancel: "Cancel",
    add: "Add",
    delete: "Delete",

    browse: "Browse...",
  },

  categories: {
    technology: {
      name: "Electronic & IT Support",
      examples: "Computer Repair, Internet/Router Setup, Printer Installation, TV & Sound System Installation, Email Setup, Tablets & Phones Support, and more!",
    },
    business: {
      name: "Business & Admin",
      examples: "Accounting, Files Organization, Resume Building, Letters Writing & Review, Advertisement Strategies, Social Media Account Management, Data Entry, and more!",
    },
    multimedia: {
      name: "Multimedia & Design",
      examples: "Website & App Development, Photo & Video Editing, Graphic Design, Printing, Videography & Photography, Music Production, and more!",
    },
    gardening: {
      name: "Gardening",
      examples: "Garden Maintenance, Landscaping, Lawn Mowing, Raking Leaves, Outdoor Pest Control, Arborism, Fruit Tree Pruning, Tree Planting, Bushes Pruning, and more!",
    },
    handywork: {
      name: "Handyman",
      examples: "Furniture Assembling, Carpentry, Electrical Work, Painting, Plumbing, Roofing, Window Services, Appliance Repair, Floor Installation, and more!",
    },
    housecleaning: {
      name: "Cleaning",
      examples: "House Cleaning, Laundry Services, Waste Removal, Guttering, Pool & Spa Cleaning, Steam Cleaning, Indoor Pest Control, Car Wash, and more!",
    },
    other: {
      name: "Other",
    },
  },

  routes: {
    nelpcenter: "Nelp Center",
    taskDetail: "Task Detail",
    applicationDetail: "Application Detail",
  },

  navBar: {
    howWorks: "How it works",
    browse: "Browse Tasks",
    post: "Post a Task",
    login: "Login",
    center: "Nelp Center",
  },

  home: {
    topSectionTitle: "Your task completion marketplace",
    topSectionDesc: "With Nelper, connect with people around you and get your tasks completed or complete other people's tasks.",

    browseTitle: "Browse Tasks",
    browseDesc: "Browse & find tasks to complete.",
    nelpcenterTitle: "Nelp Center",
    nelpcenterDesc: "Manage your tasks and applications.",
    postTitle: "Post a Task",
    postDesc: "Find a Nelper to complete your task.",

    getCompletedTitle: "Get your tasks completed",
    getCompletedDesc: "There's someone in your neighborhood who can help.<br />Posting a task is <strong>free</strong>.",
    getStarted: "Post a Task",

    categoriesTitle: "Simple categories, multiple options",
    categoriesDesc: "Anything can be completed on Nelper, from router installation to lawn mowing",

    becomeNelperTitle: "Become a Nelper",
    becomeNelperDesc: "Want to help people close to you and make money by completing tasks? Join the community now!",
    browseTasks: "Browse Tasks",

    nelperpayTitle: "NelperPay",
    nelperpayDesc: "Peace of mind for Task Posters and Nelpers.",
    nelperpayFeature1: "No external accound needed.",
    nelperpayFeature2: "No setup fees.",
    nelperpayFeature3: "No trouble.",
  },

  browse: {
    moreFilters: "More Filters",
    higherThan: "Higher than",
    within: "Within",
    priceRange: "Price range",
    disRange: "Distance range",

    noTask: "No task found",

    price: "Price",
    distance: "Distance",
    date: "Creation date",

    myOffer: "My offer",
  },

  nelpcenter: {
    main: {
      myTasks: "Mes tâches",
      myApplications: "Mes applications",

      applied: "Applied {moment}",
      awayFrom: "{distance, number} km away from you",
    },

    common: {
      nelperCount: "{num, plural, =0 {No pending Nelper} =1 {{num} pending Nelper} other {{num} pending Nelpers}}",
      deleteTask: "Delete this task",
      editPic: "Edit my pictures",

      completion: "Task Completion",
    },

    applicationDetail: {

      status: "Application status",
      agreed: "Agreed Price",
      offer: "Your Offer",

      progressAccepted: "Accepted",
      progressSent: "Payment sent",
      progressPayment: "Payment requested",
      progressReleased: "Funds released",
      completed: "I have completed the task!",
      progressHelp: `
      <h2>How does the payment & task completion process work?</h2>
      <ol>
        <li>
          The Task Poster sends the payment via [NelperPay] where it will be securely
          held until you complete the task. This way, you can start working on the task
          knowing the funds are held for you.
        </li>
        <li>
          You complete the task.
        </li>
        <li>
          Once the task has been completed, click on <em>I have completed the task</em>.
        </li>
        <li>
          The Task Poster confirms that the task has been completed and you receive the payment.
        </li>
      </ol>
      `,

      chat: "Chat with the Task Poster",

      offering: "Task Poster is offering",
      locationShown: "Location shown",
      locationWithin: "Task location within 400m",
    },

    taskDetail: {

      nelperPending: "Nelpers",
      nelperDenied: "Denied Nelpers",
      nelperAccepted: "Accepted Nelper",
      deleteConfirm: "Are your sure you want to delete the task {title}?",

      progressAccepted: "Nelper Accepted",
      progressSent: "Payment sent",
      progressApproved: "Approved Task Completion",
      progressRating: "Rating & Feedback",
      progressHelp: `
      <h2>How does the payment & task completion process work?</h2>
      <ol>
        <li>
          Click on <em>Proceed to Payment</em>. Once the payment is sent, it will be securely held via [NelperPay] until your task gets completed.
        </li>
        <li>
          Your Nelper completes your task.
        </li>
        <li>
          Once your task is completed, your Nelper will request the payment. Click on <em>The Nelper completed my task</em> and your Nelper's funds will be released.
        </li>
        <li>
          Rate and give feedback to your Nelper.
        </li>
      </ol>
      `,
    },

    acceptedTaskView: {
      proceedPayment: "Proceed to payment",
      aboutNelperPay: "About NelperPay",

      chat: "Chat with your Nelper",
    },
  },

  post: {
    selectCategory: "Select a Category",
    changeCategory: "Select another category",
    taskTitle: "Enter your task title",
    taskDescription: "Describe what your are looking for",
    taskOffer: "How much are you offering?",
    taskLocation: "Select your location",
    taskPictures: "Attach pictures",
    post: "Post task!",

    deleteLocationTitle: "Delete location",
    deleteLocationMessage: "Are you sure you want to delete the location '{name}'?",
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
    privacyTitle_03: "If I sign in with Facebook, do other users have access to my Facebook page?",
    privacyDesc_03: "No. Only your Facebook’s profile picture and email are used for your Nelper’s account. After your first sign in, you can change them in your {settings}.",
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
