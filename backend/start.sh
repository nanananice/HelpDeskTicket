#!/bin/bash

# Apply database migrations
npx prisma migrate deploy

# Seed the database with initial data (using correct path)
node prisma/seed/seed.js

# Start the application
node index.js