import bc from 'bcrypt';

// Number of times to hash the password
const SALT_ITT = 12;

// Generate a salt
async function getSalt() {
  return await bc.genSalt(SALT_ITT);
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await getSalt();
  return await bc.hash(password, salt);
}

// Compare a password to a hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bc.compare(password, hash);
}
