import {PrismaClient} from '@prisma/client'
export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production"){
    globalThis.prisma = db
}

// globalThis.prisma : This global variable ensures that the PrismaClient instance is reused across hot reloads during development.
// Without this, each time your appication reloads , a new instance of the Prisma client would be created, to connection issues.