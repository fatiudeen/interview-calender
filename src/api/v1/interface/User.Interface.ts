export interface UserInterface {
  id: string;
  fullname: string;
  role: 'interviewer' | 'candidates';
  slots: number[];
  assigned: boolean;
  [k: string]: any;
}
