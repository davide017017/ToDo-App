'use client';
import { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/solid';
import { AdjustmentsHorizontalIcon, ArrowDownIcon, ArrowUpIcon, ClockIcon, NewspaperIcon, InboxIcon, MagnifyingGlassIcon,NumberedListIcon } from '@heroicons/react/24/outline'; // Importa l'icona

import backgroundImage from './styles/PAPER.jpg'; 

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
  const [sortOrder, setSortOrder] = useState<'alphaAsc' | 'alphaDesc' | 'recent' | 'oldest'>('oldest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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
      const filteredTodos = todos.filter((todo) => {
        const textMatch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
        if (!filters.completed && !filters.inProgress) return textMatch;
        if (filters.completed && !filters.inProgress) return textMatch && todo.completed;
        if (!filters.completed && filters.inProgress) return textMatch && !todo.completed;
        return textMatch; 
      });

    let sortedTodos = [...filteredTodos]; 

    switch (sortOrder) {
      case 'oldest':
        break; // Ordine per ID crescente (aggiunto di default)
      case 'recent':
        sortedTodos.reverse(); // Inverte l'ordine per ID decrescente
        break;
      case 'alphaAsc':
        sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'alphaDesc':
        sortedTodos.sort((a, b) => b.text.localeCompare(a.text)); // Ordine alfabetico decrescente
        break;
      }
      return sortedTodos;
    });
  }, [todos, searchTerm, filters, sortOrder]);

  const sortOrderIcons = {
    recent: <NewspaperIcon className="h-5 w-5" />,
    oldest: <ClockIcon className="h-5 w-5 rotate-180" />, // Ruota l'icona dell'orologio di 180 gradi
    alphaAsc: <ArrowDownIcon className="h-5 w-5" />,
    alphaDesc: <ArrowUpIcon className="h-5 w-5" />,
  };

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
    }, 400);
  };

  const handleFilterChange = (filterName: 'completed' | 'inProgress') => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: !prevFilters[filterName] }));
  };

  const toggleSortDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  const handleSortOrderChange = (newOrder: 'recent' | 'oldest' | 'alphaAsc' | 'alphaDesc') => {
      setSortOrder(newOrder);
      setShowSortDropdown(false);
  };

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

return (
  <div className="flex flex-col min-h-screen">
    <main className="p-6 rounded-lg shadow-md max-w-md w-full mx-auto mt-4 mb-4"
      style={{ 
        backgroundImage: `url(${backgroundImage.src})`, 
        backgroundRepeat: 'repeat', 
        backgroundSize: 'contain', 
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}
    >
      <div className="flex space-x-2">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()} 
          placeholder="Aggiungi alla lista ..."
          className="p-1 border border-blue-800 rounded  w-full focus:ring-2 focus:ring-blue-600 outline-none text-black"
        />
        <button
          onClick={addTodo}
          className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white font-medium py-2 px-3 rounded-md inline-flex items-center" 
        >
          Aggiungi
          <PlusIcon className="h-5 w-5 ml-2" aria-hidden="true" /> 
        </button>
      </div>

      <div className="mt-2 mb-4 flex items-center justify-between relative"> 
        <div className="flex items-center space-x-2">
          <button onClick={toggleSortDropdown} onBlur={() => setTimeout(() => setShowSortDropdown(false), 100)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-md p-2 transition-colors duration-300 flex items-center">
            <NumberedListIcon className="h-5 w-5 mx-2" />
            <span >Ordina: </span>
            <span className='mx-2'>{sortOrderIcons[sortOrder]}</span>
          </button>

          {showSortDropdown && (
            <div className="absolute top-full left-0 z-10 w-48 bg-white rounded-md shadow-lg border border-gray-300 transition-opacity duration-300 animate-fade-in">
              <button onClick={() => handleSortOrderChange('recent')} className={`w-full text-left py-2 px-3 hover:bg-gray-100 transition-colors duration-300 text-sm flex items-center ${sortOrder === 'recent' ? 'bg-gray-200' : ''}`}>
                <NewspaperIcon className="h-4 w-4 mr-2" />
                <span>Più recenti</span>
              </button>
              <button onClick={() => handleSortOrderChange('oldest')} className={`w-full text-left py-2 px-3 hover:bg-gray-100 transition-colors duration-300 text-sm flex items-center ${sortOrder === 'oldest' ? 'bg-gray-200' : ''}`}>
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>Più vecchi</span>
              </button>
              <button onClick={() => handleSortOrderChange('alphaAsc')} className={`w-full text-left py-2 px-3 hover:bg-gray-100 transition-colors duration-300 text-sm flex items-center ${sortOrder === 'alphaAsc' ? 'bg-gray-200' : ''}`}>
                <ArrowDownIcon className="h-4 w-4 mr-2" />
                <span>A-Z</span>
              </button>
              <button onClick={() => handleSortOrderChange('alphaDesc')} className={`w-full text-left py-2 px-3 hover:bg-gray-100 transition-colors duration-300 text-sm flex items-center ${sortOrder === 'alphaDesc' ? 'bg-gray-200' : ''}`}>
                <ArrowUpIcon className="h-4 w-4 mr-2" />
                <span>Z-A</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full flex justify-between items-center ml-2 py-2 px-2 rounded transition-colors duration-300
              ${(filters.completed || filters.inProgress || searchTerm !== '')
                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border border-yellow-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
              }`}
          >
            <span className="font-medium">{showFilters ? "Nascondi Filtri" : "Mostra Filtri"}</span>
            <div className="flex items-center"> 
                {(filters.completed || filters.inProgress || searchTerm !== '') && (
                    <span className='text-xs text-yellow-600 mr-1'>Filtri Attivi</span>
                )}
              <AdjustmentsHorizontalIcon className="h-5 w-5" /> 
            </div>
          </button>

          {(filters.completed || filters.inProgress || searchTerm !== '') && !showFilters && (
            <div className="text-sm text-gray-700 mb-2 p-3 bg-gray-50 rounded border border-gray-200 flex flex-wrap gap-2 items-center">
              <span className="font-medium mr-1">Filtri:</span>
              {searchTerm && <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">Ricerca: "{searchTerm}" <button onClick={() => setSearchTerm('')} className='ml-1 text-red-500'>X</button></span>}
              {filters.completed && <span className="px-2 py-1 bg-green-200 rounded-full text-xs">Completati <button onClick={() => handleFilterChange('completed')} className='ml-1 text-red-500'>X</button></span>}
              {filters.inProgress && <span className="px-2 py-1 bg-blue-200 rounded-full text-xs">In Corso <button onClick={() => handleFilterChange('inProgress')} className='ml-1 text-red-500'>X</button></span>}
            </div>
          )}
        </div>
      </div>

      <div className={`pb-2 transition-all duration-500 ease-in-out overflow-hidden ${showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-yellow-100 border border-yellow-300 rounded shadow-sm p-4">
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Cerca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-mono border border-orange-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button
              onClick={() => setShowFilters(false)}
              className="text-orange-600 hover:text-orange-800 hover:animate-spin focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex justify-between ">
            <label className="inline-flex items-center cursor-pointer">
              <div
                className={`relative w-6 h-6 rounded-md border-2 border-gray-300 mr-2 transition-all duration-200 ${
                  filters.completed
                    ? 'bg-green-800 border-green-600 ring-2 ring-green-200'
                    : 'hover:border-gray-400'
                }`}
                style={{ 
                  boxShadow: filters.completed ? '0 0 10px 5px rgba(74, 222, 128, 0.7)' : 'none', 
                }}
                onClick={() => handleFilterChange('completed')}
              >
                {filters.completed && <CheckIcon className="absolute inset-0 w-full h-full text-white" />}
              </div>
              <span className="text-gray-700">Fatto</span>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <div
                className={`relative w-6 h-6 rounded-md border-2 border-gray-300 mr-2 transition-all duration-200 ${
                  filters.inProgress
                    ? 'bg-blue-800 border-blue-600 ring-2 ring-blue-200'
                    : 'hover:border-gray-400'
                }`}
                style={{
                  boxShadow: filters.inProgress ? '0 0 10px 5px rgba(59, 130, 246, 0.7)' : 'none', 
                }}
                onClick={() => handleFilterChange('inProgress')}
              >
                {filters.inProgress && <ClockIcon className="absolute inset-0 w-full h-full text-white" />}
              </div>
              <span className="text-gray-700">In Corso..</span>
            </label>
          </div>
        </div>
      </div>

      {displayedTodos.length === 0 && searchTerm && ( // Mostra solo se c'è un termine di ricerca
        <div className="text-center text-gray-600 border border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50">
          <MagnifyingGlassIcon className="h-10 w-10 mb-3 text-gray-500" />
          <span className="font-medium">Nessun risultato trovato per "{searchTerm}"</span>
          <span className="text-sm text-gray-500 mt-1">Prova a modificare i criteri di ricerca.</span>
        </div>
      )}

      {displayedTodos.length === 0 && !searchTerm && ( // se non ce un termine di ricerca
        <div className="text-center text-gray-600 border border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50">
          <InboxIcon className="h-10 w-10 mb-3 text-gray-500" />
          <span className="font-medium">Nessun elemento nella lista.</span>
          <span className="text-sm text-gray-500 mt-1">Aggiungi un nuovo elemento per iniziare.</span>
        </div>
      )}

      <ul className="space-y-2 max-h-screen overflow-y-auto overflow-x-hidden border-t-4 pt-2 shadow-sm border-blue-900">
        {displayedTodos.map((todo, index) => {
          const isRemoving = itemsToRemove.includes(todo.id);
          return (
            <li
              key={todo.id}
              className={`font-mono p-3 flex items-center justify-between rounded shadow-sm hover:shadow-md transition-all duration-300
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