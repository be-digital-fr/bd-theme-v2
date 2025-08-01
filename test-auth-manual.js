const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    // Find user
    const user = await prisma.user.findFirst({
      where: { email: 'user1@test.local' },
      include: { accounts: true }
    });

    if (!user || !user.accounts[0]) {
      console.log('❌ User or account not found');
      return;
    }

    const account = user.accounts[0];
    console.log('✅ User found:', user.email);
    console.log('✅ Account provider:', account.providerId);
    
    // Test password verification
    const isPasswordValid = await bcrypt.compare('testpass123', account.password);
    console.log('✅ Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password hash does not match!');
      console.log('Stored hash:', account.password.substring(0, 20) + '...');
      
      // Try creating a new hash for comparison
      const newHash = await bcrypt.hash('testpass123', 12);
      console.log('New hash:', newHash.substring(0, 20) + '...');
      
      const testNewHash = await bcrypt.compare('testpass123', newHash);
      console.log('New hash works:', testNewHash);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();