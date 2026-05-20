import { db } from "../server/db";
import { adminUsers } from "../server/db/schema";
import { hash } from "bcryptjs";

async function seedAdmin() {
  console.log("🌱 Creating admin user...");

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const passwordHash = await hash(password, 10);

  try {
    await db.insert(adminUsers).values({
      email,
      passwordHash,
    });

    console.log("✅ Admin user created successfully!");
    console.log(`\nLogin credentials:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`\nYou can now log in at /admin/login`);
  } catch (error: any) {
    if (error.code === "23505") {
      // Unique constraint violation
      console.log("ℹ️  Admin user already exists");
    } else {
      console.error("❌ Error creating admin user:", error);
    }
  }

  process.exit(0);
}

seedAdmin();
