import { ValidationError } from 'class-validator';

export class TransformationError extends Error {
  public readonly errors: ValidationError[];
  constructor(message: string, errors: ValidationError[]) {
    super(message);
    // Ensure the name property is set correctly
    this.name = this.constructor.name;
    // Capture the stack trace (excluding the constructor of this custom error class)
    Error.captureStackTrace(this, this.constructor);
    this.errors = errors;
  }
}
