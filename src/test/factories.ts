import faker from 'faker';

import { ClientFake } from './helpers';

import { ProjectAttributes, UserAttributes } from '../scratch/types';
import { User } from '../scratch/user';
import { Project } from '../scratch/project';

export const userAttributes = (
  overrides: Partial<UserAttributes> = {}
): UserAttributes => {
  return {
    id: faker.random.number(),
    history: { joined: faker.date.recent().toISOString() },
    username: faker.internet.userName(),
    profile: {
      bio: faker.lorem.sentences(2),
      country: faker.address.country(),
      id: faker.random.number(),
      images: {
        '32x32': faker.internet.url(),
        '50x50': faker.internet.url(),
        '55x55': faker.internet.url(),
        '60x60': faker.internet.url(),
        '90x90': faker.internet.url(),
      },
      status: faker.lorem.word(),
    },
    scratchteam: false,
    ...overrides,
  };
};

export const user = (overrides: Partial<UserAttributes> = {}): User => {
  return new User(userAttributes(overrides), new ClientFake());
};

export const projectAttributes = (
  overrides: Partial<ProjectAttributes> = {}
): ProjectAttributes => {
  return {
    id: faker.random.number(),
    title: faker.lorem.word(),
    description: faker.lorem.words(5),
    instructions: faker.lorem.sentences(3),
    visibility: 'visible',
    public: true,
    comments_allowed: true,
    is_published: true,
    author: userAttributes(),
    image: faker.internet.url(),
    images: {
      '282x218': faker.internet.url(),
      '216x163': faker.internet.url(),
      '200x200': faker.internet.url(),
      '144x108': faker.internet.url(),
      '135x102': faker.internet.url(),
      '100x80': faker.internet.url(),
    },
    history: {
      created: faker.date.recent().toISOString(),
      modified: faker.date.recent().toISOString(),
      shared: faker.date.recent().toISOString(),
    },
    stats: {
      views: faker.random.number(),
      loves: faker.random.number(),
      favorites: faker.random.number(),
      comments: faker.random.number(),
      remixes: faker.random.number(),
    },
    remix: {
      parent: null,
      root: null,
    },
    ...overrides,
  };
};

export const project = (
  overrides: Partial<ProjectAttributes> = {}
): Project => {
  return new Project(projectAttributes(overrides), new ClientFake());
};
