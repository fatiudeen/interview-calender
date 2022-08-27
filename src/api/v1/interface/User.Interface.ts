export interface UserInterface {
  id: string;
  fullname: string;
  role: 'interviewer' | 'candidate';
  slots: number[];
  assigned: boolean;
  [k: string]: any;
}
