import { NextRequest, NextResponse } from "next/server";
import { Redis } from '@upstash/redis'
import { Task } from "@/lib/api";


const redis = Redis.fromEnv();


async function dbConnection (savedTasks: { tasks: Task[] }){
    await redis.set('tasks', savedTasks);
    return NextResponse.json({ tasks: savedTasks.tasks });
}

const readTasks = async (): Promise<{ tasks: Task[] }> => {
    try {
      const data = await redis.get("tasks") as { tasks: Task[] } | null;
      return data || { tasks: [] };
    } catch (error) {
      console.error('Error reading tasks:', error);
      return { tasks: [] };
    }
  };

export async function GET() {
    try {
        const savedTasks = await readTasks();
        return NextResponse.json({ tasks: savedTasks.tasks || [] });
    } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ tasks: [] });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { text, state } = await request.json();
        const savedTasks = await readTasks();
        const tasks = savedTasks.tasks || [];
        const maxId = tasks.length > 0 ? Math.max(...tasks.map((t: Task) => t.id)) : 0;
        const newId = maxId + 1;

        const newTask = {
            id: newId,
            text,
            state
        };
        
        tasks.push(newTask);
        
        return await dbConnection({ tasks });

    } catch (error) {
        console.error('POST Error:', error);
        return NextResponse.json({ ok: false, message:'Error afegint tasca' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, updates } = await request.json();
        const savedTasks = await readTasks();
        const tasks = savedTasks.tasks || [];

        const taskIndex = tasks.findIndex((t: Task) => t.id === id);
        
        if (taskIndex === -1) {
            return NextResponse.json({ ok: false, message: 'Tasca no trobada' }, { status: 404 });
        }

        Object.assign(tasks[taskIndex], updates);
        
        return await dbConnection({ tasks });

    } catch (error) {
        console.error('PUT Error:', error);
        return NextResponse.json({ ok: false, message: 'Error actualitzant' }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        const savedTasks = await readTasks();
        const tasks = savedTasks.tasks || [];
        
        const taskIndex = tasks.findIndex((t: Task) => t.id === id);
        
        if (taskIndex === -1) {
            return NextResponse.json({ ok: false, message: 'Tasca no trobada' }, { status: 404 });
        }
        
        tasks.splice(taskIndex, 1);
        
        return await dbConnection({ tasks });
    } catch (error) {
        console.error('DELETE Error:', error);
        return NextResponse.json({ ok: false, message: 'Error eliminant tasca' }, { status: 500 });
    }
}
