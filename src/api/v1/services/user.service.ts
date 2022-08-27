import Lowdb from '@database';
import { UserInterface } from '@interface/User.Interface';
import _ from 'lodash';
import { nanoid } from 'nanoid';

class UserService {
  private db;
  constructor() {
    this.db = new Lowdb<UserInterface>('users');
  }

  getOne(id: Partial<UserInterface>) {
    const result = this.db.findOne(id);
    if (!result) throw new Error('cannot find user with that id');
    return result;
  }
  getAll() {
    const result = this.db.find();
    return result;
  }
  create(data: Partial<UserInterface>) {
    data.id = nanoid(10);
    data.slots = data.slots ? data.slots : [];
    data.assigned = false;
    const result = this.db.add(<UserInterface>data);
    return result;
  }
  update(id: Partial<UserInterface>, data: Partial<UserInterface>) {
    const result = this.db.update(id, data);
    return result;
  }

  getMany(data: Partial<UserInterface>) {
    const result = this.db.findMany(data);
    return result;
  }

  addSlot(id: Partial<UserInterface>, data: number) {
    const result = <UserInterface>this.getOne(id);

    if (result.role === 'candidate' && result.slots.length === 1) {
      throw new Error('cannot add more than one time slot to a canditate');
    }

    const index = _.range(24).findIndex((num) => num === data);
    if (index === -1) {
      throw new Error(
        'oops!! time slot has to be between 0 - 23 to match hours in a day',
      );
    }
    this.getOne(id);
    result.slots.push(data);
    return this.update({ id: result.id }, result);
  }

  getSlots() {
    const result = <UserInterface[]>this.getAll();
    if (result.length < 1) throw new Error('no interviewr or andidate found');
    const slot = _.range(24).map((val) => {
      return {
        [val]: result.filter((user) => {
          const number = user.slots.findIndex((num) => num === val);
          if (number !== -1) return true;
          return false;
        }),
      };
    });
    return slot;
  }
}

export default UserService;
