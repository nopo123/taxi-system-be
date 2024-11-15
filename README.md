# Taxi Management System Backend

This repository contains the backend code of a taxi management system. It is a RESTful HTTP API. It is built using NestJS and TypeORM.

## Features

- User authentication
- User roles
- CRUD operations for organizations, users and orders
- Pagination
- Filtering
- PDF generation for orders

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Docker
- Swagger

## Prerequisites

- Node.js
- npm
- Docker
- Docker Compose

## Installation

```bash
$ npm install
```

## Running the app

First, you need to create a `.env` file in the root directory of the project. You can copy the `.env.example` file and rename it to `.env`. Then fill in the necessary environment variables.

Then, you need to start the database:

```bash
$ docker-compose up
```

Start the app:

```bash
$ npm run start:dev
```

If running for the first time, you will need to create a super admin user.
Run the migration:

```bash
$ npm run typeorm:migration:run
```

The default credentials for the super admin account are:

- Email: `admin@admin.com`
- Password: `pass`

## Usage

The API documentation can be found at `http://localhost:3000/api`.