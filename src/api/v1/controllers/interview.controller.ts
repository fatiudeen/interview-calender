import InterviewService from '@services/interview.services';
import { Request, Response, NextFunction } from 'express';
import HttpResponse from '@helpers/HttpResponse';

class InterviewController {
  private interview;
  constructor() {
    this.interview = InterviewService;
  }
  getAll = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.interview.getAll();
      HttpResponse.send(res, result);
    } catch (error) {
      next(error);
    }
  };

  get = (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.interview.getOne({ id: req.params.id });
      HttpResponse.send(res, result);
    } catch (error) {
      next(error);
    }
  };

  scheduleInterview = (req: Request, res: Response, next: NextFunction) => {
    try {
      let result;
      if (Object.values(req.body).length < 1) {
        result = this.interview.autoSchedule();
      } else {
        result = this.interview.schedule({
          candidate: req.body.candidate,
          interviewer: req.body.interviewers,
        });
      }

      HttpResponse.send(res, result, 201);
    } catch (error) {
      next(error);
    }
  };
}

export default InterviewController;
