import Axios, { AxiosInstance } from 'axios';
import { UserAttributes, ProjectAttributes, MessageCount } from './types';
import { User } from './user';
import { Project } from './project';

export class Client {
  baseUrl = 'https://api.scratch.mit.edu';

  constructor(private _httpAdapter?: AxiosInstance) {}

  async user(username: string): Promise<User> {
    const attrs = await this.get<UserAttributes>(`/users/${username}`);
    return new User(attrs, this);
  }

  async projects(username: string): Promise<Project[]> {
    const all = await this.get<ProjectAttributes[]>(
      `/users/${username}/projects`
    );

    return all.map((attrs) => new Project(attrs, this));
  }

  async project(id: number): Promise<Project> {
    const attrs = await this.get<ProjectAttributes>(`/projects/${id}`);
    return new Project(attrs, this);
  }

  async favorites(username: string): Promise<Project[]> {
    const all = await this.get<ProjectAttributes[]>(
      `/users/${username}/favorites`
    );

    return all.map((attrs) => new Project(attrs, this));
  }

  async followers(username: string): Promise<User[]> {
    const all = await this.get<UserAttributes[]>(
      `/users/${username}/followers`
    );

    return all.map((attrs) => new User(attrs, this));
  }

  async following(username: string): Promise<User[]> {
    const all = await this.get<UserAttributes[]>(
      `/users/${username}/following`
    );

    return all.map((attrs) => new User(attrs, this));
  }

  async messageCount(username: string): Promise<number> {
    const result = await this.get<MessageCount>(
      `/users/${username}/messages/count`
    );

    return result.count;
  }

  private async get<T>(path: string): Promise<T> {
    const response = await this.httpAdapter.get<T>(path, {
      baseURL: this.baseUrl,
    });

    return response.data;
  }

  private get httpAdapter(): AxiosInstance {
    if (!this._httpAdapter) {
      this._httpAdapter = Axios;
    }

    return this._httpAdapter;
  }
}
