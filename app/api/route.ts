import { NextRequest, NextResponse } from "next/server";
import { Redis } from '@upstash/redis'
import { Task } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]/route";


const redis = Redis.fromEnv();

const getCurrentUserId = async () => {
    const session = await getServerSession(authOptions);
    return (session?.user as any)?.id || null;
}

const readUser = async (userId: string) => {
    const data = await redis.get(`user:${userId}`) as any | null;
    if (!data){
        throw new Error(`Usuari ${userId} no trobat a la base de dades de Redis.`)
    }
    return data;
}

const getCurrentUser = async ()=> {
    const userId = await getCurrentUserId() as any;
    if (!userId) {
        throw new Error("No s'ha pogut obtenir l'ID d'usuari");
    }
    return await readUser(userId);
}

const updateUserTasks = async (taskModifier: (tasks: Task[], user: any) => Task[]) => {
    const user = await getCurrentUser();
    const tasks = user.tasks || [];
    user.tasks = taskModifier(tasks, user);
    await redis.set(`user:${user.id}`, user);
    return NextResponse.json({ ok: true });
}

export async function GET() {
    const user = await getCurrentUser();
    return NextResponse.json({ tasks: user.tasks || [] });
}

export async function POST(request: NextRequest) {
    const { text, state } = await request.json();
    return await updateUserTasks((tasks) => {
        const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
        tasks.push({ id: maxId + 1, text, state });
        return tasks;
    });
}

export async function PUT(request: NextRequest) {
    const { id, updates } = await request.json();
    return await updateUserTasks((tasks) => {
        const taskIndex = tasks.findIndex((t: Task) => t.id === id);
        if (taskIndex === -1) {
            throw new Error('Tasca no trobada');
        }
        Object.assign(tasks[taskIndex], updates);
        return tasks;
    });
}


export async function DELETE(request: NextRequest) {
    const { id } = await request.json();
    return await updateUserTasks((tasks) => {
        const taskIndex = tasks.findIndex((t: Task) => t.id === id);
        if (taskIndex === -1) {
            throw new Error('Tasca no trobada');
        }
        tasks.splice(taskIndex, 1);
        return tasks;
    });
}
