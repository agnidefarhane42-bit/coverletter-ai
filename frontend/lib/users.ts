import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Memory cache of users
let usersCache: User[] | null = null;

export function loadUsers(): User[] {
  if (usersCache) return usersCache;
  ensureDataDir();

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    usersCache = [];
    return usersCache;
  }

  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    usersCache = JSON.parse(data);
    return usersCache || [];
  } catch (e) {
    console.error('Error reading users file:', e);
    return [];
  }
}

export function saveUsers(users: User[]) {
  ensureDataDir();
  usersCache = users;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function hashPassword(password: string): string {
  const salt = 'coverletter_ai_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  const candidateHash = hashPassword(password);
  return candidateHash === hash;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = loadUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  return user || null;
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const users = loadUsers();
  const normalizedEmail = email.toLowerCase().trim();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('Un utilisateur avec cet e-mail existe déjà.');
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}
