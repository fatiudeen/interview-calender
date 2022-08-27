import express, { Application } from 'express';
import cors from 'cors';
import logger from 'morgan';
import interviewRoute from '@routes/interview.route';
import userRoute from '@routes/user.route';
import error404 from '@middlewares/404handler';
import { errorHandler } from '@middlewares/errorHandler';
import docs from '@middlewares/docs';

class App {
  private app: Application;
  constructor() {
    this.app = express();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandlers();
  }

  private initRoutes() {
    this.app.use('/api/v1/interviews', interviewRoute.setupRoutes());
    this.app.use('/api/v1/users', userRoute.setupRoutes());
    this.app.use('/docs', docs);
    this.app.get('/', (req, res) => {
      res.status(200).json({ message: 'WELCOME TO THE INTERVIEW CALENDAR :)' });
    });
  }
  private initMiddlewares() {
    this.app.use(
      cors({
        origin: ['*'],
      }),
    );
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(logger('dev'));
    this.app.use(express.json());
  }

  private initErrorHandlers() {
    this.app.use(errorHandler);
    this.app.use('*', error404);
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`running on port ${port}`);
    });
  }

  public instance() {
    return this.app;
  }
}

export default new App();
