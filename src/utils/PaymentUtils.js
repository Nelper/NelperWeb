import {Parse} from 'parse';

export default class PaymentUtils {
  static load() {
    return new Promise((resolve) => {
      if (window.Stripe) {
        setTimeout(() => resolve(window.Stripe), 0);
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://js.stripe.com/v2/';
      script.addEventListener('load', () => {
        window.Stripe.setPublishableKey('pk_test_gYIk5RNw7X2LCS4501jd4HpE');
        resolve(window.Stripe);
      });
      document.body.appendChild(script);
    });
  }

  static get() {
    return window.Stripe;
  }

  static createCharge(task, token) {
    return Parse.Cloud.run('createCharge', {taskId: task.objectId, token: token})
      .then((res) => {
        console.log(res);
      })
      .fail((err) => console.log(err));
  }
}
