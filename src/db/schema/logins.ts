import { blob, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const logins = sqliteTable('logins', {
  id: integer('id').primaryKey(),
  argon2Salt: blob('argon2_salt', { mode: 'buffer' }).notNull(),
  vaultKeyCiphertext: blob('vault_key_ciphertext', { mode: 'buffer' }).notNull(), // includes 16 byte auth tag
  vaultKeyNonce: blob('vault_key_nonce', { mode: 'buffer' }).notNull(), // 12 bytes for ChaCha20
});
