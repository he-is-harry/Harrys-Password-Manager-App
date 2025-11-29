CREATE TABLE IF NOT EXISTS logins (
    id INTEGER PRIMARY KEY,
    argon2_salt BLOB NOT NULL,
    vault_key_ciphertext BLOB NOT NULL,
    vault_key_nonce BLOB NOT NULL
);
