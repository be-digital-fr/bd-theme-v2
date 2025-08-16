export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export class Result<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: AppError;

  private constructor(success: boolean, data?: T, error?: AppError) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success<T>(data: T): Result<T> {
    return new Result<T>(true, data);
  }

  static failure<T>(error: AppError): Result<T> {
    return new Result<T>(false, undefined, error);
  }

  static isSuccess<T>(result: Result<T>): result is Result<T> & { success: true; data: T } {
    return result.success;
  }

  static isFailure<T>(result: Result<T>): result is Result<T> & { success: false; error: AppError } {
    return !result.success;
  }
}