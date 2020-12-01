import { Client } from './scratch/client';
import { Project } from './scratch/project';
import { User } from './scratch/user';

export class Scratch {
  static user(username: string): Promise<User> {
    return new Client().user(username);
  }

  static project(id: number): Promise<Project> {
    return new Client().project(id);
  }
}
