import { Client } from './client';
import { UserAttributes } from './types';
import { Project } from './project';
import { ProfileImages } from './types';

type OrderDirection = 'ASC' | 'DESC';

type DateOrderAttribute = 'createdAt' | 'modifiedAt' | 'sharedAt';

type DateOrderOptions =
  | { createdAt: OrderDirection }
  | { modifiedAt: OrderDirection }
  | { sharedAt: OrderDirection };

type CountOrderAttribute =
  | 'views'
  | 'loves'
  | 'favorites'
  | 'comments'
  | 'remixes';

type CountOrderOptions =
  | { views: OrderDirection }
  | { loves: OrderDirection }
  | { favorites: OrderDirection }
  | { comments: OrderDirection }
  | { remixes: OrderDirection };

type OrderAttribute = DateOrderAttribute | CountOrderAttribute;
type OrderOptions = DateOrderOptions | CountOrderOptions;

type ProjectSortFunction = (a: Project, b: Project) => number;

const sortOn = (order: OrderOptions): ProjectSortFunction => {
  const [key] = Object.keys(order) as OrderAttribute[];
  const [direction] = Object.values(order) as OrderDirection[];

  return (a: Project, b: Project): number => {
    const modifier = direction === 'ASC' ? 1 : -1;
    const sort = Number(a[key]) - Number(b[key]);

    return modifier * sort;
  };
};

export class User {
  id: number;
  username: string;
  joinedAt: Date;
  status: string;
  images: ProfileImages;
  bio: string;
  country: string;

  constructor(attributes: UserAttributes, private readonly client: Client) {
    this.id = attributes.id;
    this.username = attributes.username;
    this.joinedAt = new Date(attributes.history.joined);
    this.images = attributes.profile.images;
    this.status = attributes.profile.status;
    this.bio = attributes.profile.bio;
    this.country = attributes.profile.country;
  }

  get url(): string {
    return `https://scratch.mit.edu/users/${this.username}/`;
  }

  async projects(options?: { order: OrderOptions }): Promise<Project[]> {
    const projects = await this.client.projects(this.username);

    if (!options?.order) {
      return projects;
    }

    return projects.sort(sortOn(options.order));
  }

  favorites(): Promise<Project[]> {
    return this.client.favorites(this.username);
  }

  following(): Promise<User[]> {
    return this.client.following(this.username);
  }

  followers(): Promise<User[]> {
    return this.client.followers(this.username);
  }

  messageCount(): Promise<number> {
    return this.client.messageCount(this.username);
  }
}
