import { prisma } from "./client";

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', name: 'Admin' },
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) });