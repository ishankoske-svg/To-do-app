// d:\projects\personal-projects\to-do-list\server\prisma\seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 'temp-user-123' },
    update: {},
    create: {
      id: 'temp-user-123',
      email: 'temp@todoflow.dev',
      name: 'Temp User',
      password: 'not-a-real-password'
    }
  });
  console.log('✅ Seed user created:', user.email);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
