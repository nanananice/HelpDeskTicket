FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Make sure the start script has proper permissions and line endings
COPY start.sh ./start.sh
RUN chmod +x ./start.sh
# Fix potential line ending issues
RUN sed -i 's/\r$//' ./start.sh

EXPOSE 3001

# Use the start script as the entry point with correct path
CMD ["./start.sh"]