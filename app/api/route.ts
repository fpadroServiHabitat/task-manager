import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Task } from "@/lib/api";

const tasksPath = path.join(process.cwd(), 'data', 'tasks.json');

function dbConnection (savedTasks: { tasks: Task[] }){
    fs.writeFileSync(tasksPath, JSON.stringify(savedTasks, null, 2));
    return NextResponse.json({ tasks: savedTasks.tasks });
}

const readTasks = () => {
    try {
      const data = fs.readFileSync(tasksPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { tasks: [] };
    }
  };
export async function GET() {
    const savedTasks = readTasks();
    return NextResponse.json({ tasks: savedTasks.tasks });
}

export async function POST(request: NextRequest) {
    try {
        const { text, state } = await request.json();
        const savedTasks = readTasks();
        const maxId = savedTasks.tasks.length > 0 ? Math.max(...savedTasks.tasks.map((t: Task) => t.id)) : 0;
        const newId = maxId + 1;

        const newTask = {
            id: newId,
            text,
            state
        };
        
        savedTasks.tasks.push(newTask);
        
        return dbConnection(savedTasks);

    } catch (error) {
        return NextResponse.json({ ok: false, message:'Error afegint tasca' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, updates } = await request.json();
        const savedTasks = readTasks();

        const taskIndex = savedTasks.tasks.findIndex((t: Task) => t.id === id);
        
        if (taskIndex === -1) {
            return NextResponse.json({ ok: false, message: 'Tasca no trobada' }, { status: 404 });
        }

        Object.assign(savedTasks.tasks[taskIndex], updates);
        
        return dbConnection(savedTasks);

    } catch (error) {
        return NextResponse.json({ ok: false, message: 'Error actualitzant' }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        const savedTasks = readTasks();
        
        const taskIndex = savedTasks.tasks.findIndex((t: Task) => t.id === id);
        
        if (taskIndex === -1) {
            return NextResponse.json({ ok: false, message: 'Tasca no trobada' }, { status: 404 });
        }
        
        savedTasks.tasks.splice(taskIndex, 1);
        
        return dbConnection(savedTasks);
    } catch (error) {
        return NextResponse.json({ ok: false, message: 'Error eliminant tasca' }, { status: 500 });
    }
}
