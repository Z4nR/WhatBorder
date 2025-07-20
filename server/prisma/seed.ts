import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const roles = [
    { role_name: 'Owner', role_code: 0, label: '#108ee9' },
    { role_name: 'Super Admin', role_code: 1, label: '#ff5500' },
    { role_name: 'Admin', role_code: 2, label: '#fa541c' },
    { role_name: 'User', role_code: 3, label: '#52c41a' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { role_code: role.role_code },
      update: {
        role_name: role.role_name,
        label: role.label,
        active_status: true,
      },
      create: {
        role_name: role.role_name,
        role_code: role.role_code,
        label: role.label,
        active_status: true,
      },
    });
  }

  console.log('Roles seeded:', roles);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
