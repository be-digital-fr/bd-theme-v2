import { auth } from './lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function seedViaAuth() {
  console.log('🌱 Seeding test users via Better Auth...');

  // Test users data
  const users = [
    {
      email: 'admin@test.local',
      password: 'testpass123',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
    {
      email: 'employee@test.local',
      password: 'testpass123',
      name: 'Employee User',
      role: UserRole.EMPLOYEE,
    },
    {
      email: 'user1@test.local',
      password: 'testpass123',
      name: 'John Doe',
      role: UserRole.USER,
    },
    {
      email: 'user2@test.local',
      password: 'testpass123',
      name: 'Jane Smith',
      role: UserRole.USER,
    },
    {
      email: 'user3@test.local',
      password: 'testpass123',
      name: 'Bob Johnson',
      role: UserRole.USER,
    },
  ];

  // Clear existing test users first
  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        in: users.map(u => u.email),
      },
    },
    include: { account: true },
  });

  for (const user of existingUsers) {
    await prisma.account.deleteMany({
      where: { userId: user.id },
    });
  }

  await prisma.user.deleteMany({
    where: {
      email: {
        in: users.map(u => u.email),
      },
    },
  });

  console.log('🗑️ Cleared existing test users');

  // Create users via Better Auth sign-up
  for (const userData of users) {
    try {
      const mockHeaders = new Headers();
      mockHeaders.set('content-type', 'application/json');
      
      const body = JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
      });

      const request = new Request('http://localhost:3000/api/auth/sign-up/email', {
        method: 'POST',
        headers: mockHeaders,
        body: body
      });

      const response = await auth.handler(request);
      
      if (response.status === 200) {
        const result = await response.json();
        
        // Update the user role (Better Auth creates users with default role)
        if (userData.role !== UserRole.USER) {
          await prisma.user.update({
            where: { id: result.user.id },
            data: { 
              role: userData.role,
              emailVerified: true, // Mark test users as verified
            }
          });
        } else {
          // Just mark as verified
          await prisma.user.update({
            where: { id: result.user.id },
            data: { emailVerified: true }
          });
        }
        
        console.log(`✅ Created ${userData.name} (${userData.email}) - Role: ${userData.role}`);
        
      } else {
        const errorText = await response.text();
        console.error(`❌ Failed to create ${userData.email}: ${errorText}`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${userData.email}:`, error);
    }
  }

  await prisma.$disconnect();
  
  console.log('\n🎉 Seeding completed!');
  console.log('\n📝 Test credentials:');
  console.log('Password for all users: testpass123');
  console.log('\n👤 Users:');
  for (const user of users) {
    console.log(`  - ${user.name}: ${user.email} (${user.role})`);
  }
}

seedViaAuth().catch(console.error);