import { ApiSuccess } from './apiSuccess.ts';

export class CreatedResponse<T> extends ApiSuccess<T> {
  constructor(data?: T, message: string = 'Resources created successfully') {
    super(201, true, message, data);
  }
}

export class OkResponse<T> extends ApiSuccess<T> {
  constructor(data?: T, message: string = 'OK') {
    super(200, true, message, data);
  }
}
