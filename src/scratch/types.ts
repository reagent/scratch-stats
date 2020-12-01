type ProfileImages = {
  '90x90': string;
  '60x60': string;
  '55x55': string;
  '50x50': string;
  '32x32': string;
};

type ProfileAttributes = {
  id: number;
  images: ProfileImages;
  status: string;
  bio: string;
  country: string;
};

type UserAttributes = {
  id: number;
  username: string;
  scratchteam: boolean;
  history: {
    joined: string;
  };
  profile: ProfileAttributes;
};

type ProjectImages = {
  '282x218': string;
  '216x163': string;
  '200x200': string;
  '144x108': string;
  '135x102': string;
  '100x80': string;
};

type ProjectAttributes = {
  id: number;
  title: string;
  description: string;
  instructions: string;
  visibility: 'visible';
  public: boolean;
  comments_allowed: boolean;
  is_published: boolean;
  author: UserAttributes;
  image: string;
  images: ProjectImages;
  history: {
    created: string;
    modified: string;
    shared: string;
  };
  stats: {
    views: number;
    loves: number;
    favorites: number;
    comments: number;
    remixes: number;
  };
  remix: {
    parent: null | number;
    root: null | number;
  };
};

type MessageCount = {
  count: number;
};

export {
  ProfileImages,
  UserAttributes,
  ProjectImages,
  ProfileAttributes,
  ProjectAttributes,
  MessageCount,
};
