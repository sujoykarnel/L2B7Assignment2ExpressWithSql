# Issue Tracker Backend Server

A role-based Issue Tracking REST API built with Express.js, TypeScript, PostgreSQL, and JWT Authentication.

## Features

- Authentication (JWT)
- Role-based Authorization (Maintainer / Contributor)
- Issue CRUD
- Workflow Status Management
- PostgreSQL Database

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT
- bcryptjs

## User Roles

- contributor: manage own issues
- maintainer: manage all issues + metrics

## API Endpoints

### Auth

- POST /api/auth/signup
- POST /api/auth/login

### Issues

- POST /api/issues
- GET /api/issues
- GET /api/issues/:id (Get single issue)
- PATCH /api/issues/:id
- PATCH /api/issues/:id/status (Maintainer only)
- DELETE /api/issues/:id (Maintainer only)

## Issue Types

- bug
- feature_request

## Issue Status

- open
- in_progress
- resolved

## Environment Variables

- PORT=5000
- DATABASE_URL=your_db_url
- JWT_SECRET=your_secret

