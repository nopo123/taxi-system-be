## Installation

```bash
$ npm install
```

## Running the app

First start the database using docker-compose:

```bash
$ docker-compose up
```

Then start the app:

```bash
$ npm run start:dev
```

If running for the first time, you will need to create a super admin user.
Run the migration:

```bash
$ npm run typeorm:migration:run
```