import { nanoid } from 'nanoid';
import Lowdb from '@database';
import { InterviewInterface } from '@interface/Interview.interface';
import { UserInterface } from '@interface/User.Interface';
import _ from 'lodash';
import UserService from '@services/user.service';

class InterviewService {
  private db;
  private userService;
  constructor() {
    this.db = new Lowdb<InterviewInterface>('interviews');
    this.userService = new UserService();
  }

  getOne(id: Partial<InterviewInterface>) {
    const result = this.db.findOne(id);
    if (!result) throw new Error('cannot find interview with that id');
    return result;
  }
  getAll() {
    const result = this.db.find();
    return result;
  }

  create(data: Partial<InterviewInterface>) {
    data.id = nanoid(10);
    const result = this.db.add(<InterviewInterface>data);
    return result;
  }
  update(id: Partial<InterviewInterface>, data: Partial<InterviewInterface>) {
    const result = this.db.update(id, data);
    return result;
  }
  pushInterviewer(id: string, data: UserInterface) {
    const result = this.getOne({ id });
    result.interviewer.push(data);
    return this.update({ id: result.id }, result);
  }
  distributeInterviewers(
    interviewers: UserInterface[],
    scheduledInterview: InterviewInterface[],
  ) {
    // const length = interviewers.length;
    scheduledInterview.forEach((val) => {
      const interviewer = interviewers.find((value) =>
        value.slots.find((index) => index === val.candidate.slots[0]),
      );
      if (interviewer) {
        this.pushInterviewer(val.candidate.id, interviewer);
        this.userService.update({ id: val.id }, { assigned: true });
        _.remove(interviewers, (arr) => {
          arr.id === interviewer.id;
        });
      }
    });
    // if (interviewers.length === length) {
    //   this.distributeInterviewers(interviewers, scheduledInterview);
    // }
  }
  schedule(data: { candidate: string; interviewer: string[] }) {
    const candidate = this.userService.getOne({ id: data.candidate });

    const interviewerNotSet: UserInterface[] = [];
    if (candidate.assigned) {
      throw new Error('the candidate has already been scheduled');
    }
    const interviewer = data.interviewer
      ?.map((val) => {
        return this.userService.getOne({ id: val });
      })
      .filter((val) => {
        const value = val.slots.find((num) => num === candidate.slots[0]);
        if (!value) interviewerNotSet.push(val);
        return value !== undefined;
      });

    const result = this.create({ candidate, interviewer });
    return {
      result,
      'the following interviewers wont be free during the interview':
        interviewerNotSet.length,
    };
  }

  autoSchedule() {
    const condidateswithoutSlot: UserInterface[] = [];
    const condidateswithoutInterviewer: UserInterface[] = [];
    const scheduledInterview: InterviewInterface[] = [];
    const candidates = this.userService
      .getMany({ role: 'candidate' })
      .filter((val: { assigned: boolean }) => {
        return val.assigned === false;
      });
    const interviewers = this.userService
      .getMany({ role: 'interviewer' })
      .filter((val: { assigned: boolean }) => {
        return val.assigned === false;
      });

    candidates.forEach((val: UserInterface) => {
      if (val.slots.length < 1) {
        condidateswithoutSlot.push(val);
      } else {
        const interviewer = interviewers.find((value: { slots: any[] }) =>
          value.slots.find((index: any) => index === val.slots[0]),
        );
        if (interviewer) {
          const interview = this.create({
            candidate: val,
            interviewer: [interviewer],
          });
          scheduledInterview.push(interview);
          this.userService.update({ id: val.id }, { assigned: true });
          _.remove(interviewers, (arr: any) => {
            arr.id === interviewer.id;
          });
        } else condidateswithoutInterviewer.push(val);
      }
    });
    this.distributeInterviewers(interviewers, scheduledInterview);

    const result = {
      'the following number of interviews has been scheduled':
        scheduledInterview.length,
      'the following number of candidates dont have slots':
        condidateswithoutSlot.length,
      'the following number of candidates do not have matching schedules with any interviewer':
        condidateswithoutInterviewer.length,
    };
    return result;
  }
}

export default new InterviewService();
