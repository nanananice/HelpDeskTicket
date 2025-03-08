#!/bin/bash

# Reinstall bcrypt in the container environment
npm rebuild bcrypt --build-from-source

# Apply database migrations
npx prisma migrate deploy

# Seed the database with initial data
node prisma/seed/seed.js

# Start the application
node index.js