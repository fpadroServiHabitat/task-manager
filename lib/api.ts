export interface Task {
    id: number;
    text: string;
    state: string;
  }  

  export const getTasks = async (): Promise<Task[]> => {
    const response = await fetch('/api');
    if (!response.ok) {
      throw new Error('API Error');
    }
    const data = await response.json();
    return data.tasks || [];
  };

  export const getOrderedTasks = async (): Promise<Task[][]> => {
    const tasks = await getTasks();
    
    const tasksPendent = tasks.filter(task => task.state === 'Pendent');
    const tasksEnProgres = tasks.filter(task => task.state === 'En progrés');
    const tasksCompletada = tasks.filter(task => task.state === 'Completada');

    const tasksInOrder: Task[][] = [tasksPendent, tasksEnProgres, tasksCompletada];

    return tasksInOrder;
  };

  export const addTask = async (text: string, state: string): Promise<Task[]> => {
    const response = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, state })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    const data = await response.json();
    return data.tasks || [];
  };

  export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task[]> => {
    const response = await fetch('/api', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates })
    });
    if (!response.ok) {
      throw new Error('API Error');
    }
    const data = await response.json();
    return data.tasks || [];
  };

  export const deleteTask = async (id: number): Promise<Task[]> => {
    const response = await fetch('/api', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      throw new Error('API Error');
    }
    const data = await response.json();
    return data.tasks || [];
  };

