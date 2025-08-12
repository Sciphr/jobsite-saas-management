const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function seedTestData() {
  console.log('🌱 Seeding test data for SaaS management system...');

  try {
    // Create a test installation
    const testInstallation = await prisma.saas_installations.upsert({
      where: { domain: 'localhost:3000' },
      update: {},
      create: {
        domain: 'localhost:3000',
        company_name: 'Local Test Company',
        admin_email: 'admin@localhost.com',
        status: 'active',
        billing_email: 'billing@localhost.com',
        billing_plan: 'development',
        notes: 'Local development test installation',
        last_accessed_at: new Date(),
        updated_at: new Date()
      }
    });

    console.log('✅ Created test installation:', testInstallation.company_name);

    // You can add more test data here if needed
    
    console.log('🎉 Test data seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();