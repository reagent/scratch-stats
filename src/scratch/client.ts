import Axios, { AxiosInstance } from 'axios';

import { UserAttributes, ProjectAttributes, MessageCount } from './types';
import { User } from './user';
import { Project } from './project';

interface Response<T> {
  body: T;
  status: number;
}

export class Client {
  baseUrl = 'https://api.scratch.mit.edu';

  constructor(private _httpAdapter?: AxiosInstance) {}

  async user(username: string): Promise<User | undefined> {
    const { body: attrs, status } = await this.get<UserAttributes>(
      `/users/${username}`
    );

    if (status === 404) {
      return;
    }

    return new User(attrs, this);
  }

  async projects(username: string): Promise<Project[]> {
    const { body: all } = await this.get<ProjectAttributes[]>(
      `/users/${username}/projects`
    );

    return all.map((attrs) => new Project(attrs, this));
  }

  async project(id: number): Promise<Project> {
    const { body: attrs } = await this.get<ProjectAttributes>(
      `/projects/${id}`
    );
    return new Project(attrs, this);
  }

  async favorites(username: string): Promise<Project[]> {
    const { body: all } = await this.get<ProjectAttributes[]>(
      `/users/${username}/favorites`
    );

    return all.map((attrs) => new Project(attrs, this));
  }

  async followers(username: string): Promise<User[]> {
    const { body: all } = await this.get<UserAttributes[]>(
      `/users/${username}/followers`
    );

    return all.map((attrs) => new User(attrs, this));
  }

  async following(username: string): Promise<User[]> {
    const { body: all } = await this.get<UserAttributes[]>(
      `/users/${username}/following`
    );

    return all.map((attrs) => new User(attrs, this));
  }

  async messageCount(username: string): Promise<number> {
    const { body } = await this.get<MessageCount>(
      `/users/${username}/messages/count`
    );

    return body.count;
  }

  private async get<T>(path: string): Promise<Response<T>> {
    // Configure 404 responses to not throw an error
    const validateStatus = (code: number): boolean => {
      return (code >= 200 && code < 300) || code === 404;
    };

    const response = await this.httpAdapter.get<T>(path, {
      baseURL: this.baseUrl,
      validateStatus,
    });

    return {
      body: response.data,
      status: response.status,
    };
  }

  private get httpAdapter(): AxiosInstance {
    if (!this._httpAdapter) {
      this._httpAdapter = Axios;
    }

    return this._httpAdapter;
  }
}
