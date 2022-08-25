import { Response } from 'express';

export default class HttpResponse {
  static send(res: Response, data: object, status = 200) {
    res.status(status);
    return res.json({
      success: true,
      message: 'OK',
      data,
    });
  }
}
