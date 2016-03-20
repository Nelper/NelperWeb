/* @flow */

import Stripe from 'stripe';

import {InvalidOperationError, UnauthorizedError} from '../errors';
import {getMe, getUserPrivateWithMasterKey} from './userData';
import {getTask} from './taskData';
import {TASK_COMPLETION_STATE, TASK_PAYMENT_STATE} from './constants';

import config from '../config';
import {RootValue} from '../graphql';
import {ParseObject, ParseID} from './parseTypes';

// The percentage of the total amount charged that is transfered in our account.
const PLATFORM_FEES_PERCENTAGE = 10;

const stripe = new Stripe(config.stripe.masterKey);

// TODO(janic): The payment process will need to be logged heavily to debug any issues.

export async function sendPaymentForTask(rootValue: RootValue, taskId: ParseID, token: string): Promise<Object> {
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
    amount,
    destination,
    currency: 'cad',
    source: token,
    application_fee: applicationFee,
  });

  if (response.status !== 'succeeded') {
    return {
      paymentStatus: 1,
      task,
    };
  }

  const taskPrivate = task.get('privateData');
  taskPrivate.set('charge', response);
  task.set('completionState', TASK_COMPLETION_STATE.PAYMENT_SENT);
  task.set('paymentSentAt', new Date());

  await task.save(null, {sessionToken: rootValue.sessionToken});

  return {
    paymentStatus: 0,
    task,
  };
}

export async function createStripeAccount({sessionToken, userAgent, ip}: RootValue, user: ParseObject): Promise {
  const privateData = user.get('privateData');

  const response = await stripe.accounts.create({
    country: 'CA',
    managed: true,
    email: privateData.get('email'),
    tos_acceptance: {
      ip,
      date: Math.floor(new Date().getTime() / 1000),
      user_agent: userAgent,
    },
    transfer_schedule: {
      interval: 'manual',
    },
  });

  privateData.set('stripeAccount', response.id);
}

export async function getStripeAccount(userId: ParseID): Promise<string> {
  const privateData = await getUserPrivateWithMasterKey(userId);
  return privateData.get('stripeAccount');
}

export async function addBankAccount(rootValue: RootValue, token: string, identityInfo: any): Promise<ParseObject> {
  const user = await getMe(rootValue);
  const privateData = user.get('privateData');
  const stripeAccount = privateData.get('stripeAccount');
  const birthday = new Date(identityInfo.birthday);
  console.log(identityInfo, token);
  const updateAccountRes = await stripe.accounts.update(
    stripeAccount, {
      legal_entity: {
        type: 'individual',
        address: {
          line1: `${identityInfo.address.streetNumber} ${identityInfo.address.route}`,
          city: identityInfo.address.city,
          state: identityInfo.address.province,
          postal_code: identityInfo.address.postalCode,
          country: 'CA',
        },
        personal_address: {
          line1: `${identityInfo.address.streetNumber} ${identityInfo.address.route}`,
          city: identityInfo.address.city,
          state: identityInfo.address.province,
          postal_code: identityInfo.address.postalCode,
          country: 'CA',
        },
        dob: {
          day: birthday.getDate(),
          month: birthday.getMonth(),
          year: birthday.getFullYear(),
        },
        first_name: identityInfo.firstName,
        last_name: identityInfo.lastName,
      },
    },
  );

  console.log(updateAccountRes);

  const response = await stripe.accounts.createExternalAccount(
    stripeAccount,
    {external_account: token},
  );

  privateData.set('bankAccount', {
    identity: identityInfo,
    stripeId: response.id,
  });

  console.log(response);

  // TODO: Transfer all pending funds when the bank account is registered.
  return await privateData.save(null, {sessionToken: rootValue.sessionToken});
}

export async function transferToBankAccount({sessionToken, userId}: RootValue, task: ParseObject): Promise {
  const applicantStripeAccount = await getStripeAccount(task.get('acceptedApplication').get('user').id);
  const charge = task.get('privateData').get('charge');
  const amount = charge.amount;
  let response;
  try {
    response = await stripe.transfers.create({
      amount,
      currency: 'cad',
      destination: 'default_for_currency',
    },
    {stripe_account: applicantStripeAccount});
    console.log(response);
  } catch (err) {
    // If there is no external account available to transfer the funds stripe
    // will return a StripeInvalidRequestError so we will ignore this case and
    // retry transferring the funds when the person has registered a bank account.
    if (err.type !== 'StripeInvalidRequestError') {
      throw err;
    }
  }
  task.get('privateData').set('transferId', response.id);
}

export async function getBankTransferState(rootValue: RootValue, taskId: ParseID): Promise {
  const task = await getTask(rootValue, taskId);
  if (!task.get('privateData') || !task.get('privateData').get('transferId')) {
    return null;
  }

  const response = await stripe.transfers.retrieve(task.get('privateData').get('transferId'));

  let state;
  switch (response.status) {
  case 'pending':
  case 'in_transit':
    state = TASK_PAYMENT_STATE.PENDING;
    break;
  case 'paid':
    state = TASK_PAYMENT_STATE.COMPLETED;
    break;
  case 'canceled':
  case 'failed':
    state = TASK_PAYMENT_STATE.FAILED;
    break;
  default:
    throw Error(`Unknown task status ${response.status}`);
  }

  return state;
}

export async function processStripeEvent(event: any): Promise {
  console.log(event);
}
