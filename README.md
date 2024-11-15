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

## Creating `.env` file
Copy the `.env.example` file and rename it to `.env`. Fill in the necessary environment variables.

## Running the app using Docker

```bash
$ docker-compose up
```

The default credentials for the super admin account are:

- Email: `admin@admin.com`
- Password: `pass`

## Usage

The API documentation can be found at `http://localhost:3000/api`.