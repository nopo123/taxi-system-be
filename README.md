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

## Usage

The API documentation can be found at `http://localhost:3000/api`.

For testing, visit `http://localhost:3000/login` and log in with email `admin@admin.com` and password `pass`.