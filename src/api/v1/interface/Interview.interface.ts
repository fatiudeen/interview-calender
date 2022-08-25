import { UserInterface } from '@interface/User.Interface';

export interface InterviewInterface {
  id: string;
  interviewer: UserInterface[];
  candidates: UserInterface;
  [k: string]: any;
}
