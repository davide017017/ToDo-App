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
  const [displayedTodos, setDisplayedTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [itemsToRemove, setItemsToRemove] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ completed: false, inProgress: false });
  const [showFilters, setShowFilters] = useState(false);

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
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Errore nel salvataggio dei todo nella localStorage:', error);
      setError("Si è verificato un errore nel salvataggio dei todo.");
    }
  }, [todos]);

  useEffect(() => {
    setDisplayedTodos(() => {
        return todos.filter((todo) => {
            const textMatch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
            if (!filters.completed && !filters.inProgress) return textMatch;
            if (filters.completed && !filters.inProgress) return textMatch && todo.completed;
            if (!filters.completed && filters.inProgress) return textMatch && !todo.completed;
            return textMatch; // semplificato: se entrambi sono true, mostra comunque
        });
    });
}, [todos, searchTerm, filters]);

  const addTodo = () => {
    const trimmedTodo = newTodo.trim();
    if (trimmedTodo) {
      setTodos((prevTodos) => [...prevTodos, { id: crypto.randomUUID(), text: trimmedTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id: string) => {
    setItemsToRemove((prev) => [...prev, id]);
    setTimeout(() => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setItemsToRemove((prev) => prev.filter((item) => item !== id));
    }, 500);
  };

  const handleFilterChange = (filterName: 'completed' | 'inProgress') => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: !prevFilters[filterName] }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-6 rounded-lg shadow-md max-w-md w-full bg-white mx-auto mt-4 mb-4">
        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            id="new-todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()} // Condensato l'handler
            placeholder="Aggiungi alla lista ..."
            className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button onClick={addTodo} className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
            Aggiungi
          </button>
        </div>

        <div className="mb-4">
          <button onClick={() => setShowFilters(!showFilters)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mb-2">
            {showFilters ? "Nascondi Filtri" : "Mostra Filtri"}
          </button>

          {showFilters && (
            <div>
              <input
                type="text"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={filters.completed} onChange={() => handleFilterChange('completed')} className="form-checkbox h-5 w-5 text-blue-600" />
                  <span className="ml-2">Completati</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={filters.inProgress} onChange={() => handleFilterChange('inProgress')} className="form-checkbox h-5 w-5 text-blue-600" />
                  <span className="ml-2">In Corso</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {displayedTodos.length === 0 && <p className="text-center text-gray-500">Nessun elemento trovato</p>}

        <ul className="space-y-2 max-h-screen overflow-y-auto overflow-x-hidden">
          {displayedTodos.map((todo, index) => {
            const isRemoving = itemsToRemove.includes(todo.id);
            return (
              <li
                key={todo.id}
                className={`p-3 flex items-center justify-between rounded shadow-sm hover:shadow-md transition-all duration-300
                  ${todo.completed ? 'bg-green-100 border-green-300 text-gray-400 line-through opacity-70' : `${index % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'} border border-gray-300 text-gray-600`}
                  ${isRemoving ? 'opacity-0 translate-x-full bg-red-200' : ''}`}
                style={{ transitionProperty: 'opacity, transform' }}
              >
                <div className="flex items-start w-full">
                  <button onClick={() => toggleTodo(todo.id)} className="cursor-pointer flex items-center justify-center w-7 h-7 rounded hover:animate-pulse hover:scale-105 focus:outline-none relative shrink-0" aria-label={todo.completed ? "Segna come non completato" : "Segna come completato"}>
                    {!todo.completed && <div className="absolute inset-0 rounded-full border border-gray-400"></div>}
                    {todo.completed && <CheckIcon className="w-8 h-8 text-green-500" />}
                  </button>
                  <span className="px-2 flex-grow break-anywhere">{todo.text}</span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} aria-label={`Elimina ${todo.text}`} className="text-red-400 hover:text-red-800 hover:animate-spin focus:outline-none shrink-0">
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