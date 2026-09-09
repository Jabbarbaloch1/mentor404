import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@mentor404.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hashed = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Mentor404 Admin",
      password: hashed,
      role: "ADMIN",
    },
  });

  const categories = [
    { name: "Dark Web", slug: "dark-web", color: "#c084fc", icon: "Skull" },
    { name: "Security", slug: "security", color: "#5b5fef", icon: "ShieldAlert" },
    { name: "Tools", slug: "tools", color: "#22d3ee", icon: "Wrench" },
    { name: "Technology", slug: "technology", color: "#34d399", icon: "Cpu" },
    { name: "News", slug: "news", color: "#f59e0b", icon: "Newspaper" },
    { name: "Daily Digest", slug: "daily", color: "#f472b6", icon: "CalendarClock" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const tags = ["OSINT", "CTF", "Malware", "Pentest", "Linux", "Cloud", "Zero-Day", "Phishing"];
  for (const t of tags) {
    await prisma.tag.upsert({
      where: { slug: t.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { name: t, slug: t.toLowerCase().replace(/\s+/g, "-") },
    });
  }

  console.log("Seeded admin user:", admin.email);
  console.log("Seeded categories and tags.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
