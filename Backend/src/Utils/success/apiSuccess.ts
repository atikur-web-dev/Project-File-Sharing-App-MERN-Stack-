export class ApiSuccess<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | undefined;

  constructor(statusCode: number, success: boolean, message: string, data?: T) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
