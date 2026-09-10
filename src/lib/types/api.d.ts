declare type ApiResponse<T> = IErrorResponse | ISuccessResponse<T>;

declare interface IErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

declare interface ISuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}
