import { Router } from 'express';
import InterviewController from '@controllers/interview.controller';
import validator from '@middlewares/validator';
import interviewDto from '@dtos/interview.dto';

class InterviewRoutes {
  private router;
  private interviews;
  constructor() {
    this.router = Router();
    this.interviews = new InterviewController();
  }

  setupRoutes() {
    this.router
      .route('/')
      .get(this.interviews.getAll)
      .post(validator(interviewDto.create), this.interviews.scheduleInterview);
    this.router.get('/:id', validator(interviewDto.id), this.interviews.get);

    return this.router;
  }
}

export default new InterviewRoutes();
