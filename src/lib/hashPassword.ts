import bcrypt from 'bcryptjs'

export async function generateHashedPassword(password: string): Promise<string> {
  if (!password) {
    return '(no password)'
  }

  const hashed = await bcrypt.hash(password, 10)
  await navigator.clipboard.writeText(hashed)
  return hashed
}
