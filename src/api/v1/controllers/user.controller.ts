import UserService from '@services/user.service';
import { Request, Response, NextFunction } from 'express';
// import HttpError from '@helpers/HttpError';
import HttpResponse from '@helpers/HttpResponse';

class UserController {
  private user;
  constructor() {
    this.user = new UserService();
  }
  getAll = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.user.getAll();
      HttpResponse.send(res, result);
    } catch (error) {
      next(error);
    }
  };

  create = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.user.create(req.body);
      HttpResponse.send(res, result, 201);
    } catch (error) {
      next(error);
    }
  };

  get = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.user.getOne({ id: req.params.id });
      HttpResponse.send(res, result);
    } catch (error) {
      next(error);
    }
  };

  getSlots = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.user.getSlots();
      HttpResponse.send(res, result);
    } catch (error) {
      next(error);
    }
  };

  getInterviewers = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.user.getMany({
        role: 'interviewer',
      });
      HttpResponse.send(res, result);
    } catch (error) {
      next(error);
    }
  };

  getCandidates = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.user.getMany({
        role: 'candidate',
      });

      HttpResponse.send(res, result);
    } catch (error) {
      next(error);
    }
  };

  pushSlot = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.user.addSlot(
        { id: req.body.id },
        parseInt(req.body.slot, 10),
      );
      HttpResponse.send(res, result);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
