import faker from 'faker';
import AxiosMockAdapter from 'axios-mock-adapter';

import * as factory from '../../test/factories';
import { ClientFake } from '../../test/helpers';

import { Project } from './project';
import { ProjectAttributes } from './types';

describe(`${Project.name}`, () => {
  const client = new ClientFake();

  const defaultDates: ProjectAttributes['history'] = {
    created: '1970-01-01T00:00:00Z',
    modified: '1970-01-01T00:00:00Z',
    shared: '1970-01-01T00:00:00Z',
  };

  afterEach(() => jest.restoreAllMocks());

  describe('createdAt', () => {
    it('returns the date that the project was created', () => {
      const attributes = factory.projectAttributes({
        history: { ...defaultDates, created: '2020-08-01T00:00:00Z' },
      });

      const project = new Project(attributes, client);
      expect(project.createdAt).toEqual(new Date('2020-08-01T00:00:00Z'));
    });
  });

  describe('modifiedAt', () => {
    it('returns the date that the project was modified', () => {
      const attributes = factory.projectAttributes({
        history: { ...defaultDates, modified: '2020-08-01T00:00:00Z' },
      });

      const project = new Project(attributes, client);
      expect(project.modifiedAt).toEqual(new Date('2020-08-01T00:00:00Z'));
    });
  });

  describe('sharedAt', () => {
    it('returns the date that the project was shared', () => {
      const attributes = factory.projectAttributes({
        history: { ...defaultDates, shared: '2020-08-01T00:00:00Z' },
      });

      const project = new Project(attributes, client);
      expect(project.sharedAt).toEqual(new Date('2020-08-01T00:00:00Z'));
    });
  });

  describe('url', () => {
    it('returns the full URL to the project', () => {
      const project = new Project(factory.projectAttributes({ id: 1 }), client);
      expect(project.url).toEqual('https://scratch.mit.edu/projects/1/');
    });
  });

  describe('when the project is not a remix', () => {
    let project: Project;

    beforeEach(() => {
      project = new Project(
        factory.projectAttributes({ remix: { parent: null, root: null } }),
        client
      );
    });

    describe('isRemix', () => {
      it('is false', () => {
        expect(project.isRemix).toBe(false);
      });
    });

    describe('parent()', () => {
      it('returns `undefined`', () => {
        expect(project.parent()).toBeUndefined();
      });
    });

    describe('root()', () => {
      it('returns `undefined`', () => {
        expect(project.root()).toBeUndefined();
      });
    });
  });

  describe('when the project is a remix', () => {
    let project: Project;

    const parentId = faker.random.number();
    const rootId = faker.random.number();

    beforeEach(() => {
      project = new Project(
        factory.projectAttributes({
          remix: { parent: parentId, root: rootId },
        }),
        client
      );
    });

    describe('isRemix', () => {
      it('is true', () => {
        expect(project.isRemix).toBe(true);
      });
    });

    describe('parent()', () => {
      it('returns the project specified by the ID', async () => {
        jest
          .spyOn(client, 'project')
          .mockResolvedValueOnce(factory.project({ id: parentId }));

        const parent = await project.parent();
        expect(parent!.id).toEqual(parentId);

        expect(client.project).toHaveBeenCalledWith(parentId);
      });

      it('bubbles up errors from the client', async () => {
        jest.spyOn(client, 'project').mockRejectedValueOnce(new Error());

        await expect(project.parent()).rejects.toThrow();

        expect(client.project).toHaveBeenLastCalledWith(parentId);
      });
    });

    describe('root()', () => {
      it('returns the project specified by the ID', async () => {
        jest
          .spyOn(client, 'project')
          .mockResolvedValueOnce(factory.project({ id: rootId }));

        const root = await project.root();
        expect(root!.id).toEqual(rootId);

        expect(client.project).toHaveBeenLastCalledWith(rootId);
      });

      it('bubbles up errors from the client', async () => {
        jest.spyOn(client, 'project').mockRejectedValueOnce(new Error());

        await expect(project.root()).rejects.toThrow();

        expect(client.project).toHaveBeenLastCalledWith(rootId);
      });
    });
  });
});
