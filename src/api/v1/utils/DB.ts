import { LowSync, JSONFileSync } from 'lowdb';
import _ from 'lodash';
import { UserInterface } from '@interface/User.Interface';
import { InterviewInterface } from '@interface/Interview.interface';

type Data = {
  users: UserInterface[];
  interviews: InterviewInterface[];
};

type Model = 'users' | 'interviews';

class LowWithLodash<T> extends LowSync<T> {
  chain: _.ExpChain<this['data']> = _.chain(this).get('data');
}

class Lowdb<T extends UserInterface | InterviewInterface> {
  private dbFile = process.env.NODE_ENV === 'test' ? 'test_db.json' : 'db.json';
  private adapter;
  private db;
  private defaultValue;
  private users: UserInterface[] = [];
  private interviews: InterviewInterface[] = [];
  private model;
  constructor(model: Model) {
    this.defaultValue = { users: this.users, interviews: this.interviews };
    this.adapter = new JSONFileSync<Data>(this.dbFile);
    this.db = new LowWithLodash(this.adapter);
    this.db.read();
    this.db.data = this.db.data ? this.db.data : this.defaultValue;
    this.db.write();
    this.model = model;
  }

  add(data: T): T {
    const model = this.instanceOfData(data);
    this.db.data![model].push(<UserInterface & InterviewInterface>data);
    const query = { id: data.id };
    this.db.write();
    this.db.read();
    const array = this.db.chain.get(model) as any;
    return array.find(query).value();
  }

  find(): any[] {
    return this.db.chain.get(this.model).value();
  }
  findOne(query: Partial<T>): T {
    const array = this.db.chain.get(this.model) as any;
    return array.find(query).value();
  }
  findMany(query: Partial<T>): T[] {
    const result = this.db.chain.get(this.model).value() as any;
    return result.filter((val: any) =>
      Object.entries(query).every(([k, v]) => k in val && v === val[k]),
    );
  }
  update(query: Partial<T>, data: Partial<T>): T {
    const array = this.db.chain.get(this.model) as any;
    const result = array.find(query).assign(data).value();
    this.db.write();
    this.db.read();
    return result;
  }

  delete(query: Partial<T>): T {
    const result = this.findOne(query);
    this.db.chain.get(this.model).remove(query).value();
    this.db.write();
    this.db.read();
    return result;
  }

  private instanceOfData(data: T): 'users' | 'interviews' {
    if ('fullname' in data) return 'users';
    return 'interviews';
  }
}

export default Lowdb;
