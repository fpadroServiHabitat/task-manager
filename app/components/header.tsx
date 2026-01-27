import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="w-[90%] p-[1%] h-20 border-2 border-solid border-purple-300 bg-purple-200 dark:border-purple-600 dark:bg-purple-800 text-purple-400 dark:text-purple-200 top-0 right-0 flex justify-between items-center">
      <h1 className="text-xl font-bold" >Task Manager</h1>
      <ThemeToggle />
    </header>
  );
}