export interface UserInterface {
  id: string;
  fullname: string;
  role: 'interviewer' | 'candidates';
  slots: string[];
  [k: string]: any;
}
