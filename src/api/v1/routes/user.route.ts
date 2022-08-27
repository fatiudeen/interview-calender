import { Router } from 'express';
import UserController from '@controllers/user.controller';
import validator from '@middlewares/validator';
import userDto from '@dtos/user.dto';

class UserRoutes {
  private router;
  private users;
  constructor() {
    this.router = Router();
    this.users = new UserController();
  }

  setupRoutes() {
    this.router
      .route('/')
      .get(this.users.getAll)
      .post(validator(userDto.create), this.users.create)
      .put(validator(userDto.addSlot), this.users.pushSlot);
    this.router.get('/slots', this.users.getSlots);
    this.router.get('/interviewers', this.users.getInterviewers);
    this.router.get('/candidates', this.users.getCandidates);
    this.router.get('/:id', validator(userDto.id), this.users.get);
    return this.router;
  }
}

export default new UserRoutes();
