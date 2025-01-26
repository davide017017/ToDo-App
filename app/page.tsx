'use client';
import { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = 'todos';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [itemsToRemove, setItemsToRemove] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Caricamento dei todo dalla localStorage (con gestione errori e controllo tipo)
  useEffect(() => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(storedTodos)) {
        setTodos(storedTodos);
      } else {
        console.error("Dati corrotti nella localStorage. Inizializzo a vuoto.");
        localStorage.removeItem(STORAGE_KEY);
        setTodos([]);
        setError("I dati salvati precedentemente erano corrotti e sono stati resettati.");
      }
    } catch (error) {
      console.error('Errore nel caricamento dei todo dalla localStorage:', error);
      setTodos([]);
      setError("Si è verificato un errore nel caricamento dei todo.");
    }
  }, [STORAGE_KEY]);

  // Salvataggio dei todo nella localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Errore nel salvataggio dei todo nella localStorage:', error);
      setError("Si è verificato un errore nel salvataggio dei todo.");
    }
  }, [todos]);

  const addTodo = () => {
    const trimmedTodo = newTodo.trim();
    if (trimmedTodo) {
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: crypto.randomUUID(), text: trimmedTodo, completed: false },
      ]);
      setNewTodo('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setItemsToRemove(prev => [...prev, id]);
    setTimeout(() => {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      setItemsToRemove(prev => prev.filter(item => item !== id));
    }, 500); // Timeout per la transizione
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-6 rounded-lg shadow-md max-w-2xl w-full bg-blue-200 mx-auto mt-3">
        <h2 className="text-2xl font-semibold text-center">Elenco Attività</h2>
      </header>

      <main className="p-6 rounded-lg shadow-md max-w-md w-full bg-white mx-auto mt-4 mb-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <strong className="font-bold">Errore!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex space-x-2 mb-6">
          <label htmlFor="new-todo" className="sr-only">Aggiungi un nuovo todo</label>
          <input
            type="text"
            id="new-todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Aggiungi alla lista ..."
            className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button onClick={addTodo} className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
            Aggiungi
          </button>
        </div>

        {todos.length === 0 && <p className="text-center text-gray-500">Lista vuota</p>}

        <ul className="space-y-2 max-h-screen overflow-y-auto overflow-x-hidden"> 
          {todos.map((todo, index) => {
            const isRemoving = itemsToRemove.includes(todo.id);
            return (
              <li
                key={todo.id}
                className={`p-3 flex items-center justify-between rounded shadow-sm hover:shadow-md transition-all duration-300
                  ${todo.completed
                    ? 'bg-green-100 border-green-300 text-gray-400 line-through opacity-70'
                    : `${index % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'} border border-gray-300 text-gray-600`
                  }
                  ${isRemoving ? 'opacity-0 translate-x-full bg-red-200' : ''}
                `}
                style={{
                  transitionProperty: 'opacity, transform',
                }}
              >
                <div className="flex items-start w-full"> 
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="cursor-pointer flex items-center justify-center w-7 h-7 rounded hover:animate-pulse hover:scale-105 focus:outline-none relative shrink-0"
                    aria-label={todo.completed ? "Segna come non completato" : "Segna come completato"}
                  >
                    {!todo.completed && <div className="absolute inset-0 rounded-full border border-gray-400"></div>}
                    {todo.completed && <CheckIcon className="w-8 h-8 text-green-500" />}
                  </button>
                  <span className="px-2 flex-grow break-anywhere">{todo.text}</span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Elimina ${todo.text}`}
                  className="text-red-400 hover:text-red-800 hover:animate-spin focus:outline-none shrink-0"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}