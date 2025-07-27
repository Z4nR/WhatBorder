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

  const buildings = [
    { name: 'Bangunan', color: '#ad2102', label: '#fa541c' },
    { name: 'Lahan Kosong', color: '#ad4e00', label: '#fa8c16' },
    { name: 'Pertanian', color: '#5b8c00', label: '#a0d911' },
    { name: 'Peternakan', color: '#10239e', label: '#2f54eb' },
    { name: 'Tidak Diketahui', color: '#595959', label: '#bfbfbf' },
  ];

  for (const building of buildings) {
    await prisma.buildingType.upsert({
      where: { color: building.color },
      update: {
        name: building.name,
        label: building.label,
        active: true,
      },
      create: {
        name: building.name,
        label: building.label,
        color: building.color,
        active: true,
      },
    });
  }

  console.log('Building seeded:', buildings);
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
