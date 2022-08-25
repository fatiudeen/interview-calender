/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */
import { LowSync, JSONFileSync } from 'lowdb';
import _ from 'lodash';
import { UserInterface } from '@interface/User.Interface';
import { InterviewInterface } from '@interface/Interview.interface';
// import helper from './helper';

type Data = {
  users: UserInterface[];
  interviews: InterviewInterface[];
};

type Model = 'users' | 'interviews';

type DbInterface = UserInterface | InterviewInterface;

class LowWithLodash<T> extends LowSync<T> {
  chain: _.ExpChain<this['data']> = _.chain(this).get('data');
}

class Lowdb {
  private dbFile = process.env.NODE_ENV === 'test' ? 'test_db.json' : 'db.json';
  private adapter;
  private db;
  private defaultValue;
  private users: UserInterface[] = [];
  private interviews: InterviewInterface[] = [];
  private presistData;
  constructor() {
    // this.populate();
    this.defaultValue = { users: this.users, interviews: this.interviews };
    this.adapter = new JSONFileSync<Data>(this.dbFile);
    this.db = new LowWithLodash(this.adapter);
    this.db.read();
    this.presistData = this.db.data ? this.db.data : this.defaultValue;
    // eslint-disable-next-line operator-linebreak
    this.db.data =
      process.env.NODE_ENV === 'test' ? this.defaultValue : this.presistData;
    this.db.write();
  }
  // private populate() {
  //   for (let i = 0; i < 10; i++) {
  //     const data = helper.droneData();
  //     this.drones.push(data);
  //   }
  // }
  add<T extends DbInterface>(data: T): T {
    // let query;
    // if (!this.instanceOfData(data)) {
    const model = this.instanceOfData(data);
    // data = <InterviewInterface>data;
    this.db.data![model].push(<UserInterface & InterviewInterface>data);
    const query = { id: data.id };
    this.db.write();
    this.db.read();
    const array = this.db.chain.get(model) as any;
    return array.find(query).value();
    // }
    // // data = <UserInterface>data;
    // this.db.data?.users.push(<UserInterface>data);
    // query = { id: data.id };
    // this.db.write();
    // this.db.read();
    // return this.db.chain.get('users').find(query).value();
  }

  find(model: Model): any[] {
    // if (model === 'drone') {
    return this.db.chain.get(model).value();
    // }
    // return this.db.chain.get('logs').value();
  }
  findOne<T extends DbInterface>(query: Partial<T>, model: Model): T {
    const array = this.db.chain.get(model) as any;
    return array.find(query).value();
  }
  findMany<T extends DbInterface>(query: Partial<T>, model: Model) {
    const result = this.db.chain.get(model).value() as any;
    return result.filter(
      (val: any) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        Object.entries(query).every(([k, v]) => k in val && v === val[k]),
      // eslint-disable-next-line function-paren-newline
    );
  }
  update<T extends DbInterface>(
    query: Partial<T>,
    data: Partial<T>,
    model: Model,
  ): T {
    const array = this.db.chain.get(model) as any;
    const result = array.find(query).assign(data).value();
    this.db.write();
    this.db.read();
    return result;
  }
  delete<T extends DbInterface>(query: Partial<T>, model: Model): T {
    const result = this.findOne(query, model);
    this.db.chain.get(model).remove(query).value();
    this.db.write();
    this.db.read();
    return result;
  }
  // refresh() {
  //   this.db.data = this.defaultValue;
  //   this.db.write();
  //   this.db.read();
  // }
  // eslint-disable-next-line class-methods-use-this
  private instanceOfData(
    data: UserInterface | InterviewInterface,
  ): 'users' | 'interviews' {
    if ('fullname' in data) return 'users';
    return 'interviews';
  }
}

export default Lowdb;
