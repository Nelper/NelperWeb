/**
 * The task states enum.
 * @readonly
 * @enum {number}
 */
export const TASK_STATE = {
  /** The task has been created and is waiting for the poster to accept an applicant */
  PENDING: 0,
  /** The task has an accepted applicant and is waiting to be completed. */
  ACCEPTED: 1,
  /** The task has been deleted by the poster */
  DELETED: 2,
  /** The task has been completed */
  COMPLETED: 3,
};

 /**
  * The application states enum.
  * @readonly
  * @enum {number}
  */
export const TASK_APPLICATION_STATE = {
  /**
   * The application has been created and is waiting for a
   * response from the task poster
   */
  PENDING: 0,
  /** The applicant canceled his application */
  CANCELED: 1,
  /** The application has been accepted by the task poster */
  ACCEPTED: 2,
  /** The application has been denied by the task poster */
  DENIED: 3,
};

export const TASK_COMPLETION_STATE = {
  ACCEPTED: 0,
  PAYMENT_SENT: 1,
  COMPLETED: 2,
  PAYMENT_REQUESTED: 3,
  RATED: 4,
};

export const MIN_PRICE = 10;
export const MAX_PRICE = 200;
export const MIN_TITLE_LENGTH = 4;
export const MIN_DESC_LENGTH = 4;
