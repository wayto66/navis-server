# Task Management Server

This is a NestJS-based server application for managing tasks and projects.

## Features

- Create, read, update, and delete tasks
- Search and filter tasks
- Manage task priorities and statuses
- Handle task dependencies
- Project management
- Notification system (WhatsApp integration)

## Tech Stack

- NestJS
- Prisma ORM
- Jest for testing
- Axios for HTTP requests

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your environment variables in a `.env` file:
   ```
   DATABASE_URL=your_database_url
   TERA_URL=your_tera_url_for_whatsapp
   ```
4. Run database migrations:
   ```
   npx prisma migrate dev
   ```
5. Start the server:
   ```
   npm run start:dev
   ```

## API Endpoints

- `POST /tasks`: Create a new task
- `GET /tasks`: Get all tasks
- `GET /tasks/:id`: Get a specific task
- `PATCH /tasks/:id`: Update a task
- `DELETE /tasks/:id`: Delete a task
- `POST /tasks/search`: Search for tasks

## Testing

1. Set up your testing environment variables in a `.env.test` file:

   ```
   DATABASE_URL=your_testing_database_url
   ```

2. Run the test suite with:

   ```
   npm test
   ```

#   n a v i s - s e r v e r  
 