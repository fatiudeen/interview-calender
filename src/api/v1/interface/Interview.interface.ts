import { UserInterface } from '@interface/User.Interface';

export interface InterviewInterface {
  id: string;
  interviewer: UserInterface[];
  candidate: UserInterface;
  [k: string]: any;
}
