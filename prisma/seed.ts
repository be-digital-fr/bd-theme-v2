import { PrismaClient, UserRole } from '@prisma/client';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

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

  // Hash password for all test users (password: "testpass123") using scrypt
  // Better Auth uses scrypt by default with specific parameters:
  // - 16-byte salt (32 chars hex)  
  // - 64-byte derived key (128 chars hex)
  // - Format: salt:hash (both in hex)
  async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16); // 16 bytes
    const derived = await scryptAsync(password, salt, 64) as Buffer; // 64 bytes
    return `${salt.toString('hex')}:${derived.toString('hex')}`;
  }
  
  const hashedPassword = await hashPassword('testpass123');

  // Create test users
  const users = [
    {
      email: 'admin@test.local',
      name: 'Admin User',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
    {
      email: 'employee@test.local',
      name: 'Employee User',
      role: UserRole.EMPLOYEE,
      emailVerified: true,
    },
    {
      email: 'user1@test.local',
      name: 'John Doe',
      role: UserRole.USER,
      emailVerified: true,
    },
    {
      email: 'user2@test.local',
      name: 'Jane Smith',
      role: UserRole.USER,
      emailVerified: true,
    },
    {
      email: 'user3@test.local',
      name: 'Bob Johnson',
      role: UserRole.USER,
      emailVerified: true,
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        emailVerified: userData.emailVerified,
      },
    });

    // Create associated Account for email/password authentication
    // Better Auth uses 'credential' as provider ID for email/password auth
    // accountId should be the user ID, not the email
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: 'credential',
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