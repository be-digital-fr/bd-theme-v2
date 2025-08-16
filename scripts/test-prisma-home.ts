import { PrismaHomeContainer } from '../features/home/infrastructure/di/PrismaHomeContainer';

async function testPrismaHome() {
  try {
    console.log('🧪 Testing Prisma home content...');

    const container = PrismaHomeContainer.getInstance();
    const useCase = container.getGetLocalizedHomeContentUseCase();
    
    // Test French content
    const frContent = await useCase.execute('fr');
    console.log('🇫🇷 French content:', {
      title: frContent?.heroBanner?.heroTitle,
      description: frContent?.heroBanner?.heroDescription,
      primaryButton: frContent?.heroBanner?.primaryButton?.text
    });

    // Test English content
    const enContent = await useCase.execute('en');
    console.log('🇬🇧 English content:', {
      title: enContent?.heroBanner?.heroTitle,
      description: enContent?.heroBanner?.heroDescription,
      primaryButton: enContent?.heroBanner?.primaryButton?.text
    });

    console.log('✅ Prisma home content test successful');

  } catch (error) {
    console.error('❌ Error testing Prisma home content:', error);
    throw error;
  }
}

testPrismaHome()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });