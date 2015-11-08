export default {

  common: {
    accept: "Accept",
    accepted: "Accepted",
    pending: "Pending",
    applied: "Applied",

    viewProfile: "View Profile",

    cancelApply: "Cancel application",

    postedRelative: "Posted {formattedAgo}",
    expiresRelative: "Expires {formattedAgo}",

    warning: "Warning!",
    cancel: "Cancel",
    add: "Add",
    delete: "Delete",
    close: "Close",

    browse: "Browse...",
  },

  categories: {
    technology: {
      name: "Electronic & IT Support",
      examples: "Computer Repair, Internet/Router Setup, Printer Installation, TV & Sound System Installation, Email Setup, Tablet & Phone Support, and more!",
    },
    business: {
      name: "Business & Admin",
      examples: "Accounting, Files Organization, Resume Building, Letter Writing & Review, Advertisement Strategies, Social Media Account Management, Data Entry, and more!",
    },
    multimedia: {
      name: "Multimedia & Design",
      examples: "Website & App Development, Photo & Video Editing, Graphic Design, Printing, Videography & Photography, Music Production, and more!",
    },
    gardening: {
      name: "Gardening",
      examples: "Garden Maintenance, Landscaping, Lawn Mowing, Leaf Raking, Outdoor Pest Control, Arborism, Tree Planting, Bush & Tree Pruning, and more!",
    },
    handywork: {
      name: "Handyman",
      examples: "Furniture Assembling, Carpentry, Electrical Work, Painting, Plumbing, Roofing, Window Services, Appliance Repair, Floor Installation, and more!",
    },
    housecleaning: {
      name: "Cleaning",
      examples: "House Cleaning, Laundry Service, Waste Removal, Guttering, Pool & Spa Cleaning, Steam Cleaning, Indoor Pest Control, Car Wash, and more!",
    },
    other: {
      name: "Other",
    },
  },

  routes: {
    nelpcenter: "Nelp Center",
    taskDetail: "My Task",
    taskApplicationDetail: "Nelper's profile",
    applicationDetail: "My Application",
    applicationDetailProfile: "Poster's profile",
    browse: "Browse tasks",
    browseProfile: "Poster's profile",
  },

  navBar: {
    login: "Login",
    browse: "Browse Tasks",
    center: "Nelp Center",
    post: "Post a Task",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    howItWorks: "How It Works",
    nelperPay: "NelperPay",
    faq: "FAQ",
  },

  home: {
    topSectionTitle: "Your task completion marketplace",
    topSectionDesc: "With Nelper, find people near you who can complete your tasks or earn money completing other people’s tasks.",

    browseTitle: "Browse Tasks",
    browseDesc: "Browse & find tasks to complete.",
    nelpcenterTitle: "Nelp Center",
    nelpcenterDesc: "Manage your tasks and applications.",
    postTitle: "Post a Task",
    postDesc: "Find a Nelper who can complete your task.",

    getCompletedTitle: "Get your tasks completed",
    getCompletedDesc: "There's someone in your neighborhood who can help.<br />Posting a task is <strong>free</strong>.",
    getStarted: "Post a Task",

    categoriesTitle: "Simple categories, multiple options",
    categoriesDesc: "Anything can be completed on Nelper, from router installation to lawn mowing",

    becomeNelperTitle: "Become a Nelper",
    becomeNelperDesc: "Want to earn money by completing tasks? Join the community now!",
    browseTasks: "Browse Tasks",

    nelperpayTitle: "NelperPay",
    nelperpayDesc: "A safe and trustworthy payment platform.",
    nelperpayFeature1: "No third-party account needed.",
    nelperpayFeature2: "No hidden fees.",
    nelperpayFeature3: "No worries.",
  },

  browse: {
    moreFilters: "Filters",
    higherThan: "Higher than",
    within: "Within",
    priceRange: "Price range",
    disRange: "Distance range",

    noTask: "No task found",

    price: "Price",
    distance: "Distance",
    date: "Date",

    myOffer: "My offer",
    makeOffer: "Make an offer",
    viewApplication: "View my application",
    profile: "Profile",
  },

  nelpcenter: {
    main: {
      myTasks: "My Tasks",
      myApplications: "My Applications",

      applied: "Applied {moment}",
      awayFrom: "{distance, number} km away from you",
    },

    common: {
      nelperCount: "{num, plural, =0 {No application} =1 {{num} pending application} other {{num} pending applications}}",
      deleteTask: "Delete this task",
      editPic: "Edit pictures",

      completion: "Task completion process",

      noApplication: "No applications yet!",
    },

    myTasks: {
      noTask: "No active tasks.",
      post: "Post a Task",
      nelperAccepted: "Nelper accepted",
      paymentSent: "Payment Sent",
      feedback: "Rating & Feedback",
      paymentRequested: "Payment Requested",
      paymentReleased: "Payment Released",
      completed: "Completed",
      activeTasks: "Active tasks",
      completedTasks: "Completed tasks",
      acceptedRelative: "Accepted {formattedAgo}",
      sentRelative: "Sent {formattedAgo}",
      requestedRelative: "Requested {formattedAgo}",
    },

    myApplications: {
      noApplication: "No active applications.",
      browse: "Browse Tasks",
      accepted: "Application accepted",
      pending: "Application pending",
      denied: "Application declined",
    },

    applicationDetail: {
      status: "Status",
      agreed: "Agreed price",
      offer: "Your offer",
      amount: "Amount",
      sent: "Sent",
      requested: "Requested",
      initiated: "Initiated",

      progressAccepted: "Accepted",
      progressSent: "Payment Sent",
      progressPayment: "Payment Requested",
      progressReleased: "Payment Released",
      completed: "I have completed the task!",
      progressHelp: `
      <h2>What is the payment & task completion process?</h2>
      <ol>
        <li>
          The Task Poster sends the payment via {nelperPay} where it gets held
          securely until you complete the task. This way, you can start working on
          the task knowing the money is held for you.
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

      chat: "Open chat",

      offering: "{name} is offering",
      locationShown: "Exact task location shown",
      locationWithin: "Task location within 400m",
    },

    taskDetail: {
      nelperPending: "Nelpers",
      nelperDenied: "Declined Nelpers",
      nelperAccepted: "Accepted Nelper",
      deleteConfirm: "Are your sure you want to delete the task {title}?",

      progressAccepted: "Nelper Accepted",
      progressSent: "Payment Sent",
      progressApproved: "Confirm Task Completion",
      progressRating: "Feedback",
      progressHelp: `
      <h2>What is the payment & task completion process?</h2>
      <ol>
        <li>
          Click on <em>Proceed to Payment</em>. Enter your credit card's info and send the payment. A receipt will be sent automatically to your email.
        </li>
        <li>
          Once the payment has been sent, it will be held securely via {nelperPay} until your task gets completed.
        </li>
        <li>
          Your Nelper completes your task.
        </li>
        <li>
          Once your task has been completed, you need to release your Nelper's payment. To do so, confirm the task completion by clicking on <em>The Nelper completed my task</em>. This concludes the transaction.
        </li>
        <li>
          Finally, rate and give feedback to your Nelper.
        </li>
      </ol>
      `,

      removeApplicant: "Remove Nelper",

      confirmAcceptTitle: "Are you sure you want to accept this Nelper?",
      confirmNelperAccepted: "Nelper accepted",

      paymentTitle: "Payment",
      paymentTo: "to {name}",
      paymentPlaceholderName: "Cardholder name",
      paymentPlaceholderCard: "Card number",
      paymentPlaceholderExpiry: "MM / YY",
      paymentPlaceholderCVC: "CVC",
      paymentPay: "Pay {amount}",
      paymentTerms: "Terms of use",
      paymentErrorName: "Invalid cardholder name",
      paymentErrorCard: "Invalid card number",
      paymentErrorExpiry: "Invalid expiration date",
      paymentErrorCVC: "Invalid CVC code",
      paymentError: "An error occured, please try again.",
      paymentCompleted: "Payment successfully sent!",
    },

    acceptedTaskView: {
      proceedPayment: "Proceed to payment",
      aboutNelperPay: "About NelperPay",
      taskCompleted: "{name} has completed my task",
      paidOn: "paid on {date}",

      chat: "Open chat",
    },
  },

  post: {
    selectCategory: "Select a category",
    changeCategory: "Select another category",
    taskTitle: "Enter a title",
    taskDescription: "Describe what you are looking for",
    taskOffer: "How much are you offering?",
    taskLocation: "Select your location",
    taskPictures: "Attach pictures",
    post: "Post my task!",

    errorTitle: "Please enter a title.",
    errorDesc: "Please enter a description.",
    errorPrice: "Please enter a price between {min, number, CAD} and {max, number, CAD}.",
    errorLocation: "Please select or add a location.",

    deleteLocationTitle: "Delete location",
    deleteLocationMessage: "Are you sure you want to delete the location '{name}'?",
  },

  profile: {
    editPicture: "Change picture",
    about: "About",
    skills: "Skills",
    addSkill: "Add new",
    education: "Education",
    addEducation: "Add new",
    experience: "Work experience",
    addExperience: "Add new",
    feedback: "Feedback",

    noFeedback: "No feedback yet",
  },

  faq: {
    pageTitle_01: "Here are some frequently asked questions to help you get started on Nelper.",
    pageTitle_02: "If you can’t find what you are looking for, you can contact us on the {supportCenter}.",
    supportCenter: "Support Center",

    generalSectionTitle: "General",
    generalTitle_00: "What is Nelper?",
    generalDesc_00: "Nelper is an online marketplace for posting and completing tasks. With Nelper, find people near you who can complete your tasks or earn money completing other people’s tasks. On web or on {iOS}.",
    generalTitle_01: "Why should I use Nelper?",
    generalDesc_01: "If you are tired of paying too much for simple tasks done by unefficient small companies or having to wait all day at home for a representative or technician to come by anytime between 8 and 5, start using Nelper now.<br /><br />On Nelper, you're the boss. You set the price, you set the time and you choose your Nelper (worker completing tasks or looking for tasks to complete). You can easily find qualified Nelpers near you and twice as fast.",
    generalTitle_02: "How does it work?",
    generalDesc_02: "Start by posting your task. Interested Nelpers will apply for it, for the same price or for a price offer of their own. Check out their profile and feedback to choose the perfect Nelper for your task.<br /><br />Once details have been taken care of between you and your Nelper, send the payment. It will be held securely on {nelperPay}, our payment platform, until your task gets completed. Once your task has been completed to your satisfaction, confirm the task completion and your Nelper's payment gets released.<br /><br />Read more about {howItWorks}.",
    generalTitle_03: "What can I get done on Nelper?",
    generalDesc_03: "Anything! Home tasks like Gardening, Cleaning or Handyman services, Business & Admin tasks like accounting or data entry, Multimedia tasks like website development or graphic design, Electronic & IT Support tasks like router installation or computer repair, you name it! You can find verified Nelpers who are skilled and eager to work on any kind of tasks.",
    generalTitle_04: "Is it free?",
    generalDesc_04: "Posting a task is <strong>FREE</strong>. You only pay the agreed price for your task, nothing more, no hidden fees.<br /><br />Browsing and applying for tasks is also <strong>FREE</strong>. However, unpon task completion, Nelpers have a small service fee of 7.5% deducted from their total received amount, for {nelperPay}’s secure payment handling.",
    posterSectionTitle: "Posting a task",
    posterTitle_00: "How do I post a task?",
    posterDesc_00: "Go to {postATask}. Select a category, enter a title, describe your task, enter your price offer, add the task location and add pictures, if needed.<br /><br />Simple as that, it only take a few minutes.",
    posterTitle_01: "How do I know how much to pay for a task?",
    posterDesc_01: "When posting a task, the price you enter can only be a starting point, based on what you think is fair. When applying for a task, Nelpers have the option of making a price offer of their own, in order to reach a fair price for both parties.<br /><br />There are no rules about how much you should pay for a task but keep in mind that tasks requiring more time or skills should cost more. We also recommend browsing similar tasks of the same category in {browseTasks} to have a better idea of how much you should offer at first.",
    posterTitle_02: "Where can other people see my task?",
    posterDesc_02: "In {browseTasks}. All the tasks can be found there.",
    posterTitle_03: "Where can I review and edit my task?",
    posterDesc_03: "In your {nelpCenter}, under <em>My Tasks</em>. All your active and completed tasks are there along with their price, status & number of Nelpers who applied.<br /><br />Click on your task to review its full details, edit its title & description, add/remove pictures and see the full list of Nelpers who applied for it.",
    posterTitle_04: "Where can I see who applied for my task?",
    posterDesc_04: "The list of Nelpers who applied is on your task page. Check out their rating, number of completed tasks and price offer. To visit their profile, click on their picture. You can also see their feedback from previously completed tasks and open a chat window to ask them questions.",
    posterTitle_05: "What is the payment & task completion process?",
    posterDesc_05: `Once you have accepted a Nelper and that all details have been taken care of, your task is ready for payment & completion. Everything is done on your task page.
    <ol>
      <li>
        Click on <em>Proceed to Payment</em>. Enter your credit card info and send the payment. A receipt will be sent automatically to your email.
      </li>
      <li>
        Once the payment has been sent, it will be held securely via {nelperPay} until your task gets completed.
      </li>
      <li>
        Your Nelper completes your task.
      </li>
      <li>
        Once your task has been completed, you need to release your Nelper's payment. To do so, confirm the task completion by clicking on <em>The Nelper completed my task</em>. This concludes the transaction.
      </li>
      <li>
        Finally, rate and give feedback to your Nelper.
      </li>
    </ol>`,
    posterTitle_06: "Am I obliged to accept a Nelper?",
    posterDesc_06: "No. There are no obligations to accept a Nelper and go through with payment.<br /><br />If you don't accept any application or if no one applies for your task, it will stay active until you delete it or until you accept an application. However, if no one applies, it may be an indicator that your task is unclear, too complicated or that the price offered is too low.",
    nelperSectionTitle: "Completing tasks",
    nelperTitle_00: "How do I browse tasks?",
    nelperDesc_00: "All the tasks can be found in {browseTasks}. The map and the list are linked together. If you select a task in the list, you see its location on the map. If you click a task pin on the map, it gets shown in the list.<br /><br />You can filter the displayed tasks by category, price range or distance range. You can also sort the task list by price, distance or posted date. Distance filtering and sorting are based on your location. You can add/manage locations in your {settings} or have your current location taken by allowing Nelper to access it, when asked.",
    nelperTitle_01: "Why do I need to link my bank account before applying for tasks?",
    nelperDesc_01: "For safety purposes, we need to verify your ID before you start completing tasks. The information you provide during the bank account linking verifies your ID. Later on, payments will also be automatically deposited into your bank account.<br /><br />Go to the <em>Bank Deposits</em> subsection in your {settings}, click on <em>Link a bank account</em> and fill in the required fields. It's a quick one time setup.",
    nelperTitle_02: "How do I apply for a task?",
    nelperDesc_02: "Once you have found a task you would like to complete, click on <em>Make an offer</em>. You can either apply for the price that is offered by the Task Poster or make a price offer of your own. The choice is yours, based on what you think is fair.",
    nelperTitle_03: "Where can I see my task applications?",
    nelperDesc_03: "In your {nelpCenter}, under <em>My Applications</em>. All your active applications are there along with their status. You can also see the tasks you previously completed.<br /><br />If you click on one of your applications, you can review its details and open a chat window between you and the Task Poster.",
    nelperTitle_04: "How can I improve my chances of being accepted for a task?",
    nelperDesc_04: "Make sure to complete your {profile} thoroughly. Write about yourself, your skills, your education & work experience. A Task Poster will most likely look at it before making a decision, so being clear about your skills and including as many details as possible is important.",
    nelperTitle_05: "As a Nelper, what is the payment & task completion process?",
    nelperDesc_05: `If your application gets accepted, you receive a notification and your application status changes. Once all details have been taken care of between you and the Task Poster, the task is ready for payment and completion. All the remaining steps are completed on your application’s page.
    <ol>
      <li>
        The Task Poster sends the payment via {nelperPay} where it gets held securely until you complete the task. This way, you can start working on the task knowing the money is held for you.
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
    </ol>`,
    nelperTitle_06: "What happens if my application gets declined or if the task gets deleted?",
    nelperDesc_06: "If your application gets declined, you receive a notification and your application status changes. If a task you applied for gets deleted, your application will be deleted as well in the process.",
    privacySectionTitle: "Privacy",
    privacyTitle_00: "Is my exact task location shown on the map?",
    privacyDesc_00: "No. The location shown on the map is a random one, taken from a 400m area around the exact location. This way, the address remains confidential. Nelpers only have access to the exact task location once you accept their application.<br /><br />You can add a new location when posting a task or select one you already added in your {settings}.",
    privacyTitle_01: "Are my email & phone number publicly shown?",
    privacyDesc_01: "No. People can only see each other’s email and phone number once a Task Poster accepts a Nelper's application, for communication purposes.<br /><br />You can edit email accounts & phone numbers in your {settings}.",
    privacyTitle_02: "Can I see where a Nelper is from before accepting an application?",
    privacyDesc_02: "Yes, on their profile page. Only their city is shown.",
    paymentSectionTitle: "Payment & Support",
    paymentTitle_00: "What is NelperPay?",
    paymentDesc_00: "It's our payment platform. Every transaction is handled via {nelperPay}. No third-party account (like Paypal) are needed. It's simple, safe and trustworthy.<br /><br />You can learn more about the transaction process, payment options and trust features on the {nelperPay} page.",
    paymentTitle_01: "How do I send a payment?",
    paymentDesc_01: "On your task page, click on <em>Proceed to payment</em> and fill in the required fields. You can pay using your Mastercard, VISA or American Express credit card.<br /><br />Everytime you send a payment, a receipt will be sent automatically to your email.",
    paymentTitle_02: "How do I receive a payment?",
    paymentDesc_02: "When your payment gets released by a Task Poster after you have completed their task, your money will be automatically deposited into your bank account. For this to happen, you need to have a bank account linked to your Nelper account. To do so, go to the <em>Bank Deposits</em> subsection in your {settings}, click on <em>Link a bank account</em> and fill in the required fields.<br /><br /><strong>If you plan on completing tasks, we recommend that you link your bank account as soon as possible</strong>, as there can be a short delay for your banking information to be validated. If you receive a payment and haven’t linked a bank account yet, it will be securely held via {nelperPay} until you do so. Once it’s done, every payment you receive will be automatically deposited into your bank account.",
    paymentTitle_03: "What do I do if I have issues with a Nelper during the payment/task completion?",
    paymentDesc_03: "If your Nelper requests the payment but didn’t complete your task or only refuses to complete your task, click on <em>My Nelper has not completed my task</em> at the bottom of your task page. Fill in the required fields and provide as many details & pictures as possible.<br /><br />We will review your dispute at the earliest and you will be notified via email once it has been resolved. If your task was poorly or not complete, you will get a refund.<br /><br />We always review disputes and thoroughly and make resolving them our first priority. If you are unsatisfied or still have questions after a resolved issue, you can contact us <u>anytime</u> on the {supportCenter}. We’re here for you.",
    paymentTitle_04: "What do I do if I have issues with a Task Poster during the payment/task completion process?",
    paymentDesc_04: "If the Task Poster refuses to confirm the task completion, therefore not releasing your payment, claiming that the task was either poorly completed or not completed, click on <em>The Task Poster refuses to release the payment</em> at the bottom of your application page. Fill in the required fields and provide as many details & pictures as possible.<br /><br />We will review your dispute at the earliest and you will be notified via email once it has been resolved. If you prove that you completed the task in a proper way, you will receive your payment.<br /><br />Resolving disputes is our first priority and we always review them thoroughly. If you are unsatisfied or still have questions after a resolved issue, you can contact us <u>anytime</u> on the {supportCenter}. We’re here for you.",
    paymentTitle_05: "Where can I get customer support?",
    paymentDesc_05: "If you need help with something, have questions, want to report bugs or want to leave feedback, you can contact us anytime on the {supportCenter}. Our support team will get back to you as soon as possible!",
  },

  nelperPay: {
    headerTitle: "NelperPay",
    headerText: "A <strong>safe</strong> and <strong>trustworthy</strong> payment platform",

    section1Title: "Hassle-free Transactions",
    section1Subtitle: "No third-party account needed. Fraud protection.",
    section1Desc: `
      <p>
        Online payments shouldn’t be worrisome and complex and, at Nelper, we get that. Every transaction on Nelper is handled via NelperPay. Instead of letting you handle payments on your own, we take care of them for you. This way, you don’t have to worry about fraud or disputes.
      </p>
      <p>You also don’t need an account from a third-party payment platform such as Paypal. In order to send or receive a payment, you never have to leave Nelper.</p>
    `,

    section2Title: "4 Simple Steps",
    section2Subtitle: "Quick, simple and secured payment process.",
    section2Desc: `
        <ol>
        <li>
          The Task Poster sends the payment.
        </li>
        <li>
          The payment gets held securely via NelperPay until the task gets completed.
        </li>
        <li>
          The Nelper completes the task.
        </li>
        <li>
          The Task Poster confirms the task completion and the payment gets released.
        </li>
      </ol>
      <p>
        As a Task Poster, you need to confirm that your task has been completed before the payment gets released so you can rest assured it will be completed properly.
      </p>
      <p>
        As a Nelper, with the payment held for you before the task completion, you can start working without worrying about being paid or not.
      </p>
    `,

    section3Title: "Sending Payments",
    section3Subtitle: "Quick payments. No hidden fees.",
    section3Desc: `
      <p>
        There are no fees for posting a task or sending a payment. You only pay the agreed price for your task, nothing more.
      </p>
      <p>
        Sending a payment doesn’t require any setup, you only need to enter your name and your credit card’s number, expiration date & CVC. You can pay with Mastercard, VISA or American Express.
      </p>
    `,

    section4Title: "Receiving Payments",
    section4Subtitle: "One time setup, automatic bank deposits.",
    section4Desc: `
      <p>
        Before being able to apply for tasks, you need to link a bank account to your Nelper account. This verifies your ID and later on, once you receive a payment, it will be automatically deposited into your bank account.
      </p>
      <p>
        Go to the <em>Bank Account</em> subsection in your {settings}, click on <em>Link a bank account</em> and fill in the required fields. It’s a quick one time setup.
      </p>
      <p>
        Although there are no fees for browsing or applying for tasks, there’s one when receiving a payment. It’s a small service fee that the Nelper has to cover, for NelperPay’s secure payment handling. It consists of 7.5% of the total task amount, deducted from the amount received.
      </p>
    `,

    section5Title: "Customer Support",
    section5Subtitle: "We’re here for you.",
    section5Desc: `
      <p>
        In case of disputes, bugs or issues related to payments and task completion,
        we are here to help.
      </p>
      <p>
        If you have a misunderstanding with another user, flag the transaction on
        your task or application page. We will review your dispute at the earliest
        and you will be notified via email once it has been resolved. We always review disputes and thoroughly and make resolving them our first priority
      </p>
      <p>
        If you are unsatisfied or have questions after a resolved dispute, want
        to report a bug or have an issue, you can contact us <u>anytime</u> on the
        {supportCenter}. Our support team is here to help.
      </p>
    `,
  },

  settings: {
    common: {
      settings: "Settings",
    },
    account: {
      title: "Account",

      general: "General",
      email: "Email",
      phone: "Phone",
      language: "Language",
      french: "French",
      english: "English",

      locations: "Locations",
      locationAdd: "Add new",
      locationName: "Name",
      locationAddress: "Address",
      noLocations: "<em>No locations yet</em>",

      password: "Password",
      passwordCurrent: "Current",
      passwordNew: "New",
      passwordConfirm: "Re-type new",

      deleteAccount: "Delete Account",
      deleteAccountMessage: "Account deletion is permanent",
      deleteAccountButton: "Delete my account",

      saveGeneral: "Save changes",
      changePassword: "Change password",
    },
    notifications: {
      title: "Notifications",

      email: "Email Notifications",
      emailMe: "Email me when",
      sendMe: "Send me",

      poster: "Task Poster",
      posterSetting1: "A Nelper applies for my task",
      posterSetting2: "My Nelper requests their payment",

      nelper: "Nelper",
      nelperSetting1: "My task application status changes",
      nelperSetting2: "I receive a payment",

      newsletter: "Newsletter",
      newsletterSetting1: "Our newsletter introducing new features",
    },
    nelperpay: {
      title: "Bank Account",
      creditCards: "Bank Account",
      creditCardAdd: "Link",
    },
    history: {
      title: "Transaction History",
    },
  },
};
