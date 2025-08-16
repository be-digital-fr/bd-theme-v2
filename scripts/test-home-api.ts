import { PrismaHomeRepository } from '../features/home/infrastructure/repositories/PrismaHomeRepository';

async function testHomeAPI() {
  try {
    console.log('🧪 Testing PrismaHomeRepository server-side...');

    const repository = new PrismaHomeRepository();
    
    // Test French content
    const frContent = await repository.getLocalizedHomeContent('fr');
    console.log('🇫🇷 French content success:', {
      id: frContent?.id,
      title: frContent?.heroBanner?.heroTitle,
      hasContent: !!frContent
    });

    console.log('✅ Server-side Prisma repository test successful');

  } catch (error) {
    console.error('❌ Error testing server-side repository:', error);
    throw error;
  }
}

testHomeAPI()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });