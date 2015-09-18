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
    delete: "Delete",
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
      <h2>How does the payment & task completion process work as a Nelper?</h2>
      <p>All the actions are done here :</p>
      <ol>
        <li>
          The Task Poster sends the funds via [NelperPay] where they will be securely
          held until the task gets completed. This way, you can start working on the task
          knowing the funds are held for you.
        </li>
        <li>
          You complete the task.
        </li>
        <li>
          Once the task has been completed, click on <em>I have completed the task</em>.
        </li>
        <li>
          The Task Poster confirms that the task has been completed and the funds are released to you.
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
      <h2>How does the payment & task completion process work as a Task Poster?</h2>
      <p>All the actions are done here :</p>
      <ol>
        <li>
          Click on <em>Proceed to Payment</em>. Once the payment is sent, the funds will be securely held via [NelperPay] until your task has been completed.
        </li>
        <li>
          Your Nelper completes your task.
        </li>
        <li>
          Once your task is completed, your Nelper requests payment. Click on <em>The Nelper completed my task</em> for your Nelper's funds to be released.
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
};
