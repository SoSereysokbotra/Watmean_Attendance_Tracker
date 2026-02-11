import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres"; // @ts-ignore
import * as fs from "fs";

const connectionString = process.env.DATABASE_URL || "";

const sql = postgres(connectionString, { max: 1, ssl: "require" });
const db = drizzle(sql);

async function main() {
  try {
    console.log("Running migrations...");
    console.log("Running migrations...");
    // Bypass drizzle migrate because journal is missing/broken
    // await migrate(db, { migrationsFolder: "src/lib/db/migrations" });

    // Direct execution of the specific migration file
    console.log("Applying 0001_add_room_to_sessions.sql...");
    await sql.file("src/lib/db/migrations/0001_add_room_to_sessions.sql");

    console.log("Migration successful");
  } catch (error: any) {
    console.error("Migration failed", error);
    // Write error to file for debugging
    fs.writeFileSync(
      "migration_error.txt",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    );

    // Also try to write simple message
    try {
      fs.appendFileSync("migration_error.txt", "\n\nStack:\n" + error.stack);
    } catch (e) {}

    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
