import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  console.log('🌱 Memulai seeding data awal...');

  const userDapur = await prisma.user.upsert({
  where: { username: 'dapur' },
  update: {
    password: passwordHash,
  },
  create: {
    username: 'dapur',
    password: passwordHash,
    role: UserRole.DAPUR,
  },
});

const userToko = await prisma.user.upsert({
  where: { username: 'toko' },
  update: {
    password: passwordHash,
  },
  create: {
    username: 'toko',
    password: passwordHash,
    role: UserRole.TOKO,
  },
});


const userOwner = await prisma.user.upsert({
  where: { username: 'owner' },
  update: {
    password: passwordHash,
  },
  create: {
    username: 'owner',
    password: passwordHash,
    role: UserRole.OWNER,
  },
});


  const locDapur = await prisma.location.upsert({
    where: { name: 'DAPUR' },
    update: {},
    create: {
      name: 'DAPUR',
    },
  });

  const locToko = await prisma.location.upsert({
    where: { name: 'TOKO' },
    update: {},
    create: {
      name: 'TOKO',
    },
  });

  const categoryMakanan = await prisma.category.upsert({
    where: { name: 'Makanan' },
    update: {},
    create: {
      name: 'Makanan',
    },
  });

  const categoryMinuman = await prisma.category.upsert({
    where: { name: 'Minuman' },
    update: {},
    create: {
      name: 'Minuman',
    },
  });

  const unitPcs = await prisma.unit.upsert({
    where: { symbol: 'pcs' },
    update: {},
    create: {
      name: 'Pieces',
      symbol: 'pcs',
    },
  });

  const unitPorsi = await prisma.unit.upsert({
    where: { symbol: 'prs' },
    update: {},
    create: {
      name: 'Porsi',
      symbol: 'prs',
    },
  });

  const products = [
    { kodeBarang: 'M001', name: 'Bolu Kukus' },
    { kodeBarang: 'M002', name: 'Bugis' },
    { kodeBarang: 'M003', name: 'Darlung' },
    { kodeBarang: 'M004', name: 'Gehu' },
    { kodeBarang: 'M005', name: 'Kroket' },
    { kodeBarang: 'M006', name: 'Kt Bumbu/B' },
    { kodeBarang: 'M007', name: 'Kt Bumbu/S' },
    { kodeBarang: 'M008', name: 'Lapis' },
    { kodeBarang: 'M009', name: 'Lapis/S' },
    { kodeBarang: 'M010', name: 'Lemper' },
    { kodeBarang: 'M011', name: 'Lolos' },
    { kodeBarang: 'M012', name: 'Lumpia' },
    { kodeBarang: 'M013', name: 'Nagasari' },
    { kodeBarang: 'M014', name: 'Ongol' },
    { kodeBarang: 'M015', name: 'Pastel' },
    { kodeBarang: 'M016', name: 'Ps. Goreng' },
    { kodeBarang: 'M017', name: 'R. Ragout' },
    { kodeBarang: 'M018', name: 'R. SMB' },
    { kodeBarang: 'M019', name: 'R. SMB Telur' },
    { kodeBarang: 'M020', name: 'Sus Vla' },
    { kodeBarang: 'M021', name: 'T. Ubi' },
    { kodeBarang: 'M022', name: 'Cente Coklat' },
    { kodeBarang: 'M023', name: 'Chif Kt Htm' },
    { kodeBarang: 'M024', name: 'Chif Pandan' },
    { kodeBarang: 'M025', name: 'Ps. Ayam' },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        kodeBarang: product.kodeBarang,
      },
      update: {},
      create: {
        kodeBarang: product.kodeBarang,
        name: product.name,
        categoryId: categoryMakanan.id,
        unitId: unitPcs.id,
      },
    });
  }

  console.log('✅ Seeding berhasil selesai!');

  console.log({
    users: [userDapur.username, userToko.username],
    locations: [locDapur.name, locToko.name],
    categories: [categoryMakanan.name, categoryMinuman.name],
    units: [unitPcs.symbol, unitPorsi.symbol],
    products: products.map((product) => product.name),
  });
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

