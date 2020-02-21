export class CustomError extends Error {
  status: number;

  constructor(m?: string, options?: { status: number }) {
    super(m);
    Object.setPrototypeOf(this, CustomError.prototype);

    // Allow to set a custom status code
    this.status = options.status || 500;
  }
}
