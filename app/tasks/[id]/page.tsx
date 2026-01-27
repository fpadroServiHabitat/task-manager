"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Task, getTasks, updateTask } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TaskDetail({ params }: PageProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const resolvedParams = use(params);
  const [isEditing, setIsEditing ] = useState(false);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      try {
        const taskId = parseInt(resolvedParams.id);
        const allTasks = await getTasks();
        const foundTask = allTasks.find(t => t.id === taskId);
        
        if (foundTask) {
          setTask(foundTask);
        } else {
          setError('Tasca no trobada');
        }
      } catch (err) {
        setError('Error carregant la tasca');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [resolvedParams.id]);

  const handleBack = () => {
    router.push('/tasks');
  };

  const handleAdvanceState = async () => {
    if (!task) return;
    
    const nextState = (() => {
      switch (task.state) {
        case 'Pendent': return 'En progrés';
        case 'En progrés': return 'Completada';
        case 'Completada': return 'Pendent';
        default: return 'Pendent';
      }
    })();
    
    try {
      await updateTask(task.id, { state: nextState });
      setTask({ ...task, state: nextState });
    } catch (error) {
      console.error('Error actualitzant estat:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task?.text || '');
  };

  const handleSaveEdit = async () => {
    if (!task || !editText.trim()) return;
    
    try {
      await updateTask(task.id, { text: editText });
      setTask({ ...task, text: editText });
      setIsEditing(false);
    } catch (error) {
      console.error('Error editant:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText('');
  };

  if (loading) return <div className="p-4 text-purple-600 dark:text-purple-300">Carregant...</div>;
  if (error) return <div className="p-4 text-red-600 dark:text-red-400">{error}</div>;
  if (!task) return <div className="p-4 text-purple-600 dark:text-purple-300">Tasca no trobada</div>;

  return (
    <div className="w-[70%] p-6 my-12 bg-purple-200 dark:bg-purple-900 border-2 border-fuchsia-300 dark:border-purple-600 rounded-lg shadow-lg">
      <h2 className="m-[1%] text-3xl font-bold text-purple-400 dark:text-purple-200">Detall de la tasca</h2>
      
      <div className="mx-[1%] my-6 p-6 bg-cyan-100 dark:bg-blue-800 border-2 border-cyan-200 dark:border-blue-600 rounded-lg shadow-md">
        {isEditing ? (
          <div className="flex gap-3 mb-4">
            <input 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)}
              className='p-3 flex-1 rounded-md border-2 border-cyan-300 dark:border-blue-500 bg-cyan-200 dark:bg-blue-700 text-blue-400 dark:text-blue-200'
            />
            <button onClick={handleSaveEdit} className='px-4 py-2 bg-blue-300 dark:bg-blue-600 border-2 border-blue-400 dark:border-blue-500 text-blue-100 dark:text-blue-100 rounded-md cursor-pointer hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors font-semibold'>Guardar</button>
            <button onClick={handleCancelEdit} className='px-4 py-2 bg-fuchsia-300 dark:bg-fuchsia-600 border-2 border-fuchsia-400 dark:border-fuchsia-500 text-fuchsia-100 dark:text-fuchsia-100 rounded-md cursor-pointer hover:bg-fuchsia-400 dark:hover:bg-fuchsia-500 transition-colors font-semibold'>Cancel·lar</button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-3 text-blue-400 dark:text-blue-200">{task.text}</h3>
            <p className="text-lg mb-6 text-cyan-400 dark:text-blue-300">Estat: <span className="font-bold text-purple-400 dark:text-purple-300">{task.state}</span></p>
          </>
        )}
        
        <div className="flex gap-3">
          <button onClick={handleEdit} className='px-4 py-2 bg-cyan-300 dark:bg-cyan-600 border-2 border-cyan-400 dark:border-cyan-500 text-cyan-100 dark:text-cyan-100 rounded-md cursor-pointer hover:bg-cyan-400 dark:hover:bg-cyan-500 transition-colors font-semibold'>Editar</button>
          <button onClick={handleAdvanceState} className='px-4 py-2 bg-blue-300 dark:bg-blue-600 border-2 border-blue-400 dark:border-blue-500 text-blue-100 dark:text-blue-100 rounded-md cursor-pointer hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors font-semibold'>C.estat</button>
          <button 
            onClick={handleBack}
            className="px-6 py-2 bg-fuchsia-300 dark:bg-fuchsia-600 border-2 border-fuchsia-400 dark:border-fuchsia-500 text-fuchsia-100 dark:text-fuchsia-100 rounded-md cursor-pointer hover:bg-fuchsia-400 dark:hover:bg-fuchsia-500 transition-colors font-semibold"
          >
            Tornar a la llista
          </button>
        </div>
      </div>
    </div>
  );
}