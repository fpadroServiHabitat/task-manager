"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Task, getTasks, addTask, updateTask, deleteTask, getOrderedTasks } from '@/lib/api';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[][]>([]);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await getOrderedTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error carregant tasques:', error);
    }
  };  
  
  useEffect(() => {
    loadTasks();
  }, []);

  const stateNames = ['Pendent', 'En Progrés', 'Completada'];

  return (
    <div className='w-[70%] p-6 my-12 bg-purple-100 dark:bg-purple-900 border-2 border-purple-200 dark:border-purple-600 rounded-lg shadow-lg'>
      <h2 className='m-[1%] text-3xl font-bold text-purple-300 dark:text-purple-200'>Dashboard</h2>
      
      {tasks.length === 0 ? (
        <p className='text-purple-200 dark:text-purple-300 text-lg bg-'>No hi ha tasques</p>
      ) : (
        tasks.map((taskGroup, index) => (
          <div key={index} className='mb-8'>
            <h3 className='text-xl font-bold mb-4 text-blue-300 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 p-3 rounded-md border-2 border-blue-200 dark:border-blue-600'>{stateNames[index]}</h3>
            {taskGroup.map(task => (
              <div className='bg-purple-200 dark:bg-purple-800 border-2 border-purple-300 dark:border-purple-600 rounded-lg m-[2%] p-4 flex justify-between items-center shadow-md' key={task.id}>
                <Link href={`/tasks/${task.id}`}>
                  <p className="cursor-pointer hover:text-purple-100 dark:hover:text-purple-400 hover:underline text-purple-300 dark:text-purple-200 font-medium">
                    {task.text} - {task.state}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
