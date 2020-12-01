# Scratch Stats

A simple package to fetch project stats from the publicly available
[Scratch API][1]. This is published as a [TypeScript][2] package, but can be
used from Javascript as well.

## Installation

```
$ yarn add scratch-stats
```

## Usage

There are a couple of core resources exposed by the API that this library makes
use of: [`User`][3] and [`Project`][4]. The main entry point is the user:

```ts
import { Scratch } from 'scratch-stats';

Scratch.user('rebbel16').then((user) => {
  console.log('I am:', user.username);
});
```

It's possible to chain other queries off of this initial user:

```ts
Scratch.user('YO_GIRL_').then(async (user) => {
  console.log('I am:', user.username, '\n');

  const popularProjects = await user.projects({ order: { views: 'DESC' } });

  console.log('Here are my popular projects:\n');

  for (const project of popularProjects) {
    console.log(
      ` * ${project.title} (${project.url}, views: ${project.views})`
    );

    if (project.isRemix) {
      const parent = await project.parent()!;
      const creator = parent.author;

      console.log(
        `    ... a remix of ${parent.title}, created by: ${creator.username}`
      );
    }
  }
});
```

As well as fetching a project by ID directly:

```ts
Scratch.project(441385296).then((project) => {
  console.log('Project');
  console.log(`     Title: ${project.title}`);
  console.log(`   Created: ${project.createdAt}`);
  console.log(`Created by: ${project.author.username}`);
  console.log(`            ${project.author.url}`);
});
```

## Development

Make sure all dependencies are installed:

```
$ yarn install
```

You can test the installation by running:

```
$ yarn test
```

This package has a single external dependency ([Axios][5]) for providing HTTP
connectivity. When adding tests, follow the existing patterns for faking these
external connections.

When creating a release, ensure that the generated package contains the expected files:

```
$ yarn build && yarn pack && tar tzf scratch-stats*.tgz
```

[1]: https://en.scratch-wiki.info/wiki/Scratch_API
[2]: https://www.typescriptlang.org/
[3]: ./src/scratch/user.ts
[4]: ./src/scratch/project.ts
[5]: https://www.npmjs.com/package/axios
