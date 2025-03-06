FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Copy and make the start script executable
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3001

# Use the start script as the entry point
CMD ["/start.sh"]