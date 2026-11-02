const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const DEFAULT_HASH = hashPassword("password123");

const SEED_USERS = [
  {
    name: "Yash Pable",
    email: "yash.pable@sitrc.ac.in",
    password: DEFAULT_HASH,
    role: "DEVELOPER",
    avatar: "YP",
    department: "Department of Computer Engineering, SITRC (Seat 112023528)"
  },
  {
    name: "Alex Vance",
    email: "alex.vance@sitrc.ac.in",
    password: DEFAULT_HASH,
    role: "SECURITY_LEAD",
    avatar: "AV",
    department: "DevSecOps & Security Center of Excellence"
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@sitrc.ac.in",
    password: DEFAULT_HASH,
    role: "QA_ENGINEER",
    avatar: "PS",
    department: "Quality Automation & Continuous Verification"
  },
  {
    name: "David Chen",
    email: "david.chen@sppu.ac.in",
    password: DEFAULT_HASH,
    role: "NIST_AUDITOR",
    avatar: "DC",
    department: "Regulatory Governance Board, SPPU Pune"
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@sitrc.ac.in",
    password: DEFAULT_HASH,
    role: "ARCHITECT",
    avatar: "ER",
    department: "Enterprise Software Architecture Directorate"
  }
];

async function seed() {
  console.log("Seeding verified enterprise users to Neon Cloud PostgreSQL...");
  for (const u of SEED_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, avatar: u.avatar, department: u.department, password: u.password },
      create: u
    });
    console.log(`✓ Seeded User: [${user.role}] ${user.name} <${user.email}> (ID: ${user.id})`);
  }

  // Also backfill any unassigned audit logs to Yash Pable as default author
  const defaultUser = await prisma.user.findUnique({ where: { email: "yash.pable@sitrc.ac.in" } });
  if (defaultUser) {
    const updated = await prisma.auditLog.updateMany({
      where: { userId: null },
      data: {
        userId: defaultUser.id,
        userName: defaultUser.name,
        userEmail: defaultUser.email,
        userRole: defaultUser.role
      }
    });
    console.log(`✓ Backfilled ${updated.count} historical audit logs with user: ${defaultUser.name}`);
  }

  console.log("Database user seeding completed successfully!");
  await prisma.$disconnect();
}

seed().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
