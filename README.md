# Help Desk Ticket System

A full-stack application for managing help desk tickets. This application enables users to create support tickets and administrators to manage and update ticket statuses.

## Features

- User authentication (login, register, password reset)
- Role-based access control (admin and regular users)
- Create new support tickets
- View ticket list with filtering and sorting options
- Update ticket status (admins) or details (users)

## Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication

### DevOps
- Docker & Docker Compose
- Nginx

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

### Installation and Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd HelpDeskTicket
   ```

2. Running with Docker (recommended)
   ```
   docker-compose up -d
   ```
   This will start the frontend, backend, and PostgreSQL database.
   - Frontend will be available at: http://localhost:80
   - Backend API will be available at: http://localhost:3001

3. Manual setup (without Docker)

   Backend:
   ```
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   node prisma/seed/seed.js
   npm start
   ```

   Frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

### Default Users

The system is seeded with the following test users:

1. Admin User:
   - Email: admin@example.com
   - Password: testadmin

2. Regular User:
   - Email: user@example.com
   - Password: testuser

3. Second Regular User:
   - Email: user1@example.com
   - Password: testuser1

## Usage

### User Workflows

1. **Regular Users**:
   - Create new tickets
   - View their own tickets
   - Edit ticket details (title and description)

2. **Administrators**:
   - View all tickets in the system
   - Update ticket statuses (Pending, Accepted, Resolved, Rejected)
   - Cannot modify ticket content

### Ticket Management

- **Creating Tickets**: Users can create tickets by clicking the "Add New Ticket" button
- **Filtering**: Filter tickets by status
- **Sorting**: Sort tickets by status, creation date, update date, or title
- **Editing**: Click on a ticket to open the edit dialog
