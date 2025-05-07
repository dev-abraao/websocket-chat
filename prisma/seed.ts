import { prisma } from "@/(lib)/db";
import * as bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.create({
    data: {
      login: "admin@admin.com",
      username: "Admin",
      password: hashedPassword,
      hasCreatedRoom: true,
      ownedRooms: {
        create: {
          name: "Geral",
          description: "Sala Geral",
          is_default_room: true,
          members: {
            create: {
              userId: undefined as unknown as string, // This will be updated after user creation
            },
          },
        },
      },
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
