import faker from 'faker';
import Axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import * as factory from '../../test/factories';

import { Client } from './client';
import { User } from './user';
import { Project } from './project';
import { MessageCount, ProjectAttributes, UserAttributes } from './types';

describe(`${Client.name}`, () => {
  const baseUri = 'https://api.scratch.mit.edu';

  let httpMock: AxiosMockAdapter;
  let client: Client;

  beforeEach(() => {
    const axios = Axios.create();

    httpMock = new AxiosMockAdapter(axios);
    client = new Client(axios);
  });

  afterEach(() => httpMock.resetHandlers());

  describe('user()', () => {
    const username = `rebbel16`;

    it('returns the data for the specified username', async () => {
      const id = faker.random.number();

      httpMock
        .onGet(`${baseUri}/users/${username}`)
        .reply<UserAttributes>(200, factory.userAttributes({ id, username }));

      const user = await client.user(username);

      expect(user).toBeInstanceOf(User);
      expect(user!.id).toEqual(id);
    });

    it('returns `undefined` when the user does not exist', async () => {
      httpMock.onGet(`${baseUri}/users/${username}`).reply(404);

      const user = await client.user(username);

      expect(user).toBeUndefined();
    });

    it('throws an error when the service returns a non-successful HTTP response', async () => {
      httpMock.onGet(`${baseUri}/users/${username}`).reply(500);

      await expect(client.user(username)).rejects.toThrow(
        'Request failed with status code 500'
      );
    });
  });

  describe('projects()', () => {
    const username = 'dizzly_bear';

    it('returns projects belonging to the specified user', async () => {
      httpMock
        .onGet(`${baseUri}/users/${username}/projects`)
        .reply<ProjectAttributes[]>(200, [
          factory.projectAttributes({ id: 1 }),
        ]);

      const projects = await client.projects(username);

      expect(projects).toHaveLength(1);
      expect(projects[0]).toBeInstanceOf(Project);
      expect(projects[0].id).toEqual(1);
    });

    it('throws an error when the service returns a non-successful HTTP response', async () => {
      httpMock.onGet(`${baseUri}/users/${username}/projects`).reply(500);

      await expect(client.projects(username)).rejects.toThrow(
        'Request failed with status code 500'
      );
    });
  });

  describe('project()', () => {
    const id = faker.random.number();

    it('returns the project for the specified id', async () => {
      httpMock
        .onGet(`${baseUri}/projects/${id}`)
        .reply<ProjectAttributes>(200, factory.projectAttributes({ id }));

      const project = await client.project(id);

      expect(project).toBeInstanceOf(Project);
      expect(project.id).toEqual(id);
    });

    it('throws an error when the service returns a non-successful HTTP response', async () => {
      httpMock.onGet(`${baseUri}/projects/${id}`).reply(500);

      await expect(client.project(id)).rejects.toThrow(
        'Request failed with status code 500'
      );
    });
  });

  describe('favorites()', () => {
    const username = 'YO_GIRL_';

    it('returns the favorite projects for the specified user', async () => {
      httpMock
        .onGet(`${baseUri}/users/${username}/favorites`)
        .reply<ProjectAttributes[]>(200, [
          factory.projectAttributes({ id: 1 }),
        ]);

      const projects = await client.favorites(username);

      expect(projects).toHaveLength(1);
      expect(projects[0]).toBeInstanceOf(Project);
      expect(projects[0].id).toEqual(1);
    });

    it('throws an error when the service returns a non-successful HTTP response', async () => {
      httpMock.onGet(`${baseUri}/users/${username}/favorites`).reply(500);

      await expect(client.favorites(username)).rejects.toThrow(
        'Request failed with status code 500'
      );
    });
  });

  describe('followers()', () => {
    const username = 'dizzly_bear';

    it('returns the followers of the specified user', async () => {
      httpMock
        .onGet(`${baseUri}/users/${username}/followers`)
        .reply<UserAttributes[]>(200, [factory.userAttributes({ id: 1 })]);

      const followers = await client.followers(username);

      expect(followers).toHaveLength(1);
      expect(followers[0]).toBeInstanceOf(User);
      expect(followers[0].id).toEqual(1);
    });

    it('throws an error when the service returns a non-successful HTTP response', async () => {
      httpMock.onGet(`${baseUri}/users/${username}/followers`).reply(500);

      await expect(client.followers(username)).rejects.toThrow(
        'Request failed with status code 500'
      );
    });
  });

  describe('following()', () => {
    const username = 'rebbel16';

    it('returns the list of users that this user follows', async () => {
      httpMock
        .onGet(`${baseUri}/users/${username}/following`)
        .reply<UserAttributes[]>(200, [factory.userAttributes({ id: 1 })]);

      const following = await client.following(username);

      expect(following).toHaveLength(1);
      expect(following[0]).toBeInstanceOf(User);
      expect(following[0].id).toEqual(1);
    });

    it('throws an error when the service returns a non-successful HTTP response', async () => {
      httpMock.onGet(`${baseUri}/users/${username}/following`).reply(500);

      await expect(client.following(username)).rejects.toThrow(
        'Request failed with status code 500'
      );
    });
  });

  describe('messageCount()', () => {
    const username = 'YO_GIRL_';

    it('returns the count of unread messages for this user', async () => {
      httpMock
        .onGet(`${baseUri}/users/${username}/messages/count`)
        .reply<MessageCount>(200, { count: 100 });

      const count = await client.messageCount(username);

      expect(count).toEqual(100);
    });

    it('throws an error when the service returns a non-successful HTTP response', async () => {
      httpMock.onGet(`${baseUri}/users/${username}/messages/count`).reply(500);

      await expect(client.messageCount(username)).rejects.toThrow(
        'Request failed with status code 500'
      );
    });
  });
});
