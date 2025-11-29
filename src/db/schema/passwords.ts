import { sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const passwords = sqliteTable("passwords", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  argon2Salt: blob("argon2_salt", { mode: 'buffer' }).notNull(),
  hkdfSalt: blob("hkdf_salt", { mode: 'buffer' }).notNull(),
  kemNonce: blob("kem_nonce", { mode: 'buffer' }).notNull(),
  kemCiphertext: blob("kem_ciphertext", { mode: 'buffer' }).notNull(),
  passwordNonce: blob("password_nonce", { mode: 'buffer' }).notNull(),
  passwordCiphertext: blob("password_ciphertext", { mode: 'buffer' }).notNull(),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});
