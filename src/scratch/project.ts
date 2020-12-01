import { ProjectImages } from './types';
import { ProjectAttributes } from './types';
import { Client } from './client';

export class Project {
  id: number;
  title: string;
  description: string;
  instructions: string;

  image: string;
  images: ProjectImages;

  createdAt: Date;
  modifiedAt: Date;
  sharedAt: Date;

  views: number;
  loves: number;
  favorites: number;
  comments: number;
  remixes: number;

  parentId: number | null;
  rootId: number | null;

  constructor(attributes: ProjectAttributes, private readonly client: Client) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.description = attributes.description;
    this.instructions = attributes.instructions;

    this.image = attributes.image;
    this.images = attributes.images;

    this.createdAt = new Date(attributes.history.created);
    this.modifiedAt = new Date(attributes.history.modified);
    this.sharedAt = new Date(attributes.history.shared);

    this.views = attributes.stats.views;
    this.loves = attributes.stats.loves;
    this.favorites = attributes.stats.favorites;
    this.comments = attributes.stats.comments;
    this.remixes = attributes.stats.remixes;

    this.parentId = attributes.remix.parent;
    this.rootId = attributes.remix.root;
  }

  get url(): string {
    return `https://scratch.mit.edu/projects/${this.id}/`;
  }

  get isRemix(): boolean {
    return !!this.parentId;
  }

  parent(): Promise<Project> | undefined {
    if (!this.parentId) {
      return;
    }

    return this.client.project(this.parentId);
  }

  root(): Promise<Project> | undefined {
    if (!this.rootId) {
      return;
    }

    return this.client.project(this.rootId);
  }
}
