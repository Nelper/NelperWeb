import Stripe from 'stripe';

import {InvalidOperationError, UnauthorizedError} from '../errors';
import {getMe, getUserPrivateWithMasterKey} from './userData';
import {getTask} from './taskData';

// The percentage of the total amount charged that is transfered in our account.
const PLATFORM_FEES_PERCENTAGE = 10;

const stripe = new Stripe('sk_test_JBQSP7eMqdNUqe7rQFYLEFXi');

// TODO(janic): The payment process will need to be logged heavily to debug any issues.

export async function sendPaymentForTask(rootValue, taskId, token) {
  // The user creating the charge (the task poster).
  const user = await getMe(rootValue);
  if (!user) {
    throw new UnauthorizedError();
  }
  // The application that is being paid.
  const task = await getTask(rootValue, taskId);
  const application = task.get('acceptedApplication');

  // Validate the application state and that the application is for a task the user
  // owns.
  if (task.get('user').id !== user.id || !application) {
    throw new InvalidOperationError();
  }

  // Get the applicant stripe account.
  const applicantPrivate = await getUserPrivateWithMasterKey(application.get('user').id);
  const destination = applicantPrivate.get('stripeAccount');

  // The amount in cents to charge. The application price is in dollars so
  // we convert it to cents.
  const amount = application.get('price') * 100;

  // The platform fee. Will be deducted from the amount and transfered
  // to the Nelper account. {PLATFORM_FEES_PERCENTAGE}% of the total amount. Gettin' so much money n****!
  const applicationFee = amount * PLATFORM_FEES_PERCENTAGE / 100;

  // Create the charge on stripe.
  const response = await stripe.charges.create({
    amount: amount,
    currency: 'cad',
    source: token,
    destination: destination,
    application_fee: applicationFee,
  });

  console.log(response);
}

export async function createStripeAccount({sessionToken, userId, userAgent, ip}) {
  const user = await getMe({sessionToken, userId});
  if (!user) {
    throw new UnauthorizedError();
  }

  const privateData = user.get('privateData');

  const response = await stripe.accounts.create({
    country: 'CA',
    managed: true,
    email: privateData.get('email'),
    tos_acceptance: {
      date: Math.floor(new Date().getTime() / 1000),
      ip: ip,
      user_agent: userAgent,
    },
    transfer_schedule: {
      interval: 'manual',
    },
  });

  console.log(response);

  privateData.set('stripeAccount', response.id);
  return await privateData.save();
}

export async function addBankAccount(rootValue, token) {
  const user = await getMe(rootValue);
  const privateData = user.get('privateData');
  const stripeAccount = privateData.get('stripeAccount');

  const updateAccountRes = await stripe.accounts.update(
    stripeAccount, {
      legal_entity: {
        type: 'individual',
        address: {
          line1: '',
          city: '',
          state: '',
          postal_code: '',
          country: '',
        },
        dob: {
          day: 0,
          month: 0,
          year: 0,
        },
        first_name: '',
        last_name: '',
      },
    },
  );

  console.log(updateAccountRes);

  const response = await stripe.accounts.createExternalAccount(
    stripeAccount,
    {external_account: token},
  );

  console.log(response);
}

export async function transferToBankAccount() {
  const stripeAccount = '';
  const amount = 1000;
  const response = await stripe.transfers.create({
    amount: amount,
    currency: 'cad',
    destination: 'default_for_currency',
  },
  {stripe_account: stripeAccount});

  console.log(response);
}

export async function processStripeEvent(event) {
  console.log(event);
}
