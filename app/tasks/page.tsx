"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Task, getTasks, addTask, updateTask, deleteTask } from '@/lib/api';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskState] = useState('Pendent');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  

  const loadTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks || []);
    } catch (error) {
      console.error('Error carregant tasques:', error);
      setTasks([]);
    }
  };

  const deleteT = async (id: number) => {
    try {
      const fetchedTasks = await deleteTask(id); 
      setTasks(fetchedTasks || []);
    } catch (error) {
      console.error('Error eliminant tasques:', error);
      setTasks([]);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const advanceState = async (task: Task) => {
    const nextState = task.state === 'Pendent' ? 'En progrés' : 'Completada';
    
    try {
      const newTasks = await updateTask(task.id, { state: nextState });
      setTasks(newTasks || []);
      alert('Estat actualitzat');
    } catch (error) {
      console.error('Error actualitzant estat:', error);
    }
  };
  

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      try {
        const newTasks = await addTask(newTaskText, newTaskState);
        setTasks(newTasks || []);
        setNewTaskText('');
        alert('Tasca afegida correctament');
      } catch (error) {
        console.error('Error afegint tasca:', error);
      }
    }
  };

  const editText = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = async () => {
    if (editingId && editingText.trim()) {
      try {
        const newTasks = await updateTask(editingId, { text: editingText });
        setTasks(newTasks || []);
        setEditingId(null);
        setEditingText('');
        alert('Text actualitzat');
      } catch (error) {
        console.error('Error editant:', error);
      }
    }
  };
 

  return (
    <div className='w-[70%] p-6 my-12 bg-purple-200 dark:bg-purple-900 border-2 border-fuchsia-300 dark:border-purple-600 rounded-lg shadow-lg'>
      <h2 className='m-[1%] text-3xl font-bold text-purple-400 dark:text-purple-200'>Les meves tasques</h2>
      
      <form className='mx-[1%] my-6 p-6 bg-cyan-100 dark:bg-blue-800 border-2 border-cyan-200 dark:border-blue-600 rounded-lg flex gap-4 items-center shadow-md' onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Nova tasca..."
          className="px-4 py-3 rounded-md border-2 border-cyan-300 dark:border-blue-500 bg-cyan-200 dark:bg-blue-700 text-blue-400 dark:text-blue-200 placeholder-cyan-400 dark:placeholder-blue-300 flex-1 focus:border-fuchsia-300 dark:focus:border-purple-500 focus:outline-none"
        />
        
        <button type="submit" className="px-6 py-3 bg-blue-300 dark:bg-blue-600 border-2 border-blue-400 dark:border-blue-500 text-blue-100 dark:text-blue-100 rounded-md cursor-pointer hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors font-semibold">Afegir</button>
      </form>
      {tasks.length === 0 ? (
        <p className='text-cyan-400 dark:text-purple-300 text-lg'>No hi ha tasques</p>
      ) : (
        tasks.map(task => (
          <div className='bg-fuchsia-200 dark:bg-purple-800 border-2 border-fuchsia-300 dark:border-purple-600 rounded-lg m-[2%] p-4 flex justify-between items-center shadow-md' key={task.id}>
            {editingId === task.id ? (
              <div className='flex gap-3'>
                <input 
                  value={editingText} 
                  onChange={(e) => setEditingText(e.target.value)}
                  className='p-3 w-64 rounded-md border-2 border-cyan-300 dark:border-blue-500 bg-cyan-100 dark:bg-blue-700 text-blue-400 dark:text-blue-200'
                />
                <button onClick={saveEdit} className='px-4 py-2 bg-blue-300 dark:bg-blue-600 border-2 border-blue-400 dark:border-blue-500 text-blue-100 dark:text-blue-100 rounded-md cursor-pointer hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors font-semibold'>Guardar</button>
                <button onClick={() => setEditingId(null)} className='px-4 py-2 bg-fuchsia-300 dark:bg-fuchsia-600 border-2 border-fuchsia-400 dark:border-fuchsia-500 text-fuchsia-100 dark:text-fuchsia-100 rounded-md cursor-pointer hover:bg-fuchsia-400 dark:hover:bg-fuchsia-500 transition-colors font-semibold'>Cancel·lar</button>
              </div>
            ) : (
              <Link href={`/tasks/${task.id}`}>
                <p className="cursor-pointer hover:text-fuchsia-400 dark:hover:text-purple-400 hover:underline text-purple-400 dark:text-purple-200 font-medium">
                  {task.text} - {task.state}
                </p>
              </Link>
            )}
            <div className='flex gap-2 shrink-0 mr-4'>
              <button onClick={() => editText(task)} className='px-3 py-2 bg-cyan-300 dark:bg-cyan-600 border-2 border-cyan-400 dark:border-cyan-500 text-cyan-100 dark:text-cyan-100 rounded-md cursor-pointer hover:bg-cyan-400 dark:hover:bg-cyan-500 transition-colors font-semibold'>Editar</button>
              <button onClick={() => advanceState(task)} className='px-3 py-2 bg-blue-300 dark:bg-blue-600 border-2 border-blue-400 dark:border-blue-500 text-blue-100 dark:text-blue-100 rounded-md cursor-pointer hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors font-semibold'>C.estat</button>
              <button onClick={() => deleteT(task.id)} className='px-3 py-2 bg-fuchsia-300 dark:bg-fuchsia-600 border-2 border-fuchsia-400 dark:border-fuchsia-500 text-fuchsia-100 dark:text-fuchsia-100 rounded-md cursor-pointer hover:bg-fuchsia-400 dark:hover:bg-fuchsia-500 transition-colors font-semibold'>Eliminar</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}