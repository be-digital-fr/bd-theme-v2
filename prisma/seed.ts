import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test users...');

  // Clear existing test users and their accounts
  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        in: [
          'admin@test.local',
          'employee@test.local',
          'user1@test.local',
          'user2@test.local',
          'user3@test.local',
        ],
      },
    },
    include: { accounts: true },
  });

  // Delete accounts first (due to foreign key constraints)
  for (const user of existingUsers) {
    await prisma.account.deleteMany({
      where: { userId: user.id },
    });
  }

  // Then delete users
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          'admin@test.local',
          'employee@test.local',
          'user1@test.local',
          'user2@test.local',
          'user3@test.local',
        ],
      },
    },
  });

  // Hash password for all test users (password: "testpass123")
  const hashedPassword = await hash('testpass123', 12);

  // Create test users
  const users = [
    {
      email: 'admin@test.local',
      name: 'Admin User',
      role: 'admin', // This is just for logging, not stored in DB
      emailVerified: true,
    },
    {
      email: 'employee@test.local',
      name: 'Employee User',
      role: 'employee',
      emailVerified: true,
    },
    {
      email: 'user1@test.local',
      name: 'John Doe',
      role: 'user',
      emailVerified: true,
    },
    {
      email: 'user2@test.local',
      name: 'Jane Smith',
      role: 'user',
      emailVerified: true,
    },
    {
      email: 'user3@test.local',
      name: 'Bob Johnson',
      role: 'user',
      emailVerified: true,
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        emailVerified: userData.emailVerified,
      },
    });

    // Create associated Account for email/password authentication
    // Better Auth uses 'email-password' as provider ID for email/password auth
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.email,
        providerId: 'email-password',
        password: hashedPassword,
      },
    });

    console.log(`✅ Created test user: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
  }

  console.log('🎉 Seeding completed!');
  console.log('');
  console.log('📝 Test credentials:');
  console.log('Password for all users: testpass123');
  console.log('');
  console.log('👤 Users:');
  users.forEach((user) => {
    console.log(`  - ${user.name}: ${user.email} (${user.role})`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });