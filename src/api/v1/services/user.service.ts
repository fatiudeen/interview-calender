/* eslint-disable no-param-reassign */
import { nanoid } from 'nanoid';
import Lowdb from '@database';
import { UserInterface } from '@interface/User.Interface';

class UserService {
  private db;
  // eslint-disable-next-line lines-between-class-members
  constructor() {
    this.db = new Lowdb<UserInterface>('users');
  }

  getOne(id: Partial<UserInterface>) {
    const result = this.db.findOne(id);
    return result;
  }
  getAll() {
    const result = this.db.find();
    return result;
  }
  create(data: Partial<UserInterface>) {
    data.id = nanoid(10);
    data.slots = [];
    const result = this.db.add(<UserInterface>data);
    return result;
  }
  addSlot(id: Partial<UserInterface>, data: string) {
    const result = this.db.pushSlot(id, data);
    return result;
  }
}

export default UserService;
