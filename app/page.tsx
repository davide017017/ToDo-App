'use client';
import React, { useState, useEffect, useCallback, JSX } from 'react';
import { XMarkIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/solid';
import {
    AdjustmentsHorizontalIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    ClockIcon,
    NewspaperIcon,
    InboxIcon,
    MagnifyingGlassIcon,
    NumberedListIcon,
    ClipboardIcon, // Importa l'icona ClipboardListIcon per il bottone di gestione liste
} from '@heroicons/react/24/outline';
import ConfirmationDialog from './components/ConfirmationDialog'; // o il percorso corretto

import backgroundImage from './styles/PAPER.jpg';
import TodoListTabs from './components/TodoListTabs';

// Constants - Costanti globali per lo stile e la funzionalità dell'applicazione
const STORAGE_KEY_LISTS = 'todos-app-lists-key'; // Costante per la chiave di storage delle liste (aggiornata per le liste multiple)
const TRANSITION_DURATION = 400; // Durata delle transizioni in millisecondi (es. rimozione todo)
const FILTER_ACTIVE_CLASS = 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border border-yellow-300'; // Classe CSS per i filtri attivi
const FILTER_INACTIVE_CLASS = 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'; // Classe CSS per i filtri inattivi
const HIGHLIGHTED_FILTER_TEXT_CLASS = 'text-xs text-yellow-600 mr-1'; // Classe CSS per evidenziare il testo dei filtri attivi
const FILTER_BADGE_CLASS_PREFIX = 'px-2 py-1 rounded-full text-xs'; // Prefisso classe CSS per i badge dei filtri applicati
const FILTER_BADGE_REMOVE_BUTTON_CLASS = 'ml-1 text-red-500'; // Classe CSS per il pulsante di rimozione nei badge dei filtri
const FILTER_CONTAINER_TRANSITION_CLASSES = "pb-2 transition-all duration-500 ease-in-out overflow-hidden"; // Classi CSS per la transizione del contenitore dei filtri (apertura/chiusura)
const FILTER_CONTAINER_OPEN_CLASSES = 'max-h-[500px] opacity-100'; // Classi CSS per il contenitore dei filtri quando è aperto
const FILTER_CONTAINER_CLOSED_CLASSES = 'max-h-0 opacity-0'; // Classi CSS per il contenitore dei filtri quando è chiuso
const SORT_DROPDOWN_TRANSITION_CLASSES = "absolute top-full left-0 z-10 w-48 bg-white text-black rounded-md shadow-lg border border-gray-300 transition-opacity duration-300 animate-fade-in"; // Classi CSS per la transizione del dropdown di ordinamento
const SORT_BUTTON_BASE_CLASSES = "w-full text-left py-2 px-3 hover:bg-gray-100 transition-colors duration-300 text-sm flex items-center"; // Classi CSS di base per i pulsanti nel dropdown di ordinamento
const SORT_BUTTON_ACTIVE_CLASS = 'bg-gray-200'; // Classe CSS per evidenziare il pulsante di ordinamento attivo
const EMPTY_LIST_CONTAINER_CLASS = "text-center text-gray-600 border border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50"; // Classe CSS per il contenitore del messaggio di lista vuota
const TODO_ITEM_BASE_CLASSES = "font-mono p-3 flex items-center justify-between rounded shadow-sm hover:shadow-md transition-all duration-300"; // Classi CSS di base per ogni elemento todo nella lista
const TODO_ITEM_COMPLETED_CLASSES = 'bg-green-100 border-green-300 text-gray-400 line-through opacity-70'; // Classi CSS per gli elementi todo completati
const TODO_ITEM_EVEN_CLASSES = 'bg-blue-50 border border-gray-300 text-gray-600'; // Classi CSS per gli elementi todo pari (stilizzazione alternata)
const TODO_ITEM_ODD_CLASSES = 'bg-blue-100 border border-gray-300 text-gray-600'; // Classi CSS per gli elementi todo dispari (stilizzazione alternata)
const TODO_ITEM_REMOVING_CLASSES = 'opacity-0 translate-x-full bg-red-200'; // Classi CSS per l'animazione di rimozione degli elementi todo
const CHECK_BUTTON_BASE_CLASSES = "cursor-pointer flex items-center justify-center w-7 h-7 rounded hover:animate-pulse hover:scale-105 focus:outline-none relative shrink-0"; // Classi CSS di base per il pulsante di check/uncheck delle todo
const CHECK_BUTTON_BORDER_CLASS = "absolute inset-0 rounded-full border border-gray-400"; // Classe CSS per il bordo del pulsante di check (stato non completato)
const DELETE_BUTTON_BASE_CLASSES = "text-red-400 hover:text-red-800 hover:animate-spin focus:outline-none shrink-0"; // Classi CSS di base per il pulsante di eliminazione delle todo


// Interfaces - Definizioni delle interfacce per TypeScript
interface Todo {
    id: string; // Identificatore univoco per la todo
    text: string; // Testo/descrizione della todo
    completed: boolean; // Stato di completamento della todo (true se completata, false altrimenti)
}

export interface TodoList { // Nuova interfaccia per rappresentare una lista di todo
    id: string;      // Identificatore univoco per la lista
    name: string;    // Nome della lista (es. "Lista Spesa")
    todos: Todo[];   // Array di todo appartenenti a questa lista
}

// Icon Component Mapping for Sorting - Mappatura delle icone per l'ordinamento
const sortOrderIcons = {
    recent: <NewspaperIcon className="h-5 w-5" />, // Icona per ordinamento "Più recenti"
    oldest: <ClockIcon className="h-5 w-5 rotate-180" />, // Icona per ordinamento "Più vecchi"
    alphaAsc: <ArrowDownIcon className="h-5 w-5" />, // Icona per ordinamento alfabetico A-Z
    alphaDesc: <ArrowUpIcon className="h-5 w-5" />, // Icona per ordinamento alfabetico Z-A
};

// --- Sub Components --- Componenti secondari dell'applicazione

// Input and Add Button Component - Componente per l'input di testo e il pulsante "Aggiungi"
const TodoInput = ({ newTodo, setNewTodo, addTodo }: { newTodo: string, setNewTodo: React.Dispatch<React.SetStateAction<string>>, addTodo: () => void }) => (
    <div className="flex space-x-2 mb-2">
        <input
            type="text"
            id="new-todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)} // Aggiorna lo stato `newTodo` con il valore dell'input
            onKeyDown={(e) => e.key === 'Enter' && addTodo()} // Al premere "Enter", aggiunge la todo
            placeholder="Aggiungi alla lista ..."
            className="p-1 border border-blue-800 rounded w-full focus:ring-2 focus:ring-blue-600 outline-none text-black"
        />
        <button
            onClick={addTodo} // Al click, esegue la funzione `addTodo` per aggiungere la nuova todo
            className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white font-medium py-2 px-3 rounded-md inline-flex items-center"
        >
            Aggiungi
            <PlusIcon className="h-5 w-5 ml-2" aria-hidden="true" />
        </button>
    </div>
);

// Sort Dropdown Component - Componente per il dropdown dell'ordinamento
const SortDropdown = ({ showSortDropdown, sortOrder, handleSortOrderChange }: { showSortDropdown: boolean, sortOrder: 'alphaAsc' | 'alphaDesc' | 'recent' | 'oldest', handleSortOrderChange: (newOrder: 'recent' | 'oldest' | 'alphaAsc' | 'alphaDesc') => void }) => (
    showSortDropdown && ( // Mostra il dropdown solo se `showSortDropdown` è true
        <div className={SORT_DROPDOWN_TRANSITION_CLASSES}>
            <button onClick={() => handleSortOrderChange('recent')} className={`${SORT_BUTTON_BASE_CLASSES} ${sortOrder === 'recent' ? SORT_BUTTON_ACTIVE_CLASS : ''}`}>
                <NewspaperIcon className="h-4 w-4 mr-2" />
                <span>Più recenti</span>
            </button>
            <button onClick={() => handleSortOrderChange('oldest')} className={`${SORT_BUTTON_BASE_CLASSES} ${sortOrder === 'oldest' ? SORT_BUTTON_ACTIVE_CLASS : ''}`}>
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>Più vecchi</span>
            </button>
            <button onClick={() => handleSortOrderChange('alphaAsc')} className={`${SORT_BUTTON_BASE_CLASSES} ${sortOrder === 'alphaAsc' ? SORT_BUTTON_ACTIVE_CLASS : ''}`}>
                <ArrowDownIcon className="h-4 w-4 mr-2" />
                <span>A-Z</span>
            </button>
            <button onClick={() => handleSortOrderChange('alphaDesc')} className={`${SORT_BUTTON_BASE_CLASSES} ${sortOrder === 'alphaDesc' ? SORT_BUTTON_ACTIVE_CLASS : ''}`}>
                <ArrowUpIcon className="h-4 w-4 mr-2" />
                <span>Z-A</span>
            </button>
        </div>
    )
);


// Sort Controls Component - Componente per i controlli dell'ordinamento (pulsante + dropdown)
const SortControls = ({ sortOrder, sortOrderIcons, toggleSortDropdown, showSortDropdown, handleSortOrderChange }: { sortOrder: 'alphaAsc' | 'alphaDesc' | 'recent' | 'oldest', sortOrderIcons: { [key: string]: JSX.Element }, toggleSortDropdown: () => void, showSortDropdown: boolean, handleSortOrderChange: (newOrder: 'recent' | 'oldest' | 'alphaAsc' | 'alphaDesc') => void }) => (
    <div className="flex items-center space-x-2">
        <button onClick={() => toggleSortDropdown()} onBlur={() => setTimeout(() => toggleSortDropdown(), 100)} // Apre/chiude il dropdown e lo chiude se perde il focus dopo 100ms
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-md p-2 transition-colors duration-300 flex items-center">
            <NumberedListIcon className="h-5 w-5 mx-2" />
            <span >Ordina: </span>
            <span className='mx-2'>{sortOrderIcons[sortOrder]}</span> {/* Icona che indica l'ordinamento corrente */}
        </button>
        <SortDropdown // Dropdown per selezionare il tipo di ordinamento
            showSortDropdown={showSortDropdown}
            sortOrder={sortOrder}
            handleSortOrderChange={handleSortOrderChange}
        />
    </div>
);


// Filter Controls Component - Componente per i controlli dei filtri (pulsante + pannello filtri)
const FilterControls = ({
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    handleFilterChange
}: {
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    filters: { completed: boolean; inProgress: boolean };
    setFilters: React.Dispatch<React.SetStateAction<{ completed: boolean; inProgress: boolean }>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    handleFilterChange: (filterName: 'completed' | 'inProgress') => void;
}) => {
    const hasActiveFilters = filters.completed || filters.inProgress || searchTerm !== ''; // Determina se ci sono filtri attivi

    return (
        <div className="">
            <button
                onClick={() => setShowFilters(!showFilters)} // Apre/chiude il pannello dei filtri
                className={`w-full flex justify-between items-center ml-2 py-2 px-2 rounded transition-colors duration-300 ${hasActiveFilters ? FILTER_ACTIVE_CLASS : FILTER_INACTIVE_CLASS}`}
            >
                <span className="font-medium">{showFilters ? "Nascondi Filtri" : "Mostra Filtri"}</span>
                <div className="flex items-center">
                    {hasActiveFilters && ( // Mostra "Filtri Attivi" se ci sono filtri applicati
                        <span className={HIGHLIGHTED_FILTER_TEXT_CLASS}>Filtri Attivi</span>
                    )}
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </div>
            </button>

            {hasActiveFilters && !showFilters && ( // Mostra un riassunto dei filtri attivi quando il pannello è chiuso
                <div className="text-sm text-gray-700 mb-2 p-3 bg-gray-50 rounded border border-gray-200 flex flex-wrap gap-2 items-center">
                    <span className="font-medium mr-1">Filtri:</span>
                    {searchTerm && <span className={`${FILTER_BADGE_CLASS_PREFIX} bg-gray-200`}>Ricerca: "{searchTerm}" <button onClick={() => setSearchTerm('')} className={FILTER_BADGE_REMOVE_BUTTON_CLASS}>X</button></span>}
                    {filters.completed && <span className={`${FILTER_BADGE_CLASS_PREFIX} bg-green-200`}>Completati <button onClick={() => handleFilterChange('completed')} className={FILTER_BADGE_REMOVE_BUTTON_CLASS}>X</button></span>}
                    {filters.inProgress && <span className={`${FILTER_BADGE_CLASS_PREFIX} bg-blue-200`}>In Corso <button onClick={() => handleFilterChange('inProgress')} className={FILTER_BADGE_REMOVE_BUTTON_CLASS}>X</button></span>}
                </div>
            )}

            <div className={`${FILTER_CONTAINER_TRANSITION_CLASSES} ${showFilters ? FILTER_CONTAINER_OPEN_CLASSES : FILTER_CONTAINER_CLOSED_CLASSES}`}> {/* Contenitore dei filtri, animato per apertura/chiusura */}
                <div className="bg-yellow-100 border border-yellow-300 rounded shadow-sm p-4 text-black">
                    <div className="flex justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Cerca..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Aggiorna il termine di ricerca
                            className="font-mono border border-orange-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-orange-500 outline-none text-black"
                        />
                        <button
                            onClick={() => setShowFilters(false)} // Chiude il pannello dei filtri
                            className="text-orange-600 hover:text-orange-800 hover:animate-spin focus:outline-none"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex justify-between ">
                        <label className="inline-flex items-center cursor-pointer">
                            <div
                                className={`relative w-6 h-6 rounded-md border-2 border-gray-300 mr-2 transition-all duration-200 ${filters.completed ? 'bg-green-800 border-green-600 ring-2 ring-green-200' : 'hover:border-gray-400'}`}
                                style={{ boxShadow: filters.completed ? '0 0 10px 5px rgba(74, 222, 128, 0.7)' : 'none' }} // Effetto ombra quando il filtro è attivo
                                onClick={() => handleFilterChange('completed')} // Attiva/disattiva il filtro "Completati"
                            >
                                {filters.completed && <CheckIcon className="absolute inset-0 w-full h-full text-white" />} {/* Icona di check se il filtro è attivo */}
                            </div>
                            <span className="text-gray-700">Fatto</span>
                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                            <div
                                className={`relative w-6 h-6 rounded-md border-2 border-gray-300 mr-2 transition-all duration-200 ${filters.inProgress ? 'bg-blue-800 border-blue-600 ring-2 ring-blue-200' : 'hover:border-gray-400'}`}
                                style={{ boxShadow: filters.inProgress ? '0 0 10px 5px rgba(59, 130, 246, 0.7)' : 'none' }} // Effetto ombra quando il filtro è attivo
                                onClick={() => handleFilterChange('inProgress')} // Attiva/disattiva il filtro "In Corso"
                            >
                                {filters.inProgress && <ClockIcon className="absolute inset-0 w-full h-full text-white" />} {/* Icona di orologio se il filtro è attivo */}
                            </div>
                            <span className="text-gray-700">In Corso..</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Todo Item Component - Componente per la visualizzazione di un singolo elemento todo
const TodoItem = ({ todo, index, toggleTodo, deleteTodo, itemsToRemove }: { todo: Todo, index: number, toggleTodo: (id: string) => void, deleteTodo: (id: string) => void, itemsToRemove: string[] }) => {
    const isRemoving = itemsToRemove.includes(todo.id); // Verifica se l'elemento è in fase di rimozione
    const itemClasses = [
        TODO_ITEM_BASE_CLASSES, // Classi di base
        todo.completed ? TODO_ITEM_COMPLETED_CLASSES : (index % 2 === 0 ? TODO_ITEM_EVEN_CLASSES : TODO_ITEM_ODD_CLASSES), // Classi per stato (completato/in corso) e stilizzazione alternata
        isRemoving ? TODO_ITEM_REMOVING_CLASSES : '' // Classe per l'animazione di rimozione
    ].join(' '); // Unisce le classi CSS in una stringa

    return (
        <li
            key={todo.id}
            className={itemClasses}
            style={{ transitionProperty: 'opacity, transform' }} // Specifica le proprietà CSS per la transizione
        >
            <div className="flex items-start w-full">
                <button onClick={() => toggleTodo(todo.id)} className={CHECK_BUTTON_BASE_CLASSES} aria-label={todo.completed ? "Segna come non completato" : "Segna come completato"}>
                    {!todo.completed && <div className={CHECK_BUTTON_BORDER_CLASS}></div>} {/* Bordo se non completato */}
                    {todo.completed && <CheckIcon className="w-8 h-8 text-green-500" />} {/* Icona di check se completato */}
                </button>
                <span className="px-2 flex-grow break-anywhere">{todo.text}</span> {/* Testo della todo */}
            </div>
            <button onClick={() => deleteTodo(todo.id)} aria-label={`Elimina ${todo.text}`} className={DELETE_BUTTON_BASE_CLASSES}>
                <XMarkIcon className="w-6 h-6" /> {/* Icona per eliminare la todo */}
            </button>
        </li>
    );
};

// Empty List Message Component - Componente per visualizzare messaggi di lista vuota (con o senza risultati di ricerca)
const EmptyListMessage = ({ searchTerm, displayedTodos }: { searchTerm: string, displayedTodos: Todo[] }) => {
    if (displayedTodos.length === 0 && searchTerm) { // Se la lista è vuota e c'è un termine di ricerca
        return (
            <div className={EMPTY_LIST_CONTAINER_CLASS}>
                <MagnifyingGlassIcon className="h-10 w-10 mb-3 text-gray-500" />
                <span className="font-medium">Nessun risultato trovato per "{searchTerm}"</span>
                <span className="text-sm text-gray-500 mt-1">Prova a modificare i criteri di ricerca.</span>
            </div>
        );
    }

    if (displayedTodos.length === 0 && !searchTerm) { // Se la lista è vuota e non c'è un termine di ricerca
        return (
            <div className={EMPTY_LIST_CONTAINER_CLASS}>
                <InboxIcon className="h-10 w-10 mb-3 text-gray-500" />
                <span className="font-medium">Nessun elemento nella lista.</span>
                <span className="text-sm text-gray-500 mt-1">Aggiungi un nuovo elemento per iniziare.</span>
            </div>
        );
    }
    return null; // Se la lista non è vuota, non mostra nessun messaggio
};


// --- Main Component ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function Home() {
    // State variables - Dichiarazione delle variabili di stato utilizzando `useState` hook
    const [todos, setTodos] = useState<Todo[]>([]); // Stato per la lista completa delle todos
    const [displayedTodos, setDisplayedTodos] = useState<Todo[]>([]); // Stato per le todos visualizzate (dopo filtri e ordinamento)
    const [newTodo, setNewTodo] = useState(''); // Stato per il testo della nuova todo da aggiungere
    const [itemsToRemove, setItemsToRemove] = useState<string[]>([]); // Stato per tenere traccia degli ID delle todo in fase di rimozione (per l'animazione)
    const [error, setError] = useState<string | null>(null); // Stato per gestire eventuali errori
    const [searchTerm, setSearchTerm] = useState(''); // Stato per il termine di ricerca
    const [filters, setFilters] = useState({ completed: false, inProgress: false }); // Stato per i filtri (completati, in corso)
    const [showFilters, setShowFilters] = useState(false); // Stato per controllare la visibilità del pannello dei filtri
    const [sortOrder, setSortOrder] = useState<'alphaAsc' | 'alphaDesc' | 'recent' | 'oldest'>('oldest'); // Stato per l'ordine di ordinamento
    const [showSortDropdown, setShowSortDropdown] = useState(false); // Stato per controllare la visibilità del dropdown di ordinamento
    const [todoLists, setTodoLists] = useState<TodoList[]>([]); // Stato per gestire un array di TodoList
    const [currentListId, setCurrentListId] = useState<string | null>(null); // Stato per tenere traccia dell'ID della lista corrente selezionata
    const [newListNameToCreate, setNewListNameToCreate] = useState(''); // Stato per il nome della nuova lista
    const [isRenamingList, setIsRenamingList] = useState(false); // Stato per controllare se la lista è in fase di rinomina
    const [currentListName, setCurrentListName] = useState(''); // Stato temporaneo per rinominare la lista
    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false); // NUOVO STATO per la finestra di conferma eliminazione
    const [isListManagementVisible, setIsListManagementVisible] = useState(false); // NUOVO STATO per controllare la visibilità del div di gestione liste


    // Load todo lists from localStorage
    useEffect(() => {
        try {
            const storedLists = JSON.parse(localStorage.getItem(STORAGE_KEY_LISTS) || '[]'); // Carica le liste dalla localStorage
            if (Array.isArray(storedLists)) {
                // Verifica se storedLists è un array e se ogni elemento è una TodoList valida
                const validatedLists = storedLists.map(list => ({
                    id: list.id || crypto.randomUUID(), // Assicura che ogni lista abbia un ID, generandone uno se manca
                    name: list.name || 'Lista senza nome', // Assicura che ogni lista abbia un nome, usando un default se manca
                    todos: Array.isArray(list.todos) ? list.todos : [] // Assicura che 'todos' sia un array, altrimenti usa un array vuoto
                })) as TodoList[];
                setTodoLists(validatedLists); // Imposta le liste validate nello stato
                if (validatedLists.length > 0) {
                    setCurrentListId(validatedLists[0].id); // Se ci sono liste, seleziona la prima come lista corrente
                } else {
                    // Se non ci sono liste salvate, crea una lista di default
                    const defaultList = { id: crypto.randomUUID(), name: 'Lista Principale', todos: [] };
                    setTodoLists([defaultList]);
                    setCurrentListId(defaultList.id);
                }
            } else {
                console.error("Dati corrotti nella localStorage per le liste. Inizializzo con una lista predefinita.");
                const defaultList = { id: crypto.randomUUID(), name: 'Lista Principale', todos: [] };
                setTodoLists([defaultList]);
                setCurrentListId(defaultList.id);
                localStorage.removeItem(STORAGE_KEY_LISTS); // Pulisce lo storage corrotto
                setError("I dati delle liste salvati precedentemente erano corrotti e sono stati resettati con una lista predefinita.");
            }
        } catch (loadError) {
            console.error('Errore nel caricamento delle liste dalla localStorage:', loadError);
            const defaultList = { id: crypto.randomUUID(), name: 'Lista Principale', todos: [] };
            setTodoLists([defaultList]);
            setCurrentListId(defaultList.id);
            setError("Si è verificato un errore nel caricamento delle liste. È stata creata una lista predefinita.");
        }
    }, []); // Esegue questo effetto solo alMount del componente (array di dipendenze vuoto)


    // Save todo lists to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(todoLists)); // Salva l'array di liste nella localStorage
        } catch (saveError) {
            console.error('Errore nel salvataggio delle liste nella localStorage:', saveError);
            setError("Si è verificato un errore nel salvataggio delle liste.");
        }
    }, [todoLists]); // Esegue l'effetto ogni volta che todoLists viene modificato

    // Update displayed todos based on filters, search term, and sort order - Effetto per aggiornare la lista delle todos visualizzate in base a filtri, ricerca e ordinamento
    useEffect(() => {
        const updateDisplayedTodos = () => {
            const currentList = todoLists.find(list => list.id === currentListId);
            if (!currentList) {
                setDisplayedTodos([]);
                return;
            }
    
            let filteredTodos = currentList.todos.filter(todo => {
                const textMatch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
                if (!filters.completed && !filters.inProgress) return textMatch;
                if (filters.completed && !filters.inProgress) return textMatch && todo.completed;
                if (!filters.completed && filters.inProgress) return textMatch && !todo.completed;
                return textMatch;
            });
    
            let sortedTodos = [...filteredTodos];
            switch (sortOrder) {
                case 'recent':
                    sortedTodos.reverse();
                    break;
                case 'alphaAsc':
                    sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
                    break;
                case 'alphaDesc':
                    sortedTodos.sort((a, b) => b.text.localeCompare(a.text));
                    break;
                case 'oldest':
                default:
                    break;
            }
            setDisplayedTodos(() => sortedTodos);
        };
        updateDisplayedTodos();
    }, [todoLists, currentListId, searchTerm, filters, sortOrder]);

    // Todo Actions - Funzioni per le azioni sulle todos, ottimizzate con `useCallback` per evitare ricreazioni inutili nei re-render

    const addTodo = useCallback(() => {
        const trimmedTodo = newTodo.trim(); // Rimuove spazi bianchi superflui dalla nuova todo
        if (trimmedTodo && currentListId) { // Verifica che ci sia testo e una lista corrente selezionata // Verifica se il testo della todo non è vuoto dopo aver rimosso gli spazi
            setTodoLists(prevLists =>
                prevLists.map(list => { // Mappa ogni lista nell'array precedente
                    if (list.id === currentListId) { // Se l'ID della lista corrisponde a currentListId
                        return { ...list, todos: [...list.todos, { id: crypto.randomUUID(), text: trimmedTodo, completed: false }] }; // Crea una nuova lista con la todo aggiunta
                    } else {
                        return list; // Altrimenti, restituisci la lista senza modifiche
                    }
                })
            );  // Aggiunge una nuova todo all'array `todos` con ID univoco, testo e stato "non completato"
            setNewTodo(''); // Resetta l'input di testo
        }
    }, [newTodo, setTodos, currentListId, setTodoLists]); // Dipendenze aggiornate per includere currentListId e setTodoLists


    const toggleTodo = useCallback((id: string) => {
        console.log("toggleTodo is called, currentListId:", currentListId, "todoId:", id); // Aggiungi console.log
        if (currentListId) {
            setTodoLists(prevLists =>
                prevLists.map(list => {
                    if (list.id === currentListId) {
                        return {
                            ...list,
                            todos: list.todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
                        };
                    } else {
                        return list;
                    }
                })
            );
        }
    }, [setTodoLists, currentListId]);

    const deleteTodo = useCallback((id: string) => {
        if (currentListId) { // Verifica che ci sia una lista corrente selezionata (currentListId valido)
            setItemsToRemove(prev => [...prev, id]); // Aggiunge l'ID della todo alla lista degli elementi da rimuovere (per l'animazione di rimozione)
            setTimeout(() => {
                setTodoLists(prevLists =>
                    prevLists.map(list => {
                        if (list.id === currentListId) { // Trova la lista corrente
                            return { ...list, todos: list.todos.filter(todo => todo.id !== id) }; // Filtra le todos della lista corrente, rimuovendo quella con l'id specificato
                        } else {
                            return list; // Se non è la lista corrente, la restituisce senza modifiche
                        }
                    })
                );
                setItemsToRemove(prev => prev.filter(item => item !== id)); // Pulisce la lista degli elementi in rimozione, togliendo l'id appena eliminato
            }, TRANSITION_DURATION); // Usa TRANSITION_DURATION per sincronizzare la rimozione con l'animazione
        }
    }, [setTodoLists, setItemsToRemove, currentListId]);


    const handleFilterChange = useCallback((filterName: 'completed' | 'inProgress') => {
        setFilters(prevFilters => ({ ...prevFilters, [filterName]: !prevFilters[filterName] })); // Inverte lo stato del filtro specificato (es. completed: true -> false, false -> true)
    }, [setFilters]); // Dipendenze di `handleFilterChange`: cambierà solo se cambia `setFilters`

    const toggleSortDropdown = useCallback((value?: boolean) => {
        setShowSortDropdown(prevShowSortDropdown => value !== undefined ? value : !prevShowSortDropdown); // Imposta la visibilità del dropdown di ordinamento. Accetta un valore booleano opzionale per forzare lo stato.
    }, [setShowSortDropdown]); // Dipendenze di `toggleSortDropdown`: cambierà solo se cambia `setShowSortDropdown`

    const handleSortOrderChange = useCallback((newOrder: 'recent' | 'oldest' | 'alphaAsc' | 'alphaDesc') => {
        setSortOrder(newOrder); // Aggiorna l'ordine di ordinamento nello stato
        setShowSortDropdown(false); // Chiude il dropdown di ordinamento dopo la selezione
    }, [setSortOrder, setShowSortDropdown]); // Dipendenze di `handleSortOrderChange`: cambierà solo se cambiano `setSortOrder` o `setShowSortDropdown`


    // Funzione per creare una nuova lista
    const createNewTodoList = useCallback(() => {
        const trimmedListName = newListNameToCreate.trim();
        if (trimmedListName) {
            const newList = { id: crypto.randomUUID(), name: trimmedListName, todos: [] };
            setTodoLists(prevLists => [...prevLists, newList]);
            setCurrentListId(newList.id); // Imposta la nuova lista come corrente
            setNewListNameToCreate(''); // Resetta l'input del nome della nuova lista
        }
    }, [setTodoLists, setCurrentListId, newListNameToCreate]);


    // Funzione per rinominare la lista corrente
    const renameCurrentTodoList = useCallback(() => {
        if (currentListId) {
            setTodoLists(prevLists =>
                prevLists.map(list =>
                    list.id === currentListId ? { ...list, name: currentListName.trim() } : list
                )
            );
            setIsRenamingList(false); // Disabilita la modalità di rinomina
        }
    }, [setTodoLists, currentListId, currentListName])

    useEffect(() => {
        // Effetto per inizializzare currentListName quando currentListId cambia
        const currentList = todoLists.find(list => list.id === currentListId);
        setCurrentListName(currentList?.name || ''); // Imposta il nome della lista corrente o una stringa vuota se non trovata
    }, [currentListId, todoLists]);

    const showDeleteConfirmation = useCallback(() => {
        setIsDeleteConfirmationVisible(true);
    }, [setIsDeleteConfirmationVisible]);

    // Funzione per nascondere la finestra di conferma
    const hideDeleteConfirmation = useCallback(() => {
        setIsDeleteConfirmationVisible(false);
    }, [setIsDeleteConfirmationVisible]);

    // Funzione per eliminare la lista corrente
    const deleteCurrentTodoList = useCallback(() => {
        if (currentListId) {
            setTodoLists(prevLists => {
                const updatedLists = prevLists.filter(list => list.id !== currentListId); // Filtra via la lista corrente
                if (updatedLists.length > 0) {
                    setCurrentListId(updatedLists[0].id); // Se ci sono altre liste, seleziona la prima
                } else {
                    setCurrentListId(null); // Se non ci sono più liste, resetta currentListId
                    // Opzionalmente, potresti creare qui una lista di default se vuoi che ci sia sempre almeno una lista
                }
                return updatedLists; // Restituisci la lista aggiornata senza la lista eliminata
            });
            hideDeleteConfirmation(); // Chiudi la finestra di conferma dopo l'eliminazione
        }
    }, [setTodoLists, setCurrentListId, currentListId, hideDeleteConfirmation]);


   // Funzione per mostrare/nascondere il div di gestione liste
    const toggleListManagementVisibility = useCallback(() => {
        setIsListManagementVisible(prev => !prev);
    }, [setIsListManagementVisible]);


    return (
        <div className="flex flex-col min-h-screen">
            <main className="p-6 rounded-lg shadow-md max-w-md w-full mx-auto mt-4 mb-4 main-container-trasparente" // Contenitore principale della app, con stili CSS e classi Tailwind
                style={{ // Stili inline per l'immagine di sfondo
                    backgroundImage: `url(${backgroundImage.src})`, // Usa l'immagine importata
                    backgroundRepeat: 'repeat', // Ripete l'immagine sia orizzontalmente che verticalmente
                    backgroundSize: 'contain', // Ridimensiona l'immagine per contenerla all'interno del contenitore, mantenendo le proporzioni
                }}
            >
                {/* Bottone per attivare/disattivare il div di gestione liste */}
                <div className="mb-2 flex justify-start"> {/* Modifica qui per allineare il bottone a sinistra o dove preferisci */}
                    <button
                        onClick={toggleListManagementVisibility}
                        className={`flex items-center py-2 px-3 rounded transition-colors duration-300 ${isListManagementVisible ? FILTER_ACTIVE_CLASS : FILTER_INACTIVE_CLASS}`} // Riutilizzo classi per coerenza stilistica
                    >
                        <ClipboardIcon className="h-5 w-5 mr-2" /> {/* Usa ViewListIcon o un'altra icona appropriata */}
                        Gestione Liste {/* Testo del bottone */}
                    </button>
                </div>

                {/* Div a scomparsa per la gestione delle liste */}
                <div className={`${FILTER_CONTAINER_TRANSITION_CLASSES} ${isListManagementVisible ? FILTER_CONTAINER_OPEN_CLASSES : FILTER_CONTAINER_CLOSED_CLASSES} mb-4`}>
                    <div className="bg-gray-50 border border-gray-200 rounded shadow-sm p-4"> {/* Stile del div a scomparsa */}


                        <div className="flex justify-between items-center mb-4">
                            {/* Input e pulsante per creare una nuova lista */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Nome nuova lista..."
                                    value={newListNameToCreate}
                                    onChange={(e) => setNewListNameToCreate(e.target.value)}
                                    className="p-1 border border-gray-300 rounded w-40 focus:ring-2 focus:ring-blue-500 outline-none text-black text-sm"
                                    onKeyDown={(e) => { // Aggiunto l'handler onKeyDown
                                        if (e.key === 'Enter') {
                                            e.preventDefault(); // Previeni il comportamento predefinito (opzionale ma consigliato)
                                            createNewTodoList(); // Chiama la funzione per creare la lista
                                        }
                                    }}
                                />
                                <button
                                    onClick={createNewTodoList}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded-md text-sm"
                                >
                                    Crea Lista
                                </button>
                            </div>

                            {/* Gestione rinomina lista corrente */}
                            {isRenamingList ? (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={currentListName}
                                        onChange={(e) => setCurrentListName(e.target.value)}
                                        className="p-1 border border-gray-300 rounded w-40 focus:ring-2 focus:ring-blue-500 outline-none text-black text-sm"
                                    />
                                    <button onClick={renameCurrentTodoList} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded-md text-sm">Salva Nome</button>
                                    <button onClick={() => setIsRenamingList(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-1 px-2 rounded-md text-sm">Annulla</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsRenamingList(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-1 px-2 rounded-md text-sm">Rinomina Lista</button>
                            )}

                            {/* Bottone Elimina Lista */}
                            <button
                                onClick={showDeleteConfirmation}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-2 rounded-md text-sm"
                            >
                                Elimina Lista
                            </button>
                        </div>
                    </div>
                </div>


                {/* Componente per i tabs di selezione della lista */}
                <TodoListTabs
                    todoLists={todoLists}
                    currentListId={currentListId}
                    setCurrentListId={setCurrentListId}
                />

                

                <TodoInput // Componente per l'input e l'aggiunta di nuove todo
                    newTodo={newTodo}
                    setNewTodo={setNewTodo}
                    addTodo={addTodo}
                />

                <div className="mt-2 mb-4 flex items-center justify-between relative">
                    <SortControls // Componente per i controlli di ordinamento
                        sortOrder={sortOrder}
                        sortOrderIcons={sortOrderIcons}
                        toggleSortDropdown={toggleSortDropdown}
                        showSortDropdown={showSortDropdown}
                        handleSortOrderChange={handleSortOrderChange}
                    />

                    <FilterControls // Componente per i controlli dei filtri
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        filters={filters}
                        setFilters={setFilters}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleFilterChange={handleFilterChange}
                    />
                </div>


                <EmptyListMessage searchTerm={searchTerm} displayedTodos={displayedTodos} /> {/* Componente per il messaggio di lista vuota, mostrato se necessario */}


                <ul className="todo-list">
                    {displayedTodos.map((todo, index) => ( // Mappa la lista delle todos visualizzate e renderizza `TodoItem` per ognuna
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            index={index}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                            itemsToRemove={itemsToRemove}
                        />
                    ))}
                </ul>

                {isDeleteConfirmationVisible && ( // Finestra di conferma eliminazione (fuori dal div a scomparsa, come era prima)
                    <ConfirmationDialog
                    // Modifica qui per passare il nome della lista corrente
                    message="Sei sicuro di voler eliminare la lista? Questa azione è irreversibile." // Messaggio generico di fallback
                    listName={todoLists.find(list => list.id === currentListId)?.name} // Passa il nome della lista corrente, se trovato
                    onConfirm={deleteCurrentTodoList}
                    onCancel={hideDeleteConfirmation}
                />
                )}

            </main>
        </div>
    );
}