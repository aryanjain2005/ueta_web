// src/utils/db.js
import bcrypt from "bcryptjs";

export async function getUserByEmail(db, email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
}

export async function createUser(
  db,
  name,
  email,
  password,
  img = null,
  role = "user",
  type = "standard"
) {
  const hashed = bcrypt.hashSync(password, 10);
  const now = Date.now();
  return db
    .prepare(
      "INSERT INTO users (name, email, password, img, role, type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(name, email, hashed, img, role, type, now)
    .run();
}

export async function checkUserCredentials(db, email, password) {
  const user = await getUserByEmail(db, email);
  if (!user) return null;
  return bcrypt.compareSync(password, user.password) ? user : null;
}
