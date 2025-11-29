CREATE TABLE IF NOT EXISTS passwords (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    argon2_salt BLOB NOT NULL,
    hkdf_salt BLOB NOT NULL,
    kem_nonce BLOB NOT NULL,
    kem_ciphertext BLOB NOT NULL,
    password_nonce BLOB NOT NULL,
    password_ciphertext BLOB NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
