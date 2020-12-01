import faker from 'faker';

import * as factory from '../../test/factories';
import { ClientFake } from '../../test/helpers';

import { User } from './user';
import { ProjectAttributes } from './types';

describe(`${User.name}`, () => {
  const client = new ClientFake();

  afterEach(() => jest.restoreAllMocks());

  describe('url', () => {
    it("returns the URL to the user's profile", () => {
      const user = new User(
        factory.userAttributes({ username: 'username' }),
        client
      );

      expect(user.url).toEqual('https://scratch.mit.edu/users/username/');
    });
  });

  describe('projects()', () => {
    const username = 'rebbel16';

    const history: ProjectAttributes['history'] = {
      created: faker.date.recent().toISOString(),
      modified: faker.date.recent().toISOString(),
      shared: faker.date.recent().toISOString(),
    };

    const stats: ProjectAttributes['stats'] = {
      views: 0,
      comments: 0,
      favorites: 0,
      loves: 0,
      remixes: 0,
    };

    it('returns projects for the user', async () => {
      jest
        .spyOn(client, 'projects')
        .mockResolvedValueOnce([
          factory.project({ id: 1 }),
          factory.project({ id: 2 }),
        ]);

      const user = new User(factory.userAttributes({ username }), client);
      const projects = await user.projects();

      expect(projects.map((p) => p.id)).toEqual([1, 2]);

      expect(client.projects).toHaveBeenLastCalledWith(username);
    });

    it('bubbles up errors from the client', async () => {
      jest.spyOn(client, 'projects').mockRejectedValueOnce(new Error());

      const user = new User(factory.userAttributes({ username }), client);

      await expect(user.projects()).rejects.toThrow();
    });

    describe('when sorting by creation date', () => {
      let user: User;

      beforeEach(() => {
        jest.spyOn(client, 'projects').mockResolvedValueOnce([
          factory.project({
            id: 1,
            history: { ...history, created: '2020-08-01T01:00:00Z' },
          }),
          factory.project({
            id: 2,
            history: { ...history, created: '2020-08-01T03:00:00Z' },
          }),
          factory.project({
            id: 3,
            history: { ...history, created: '2020-08-01T02:00:00Z' },
          }),
        ]);

        user = new User(factory.userAttributes({ username }), client);
      });

      it('can sort in ascending order', async () => {
        const projects = await user.projects({ order: { createdAt: 'ASC' } });
        expect(projects.map((p) => p.id)).toEqual([1, 3, 2]);
      });

      it('can sort in descending order', async () => {
        const projects = await user.projects({ order: { createdAt: 'DESC' } });
        expect(projects.map((p) => p.id)).toEqual([2, 3, 1]);
      });
    });

    describe('when sorting by modified date', () => {
      let user: User;

      beforeEach(() => {
        jest.spyOn(client, 'projects').mockResolvedValueOnce([
          factory.project({
            id: 1,
            history: { ...history, modified: '2020-08-01T01:00:00Z' },
          }),
          factory.project({
            id: 2,
            history: { ...history, modified: '2020-08-01T03:00:00Z' },
          }),
          factory.project({
            id: 3,
            history: { ...history, modified: '2020-08-01T02:00:00Z' },
          }),
        ]);

        user = new User(factory.userAttributes({ username }), client);
      });

      it('can sort in ascending order', async () => {
        const projects = await user.projects({ order: { modifiedAt: 'ASC' } });
        expect(projects.map((p) => p.id)).toEqual([1, 3, 2]);
      });

      it('can sort in descending order', async () => {
        const projects = await user.projects({ order: { modifiedAt: 'DESC' } });
        expect(projects.map((p) => p.id)).toEqual([2, 3, 1]);
      });
    });

    describe('when sorting by shared date', () => {
      let user: User;

      beforeEach(() => {
        jest.spyOn(client, 'projects').mockResolvedValueOnce([
          factory.project({
            id: 1,
            history: { ...history, shared: '2020-08-01T01:00:00Z' },
          }),
          factory.project({
            id: 2,
            history: { ...history, shared: '2020-08-01T03:00:00Z' },
          }),
          factory.project({
            id: 3,
            history: { ...history, shared: '2020-08-01T02:00:00Z' },
          }),
        ]);

        user = new User(factory.userAttributes({ username }), client);
      });

      it('can sort in ascending order', async () => {
        const projects = await user.projects({ order: { sharedAt: 'ASC' } });
        expect(projects.map((p) => p.id)).toEqual([1, 3, 2]);
      });

      it('can sort in descending order', async () => {
        const projects = await user.projects({ order: { sharedAt: 'DESC' } });
        expect(projects.map((p) => p.id)).toEqual([2, 3, 1]);
      });
    });

    describe('when sorting by view count', () => {
      let user: User;

      beforeEach(() => {
        jest.spyOn(client, 'projects').mockResolvedValueOnce([
          factory.project({
            id: 1,
            stats: { ...stats, views: 1 },
          }),
          factory.project({
            id: 2,
            stats: { ...stats, views: 3 },
          }),
          factory.project({
            id: 3,
            stats: { ...stats, views: 2 },
          }),
        ]);

        user = new User(factory.userAttributes({ username }), client);
      });

      it('can sort in ascending order', async () => {
        const projects = await user.projects({ order: { views: 'ASC' } });
        expect(projects.map((p) => p.id)).toEqual([1, 3, 2]);
      });

      it('can sort in descending order', async () => {
        const projects = await user.projects({ order: { views: 'DESC' } });
        expect(projects.map((p) => p.id)).toEqual([2, 3, 1]);
      });
    });

    describe('when sorting by loves count', () => {
      let user: User;

      beforeEach(() => {
        jest.spyOn(client, 'projects').mockResolvedValueOnce([
          factory.project({
            id: 1,
            stats: { ...stats, loves: 1 },
          }),
          factory.project({
            id: 2,
            stats: { ...stats, loves: 3 },
          }),
          factory.project({
            id: 3,
            stats: { ...stats, loves: 2 },
          }),
        ]);

        user = new User(factory.userAttributes({ username }), client);
      });

      it('can sort in ascending order', async () => {
        const projects = await user.projects({ order: { loves: 'ASC' } });
        expect(projects.map((p) => p.id)).toEqual([1, 3, 2]);
      });

      it('can sort in descending order', async () => {
        const projects = await user.projects({ order: { loves: 'DESC' } });
        expect(projects.map((p) => p.id)).toEqual([2, 3, 1]);
      });
    });

    describe('when sorting by favorites count', () => {
      let user: User;

      beforeEach(() => {
        jest.spyOn(client, 'projects').mockResolvedValueOnce([
          factory.project({
            id: 1,
            stats: { ...stats, favorites: 1 },
          }),
          factory.project({
            id: 2,
            stats: { ...stats, favorites: 3 },
          }),
          factory.project({
            id: 3,
            stats: { ...stats, favorites: 2 },
          }),
        ]);

        user = new User(factory.userAttributes({ username }), client);
      });

      it('can sort in ascending order', async () => {
        const projects = await user.projects({ order: { favorites: 'ASC' } });
        expect(projects.map((p) => p.id)).toEqual([1, 3, 2]);
      });

      it('can sort in descending order', async () => {
        const projects = await user.projects({ order: { favorites: 'DESC' } });
        expect(projects.map((p) => p.id)).toEqual([2, 3, 1]);
      });
    });

    describe('when sorting by comment count', () => {
      let user: User;

      beforeEach(() => {
        jest.spyOn(client, 'projects').mockResolvedValueOnce([
          factory.project({
            id: 1,
            stats: { ...stats, comments: 1 },
          }),
          factory.project({
            id: 2,
            stats: { ...stats, comments: 3 },
          }),
          factory.project({
            id: 3,
            stats: { ...stats, comments: 2 },
          }),
        ]);

        user = new User(factory.userAttributes({ username }), client);
      });

      it('can sort in ascending order', async () => {
        const projects = await user.projects({ order: { comments: 'ASC' } });
        expect(projects.map((p) => p.id)).toEqual([1, 3, 2]);
      });

      it('can sort in descending order', async () => {
        const projects = await user.projects({ order: { comments: 'DESC' } });
        expect(projects.map((p) => p.id)).toEqual([2, 3, 1]);
      });
    });

    describe('when sorting by remixed count', () => {
      let user: User;

      beforeEach(() => {
        jest.spyOn(client, 'projects').mockResolvedValueOnce([
          factory.project({
            id: 1,
            stats: { ...stats, remixes: 1 },
          }),
          factory.project({
            id: 2,
            stats: { ...stats, remixes: 3 },
          }),
          factory.project({
            id: 3,
            stats: { ...stats, remixes: 2 },
          }),
        ]);

        user = new User(factory.userAttributes({ username }), client);
      });

      it('can sort in ascending order', async () => {
        const projects = await user.projects({ order: { remixes: 'ASC' } });
        expect(projects.map((p) => p.id)).toEqual([1, 3, 2]);
      });

      it('can sort in descending order', async () => {
        const projects = await user.projects({ order: { remixes: 'DESC' } });
        expect(projects.map((p) => p.id)).toEqual([2, 3, 1]);
      });
    });
  });

  describe('favorites()', () => {
    const username = 'rebbel16';

    it('returns a list of favorites', async () => {
      jest
        .spyOn(client, 'favorites')
        .mockResolvedValueOnce([
          factory.project({ id: 1 }),
          factory.project({ id: 2 }),
        ]);

      const user = new User(factory.userAttributes({ username }), client);
      const favorites = await user.favorites();

      expect(favorites.map((f) => f.id)).toEqual([1, 2]);

      expect(client.favorites).toHaveBeenLastCalledWith(username);
    });

    it('bubbles up errors from the client', async () => {
      jest.spyOn(client, 'favorites').mockRejectedValueOnce(new Error());

      const user = new User(factory.userAttributes({ username }), client);

      await expect(user.favorites()).rejects.toThrow();
    });
  });

  describe('following()', () => {
    const username = 'YO_GIRL_';

    it('returns a list of users that this user is following', async () => {
      jest
        .spyOn(client, 'following')
        .mockResolvedValueOnce([
          factory.user({ id: 1 }),
          factory.user({ id: 2 }),
        ]);

      const user = new User(factory.userAttributes({ username }), client);
      const following = await user.following();

      expect(following.map((f) => f.id)).toEqual([1, 2]);

      expect(client.following).toHaveBeenLastCalledWith(username);
    });

    it('bubbles up errors from the client', async () => {
      jest.spyOn(client, 'following').mockRejectedValueOnce(new Error());

      const user = new User(factory.userAttributes({ username }), client);

      await expect(user.following()).rejects.toThrow();
    });
  });

  describe('followers()', () => {
    const username = 'dizzly_bear';

    it('returns a list of users that follow this user', async () => {
      jest
        .spyOn(client, 'followers')
        .mockResolvedValueOnce([
          factory.user({ id: 1 }),
          factory.user({ id: 2 }),
        ]);

      const user = new User(factory.userAttributes({ username }), client);
      const followers = await user.followers();

      expect(followers.map((f) => f.id)).toEqual([1, 2]);

      expect(client.followers).toHaveBeenLastCalledWith(username);
    });

    it('bubbles up errors from the client', async () => {
      jest.spyOn(client, 'followers').mockRejectedValueOnce(new Error());

      const user = new User(factory.userAttributes({ username }), client);

      await expect(user.followers()).rejects.toThrow();
    });
  });

  describe('messageCount()', () => {
    const username = 'rebbel16';

    it('returns the count of unread messages for this user', async () => {
      jest.spyOn(client, 'messageCount').mockResolvedValueOnce(1);

      const user = new User(factory.userAttributes({ username }), client);
      const count = await user.messageCount();

      expect(count).toEqual(1);

      expect(client.messageCount).toHaveBeenLastCalledWith(username);
    });

    it('bubbles up errors from the client', async () => {
      jest.spyOn(client, 'messageCount').mockRejectedValueOnce(new Error());

      const user = new User(factory.userAttributes({ username }), client);

      await expect(user.messageCount()).rejects.toThrow();
    });
  });
});
