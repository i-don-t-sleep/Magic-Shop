import mysql, { type Connection } from "mysql2/promise" //npm install mysql2
//prisma
let connection: Connection | null = null

export async function connectDB(): Promise<Connection> {
  if (connection) return connection

  const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

  if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME) {
    /*process.stdout.write('Missing env vars:\n')
    process.stdout.write(`  DB_HOST=${DB_HOST}\n`)
    process.stdout.write(`  DB_USER=${DB_USER}\n`)
    process.stdout.write(`  DB_PASS=${DB_PASS}\n`)
    process.stdout.write(`  DB_NAME=${DB_NAME}\n`)*/
    throw new Error("Missing required environment variables for database connection.")
  }

  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    })
    //process.stdout.write('Connected to MySQL database\n')
    return connection
  } catch (error) {
    process.stderr.write("Failed to connect to DB: " + JSON.stringify(error) + "\n")
    throw error
  }
}
