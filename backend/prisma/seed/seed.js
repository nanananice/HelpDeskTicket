import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create ticket statuses if they don't exist
  const statuses = [
    { id: 1, name: 'PENDING' },
    { id: 2, name: 'ACCEPTED' },
    { id: 3, name: 'RESOLVED' },
    { id: 4, name: 'REJECTED' }
  ];

  console.log('Seeding status data...');
  
  for (const status of statuses) {
    await prisma.ticketStatus.upsert({
      where: { id: status.id },
      update: {},
      create: status
    });
  }
  
  console.log('Status data seeded successfully!');

  // Create roles if they don't exist
  const roles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'USER' }
  ];

  console.log('Seeding role data...');
  
  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role
    });
  }
  
  console.log('Role data seeded successfully!');

  // Create users if they don't exist
  const users = [
    { 
      id: 1, 
      username: 'testadmin', 
      password: await bcrypt.hash('testadmin', 10),
      email: 'admin@example.com',
      roleId: 1 // ADMIN role
    },
    { 
      id: 2, 
      username: 'testuser', 
      password: await bcrypt.hash('testuser', 10),
      email: 'user@example.com',
      roleId: 2 // USER role
    },
    { 
      id: 3, 
      username: 'testuser1', 
      password: await bcrypt.hash('testuser1', 10),
      email: 'user1@example.com',
      roleId: 2 // USER role
    }
  ];

  console.log('Seeding user data...');
  
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user
    });
  }
  
  console.log('User data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });