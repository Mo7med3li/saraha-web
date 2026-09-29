/**
 * Thrown when the user was created successfully but the confirmation email
 * could not be sent (e.g. Railway email-service issues).
 * The caller should still advance to the OTP step and show a warning.
 */
export class EmailNotSentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailNotSentError";
  }
}
