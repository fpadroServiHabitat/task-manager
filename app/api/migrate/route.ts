import { NextResponse } from "next/server"
import { Redis } from '@upstash/redis'
import fs from 'fs'
import path from 'path'

const redis = Redis.fromEnv()

export async function GET() {
  try {
    // Comprovar si ja s'ha migrat
    const existingUser = await redis.get("user:1")
    if (existingUser) {
      return NextResponse.json({ message: "Migració ja realitzada", migrated: false })
    }

    // Llegir JSON
    const pathToFile = path.join(process.cwd(), 'data/tasks.json')
    const fileContent = fs.readFileSync(pathToFile, 'utf8')
    const data: any = JSON.parse(fileContent)

    // Migrar cada usuari
    for (const user of data.users) {
      await redis.set(`user:${user.id}`, user)
    }

    return NextResponse.json({ 
      message: "Migració completada correctament", 
      migrated: true,
      usersCount: data.users.length 
    })

  } catch (error) {
    console.error('Error en migració:', error)
    return NextResponse.json({ 
      message: "Error durant la migració", 
      error: error 
    }, { status: 500 })
  }
}