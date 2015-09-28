/**
 * Authentication error. The action requires the user to be logged.
 */
export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

/**
 * Invalid operation. The user cannot perform this action.
 */
export class InvalidOperationError extends Error {
  constructor() {
    super('Invalid operation');
    this.name = 'InvalidOperationError';
  }
}
