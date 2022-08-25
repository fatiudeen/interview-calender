export default class HttpError extends Error {
  statusCode: number;
  // eslint-disable-next-line lines-between-class-members
  data: object | null;

  constructor(message: string, statusCode?: number, data?: object) {
    super(message);
    this.statusCode = statusCode === undefined ? 500 : statusCode;
    this.data = data === undefined ? null : data;
  }
}
