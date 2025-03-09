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

  // Create tickets for test users
  console.log('Seeding ticket data...');
  
  // Tickets for testuser (userId: 2)
  const testUserTickets = [
    {
      title: 'Email not working',
      description: 'I cannot access my company email since this morning',
      userId: 2,
      statusId: 1, // PENDING
      createdById: 2,
      updatedById: 2
    },
    {
      title: 'Printer offline',
      description: 'The network printer on the 2nd floor is showing offline status',
      userId: 2,
      statusId: 2, // ACCEPTED
      createdById: 2,
      updatedById: 1 // Updated by admin
    },
    {
      title: 'Password reset request',
      description: 'Need to reset my password for the accounting system',
      userId: 2,
      statusId: 3, // RESOLVED
      createdById: 2,
      updatedById: 1 // Updated by admin
    },
    {
      title: 'New software installation',
      description: 'Please install Adobe Photoshop on my workstation',
      userId: 2,
      statusId: 4, // REJECTED
      createdById: 2,
      updatedById: 1 // Updated by admin
    }
  ];
  
  // Tickets for testuser1 (userId: 3)
  const testUser1Tickets = [
    {
      title: 'Monitor flickering',
      description: 'My monitor has been flickering for the past two days',
      userId: 3,
      statusId: 1, // PENDING
      createdById: 3,
      updatedById: 3
    },
    {
      title: 'VPN connection issues',
      description: 'Cannot connect to the company VPN from home',
      userId: 3,
      statusId: 2, // ACCEPTED
      createdById: 3,
      updatedById: 1 // Updated by admin
    },
    {
      title: 'Request for second monitor',
      description: 'Would like to request a second monitor for my workstation',
      userId: 3,
      statusId: 3, // RESOLVED
      createdById: 3,
      updatedById: 1 // Updated by admin
    }
  ];
  
  // Combine all tickets
  const allTickets = [...testUserTickets, ...testUser1Tickets];
  
  // Clear existing tickets first to avoid duplicates
  await prisma.ticket.deleteMany({});

  // Create all tickets
  for (const ticket of allTickets) {
    await prisma.ticket.create({
      data: ticket
    });
  }
  
  console.log('Ticket data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });