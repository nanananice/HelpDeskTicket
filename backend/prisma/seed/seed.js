import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create statuses if they don't exist
  const statuses = [
    { id: 1, name: 'PENDING' },
    { id: 2, name: 'ACCEPTED' },
    { id: 3, name: 'RESOLVED' },
    { id: 4, name: 'REJECTED' }
  ];

  console.log('Seeding status data...');
  
  for (const status of statuses) {
    await prisma.status.upsert({
      where: { id: status.id },
      update: {},
      create: status
    });
  }
  
  console.log('Status data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });