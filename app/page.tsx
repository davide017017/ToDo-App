'use client' 

import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TodoListTabs from './components/TodoList/TodoListTabs';
import ListManagementControls from './components/TodoList/ListManagementControls';
import SortControls from './components/Sort/SortControls';
import FilterControls from './components/Filter/FilterControls';
import EmptyListMessage from './components/TodoList/EmptyListMessage';
import TodoItem from './components/TodoList/TodoItem';
import ConfirmationDialog from './components/UI/ConfirmationDialog';
import { NumberedListIcon, ArrowDownIcon, ArrowUpIcon, Bars3BottomLeftIcon as AlphabeticalSortAscendingIcon, Bars3BottomRightIcon as AlphabeticalSortDescendingIcon, ClockIcon, BarsArrowUpIcon, ListBulletIcon, BarsArrowDownIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import TodoInput from './components/TodoList/TodoInput';
import paperTextureImage from './styles/images/PAPER.jpg'; // Assicurati che il percorso sia corretto

// Definisci i tipi per chiarezza
export type TodoType = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
};
export type TodoList = {
    id: string;
    name: string;
    todos: TodoType[];
};
export type SortOrderType = 'alphaAsc' | 'alphaDesc' | 'recent' | 'oldest';
export type FilterByType = {
    completed: boolean;
    incomplete: boolean;
};


export default function Page() {
    // Stati principali dell'applicazione
    const [todoLists, setTodoLists] = useState<TodoList[]>(() => {
        const savedLists = localStorage.getItem('todoLists');
        return savedLists ? JSON.parse(savedLists) : [{ id: uuidv4(), name: 'Lista Predefinita', todos: [] }];
    });
    const [currentListId, setCurrentListId] = useState<string | null>(todoLists[0]?.id || null);
    const [newListNameToCreate, setNewListNameToCreate] = useState('');
    const [isRenamingList, setIsRenamingList] = useState(false);
    const [currentListName, setCurrentListName] = useState('');

    const [newTodo, setNewTodo] = useState('');
    const [itemsToRemove, setItemsToRemove] = useState<string[]>([]);

    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOrderType>('recent');
    const [sortOrderIcons] = useState({
        alphaAsc: <BarsArrowDownIcon className="h-4 w-4 align-middle" aria-hidden="true" />,      // Icona A-Z
        alphaDesc: <BarsArrowUpIcon className="h-4 w-4 align-middle" aria-hidden="true" />,    // Icona Z-A
        recent: <ListBulletIcon className="h-4 w-4 align-middle" aria-hidden="true" />,        // Icona Più Recenti
        oldest: <CalendarDaysIcon className="h-4 w-4 align-middle" aria-hidden="true" />,      // Icona Meno Recenti
    });

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterByType>({ completed: false, incomplete: false });
    const [searchTerm, setSearchTerm] = useState('');

    const [isListManagementVisible, setIsListManagementVisible] = useState(false);
    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);


    // Effetto per salvare le liste TODO nel localStorage
    useEffect(() => {
        localStorage.setItem('todoLists', JSON.stringify(todoLists));
    }, [todoLists]);

    // Funzioni di gestione delle liste TODO

    const createNewTodoList = useCallback(() => {
        if (newListNameToCreate.trim()) {
            const newList: TodoList = { id: uuidv4(), name: newListNameToCreate, todos: [] };
            setTodoLists([...todoLists, newList]);
            setCurrentListId(newList.id);
            setNewListNameToCreate('');
        }
    }, [todoLists, newListNameToCreate, setTodoLists, setCurrentListId, setNewListNameToCreate, setIsListManagementVisible]);

    const renameCurrentTodoList = useCallback(() => {
        if (currentListId && currentListName.trim()) {
            const updatedLists = todoLists.map(list =>
                list.id === currentListId ? { ...list, name: currentListName } : list
            );
            setTodoLists(updatedLists);
            setIsRenamingList(false); // Esci dalla modalità rinomina
        }
    }, [todoLists, currentListId, currentListName, setTodoLists, setIsRenamingList]);


    const deleteCurrentTodoList = useCallback(() => {
        if (currentListId) {
            const updatedLists = todoLists.filter(list => list.id !== currentListId);
            setTodoLists(updatedLists);
            setCurrentListId(updatedLists.length > 0 ? updatedLists[0].id : null); // Se ci sono liste, seleziona la prima, altrimenti null
            setIsDeleteConfirmationVisible(false); // Chiudi finestra conferma
        }
    }, [todoLists, currentListId, setTodoLists, setCurrentListId, setIsDeleteConfirmationVisible]);


    const addTodo = useCallback(() => {
        if (currentListId && newTodo.trim()) {
            const newTodoItem: TodoType = { id: uuidv4(), text: newTodo, completed: false, createdAt: Date.now() };
            const updatedLists = todoLists.map(list =>
                list.id === currentListId ? { ...list, todos: [...list.todos, newTodoItem] } : list
            );
            setTodoLists(updatedLists);
            setNewTodo('');
        }
    }, [todoLists, currentListId, newTodo, setTodoLists, setNewTodo]);


    const toggleTodo = useCallback((idToToggle: string) => {
        if (currentListId) {
            const updatedLists = todoLists.map(list => {
                if (list.id === currentListId) {
                    const updatedTodos = list.todos.map(todo =>
                        todo.id === idToToggle ? { ...todo, completed: !todo.completed } : todo
                    );
                    return { ...list, todos: updatedTodos };
                }
                return list;
            });
            setTodoLists(updatedLists);
        }
    }, [todoLists, currentListId, setTodoLists]);


    const deleteTodo = useCallback((idToDelete: string) => {
        if (currentListId) {
            setItemsToRemove(prevItems => [...prevItems, idToDelete]); // Avvia animazione rimozione

            setTimeout(() => {
                const updatedLists = todoLists.map(list => {
                    if (list.id === currentListId) {
                        const updatedTodos = list.todos.filter(todo => todo.id !== idToDelete);
                        return { ...list, todos: updatedTodos };
                    }
                    return list;
                });
                setTodoLists(updatedLists);
                setItemsToRemove(prevItems => prevItems.filter(id => id !== idToDelete)); // Rimuovi id da itemsToRemove dopo l'animazione
            }, 300); // Durata animazione (in ms) - deve corrispondere al CSS transition
        }
    }, [todoLists, currentListId, setTodoLists, setItemsToRemove]);


    // Funzioni per mostrare/nascondere finestre di conferma
    const showDeleteConfirmation = useCallback(() => { setIsDeleteConfirmationVisible(true); }, [setIsDeleteConfirmationVisible]);
    const hideDeleteConfirmation = useCallback(() => { setIsDeleteConfirmationVisible(false); }, [setIsDeleteConfirmationVisible]);


    // Funzioni per ordinamento e filtri
    const toggleSortDropdown = useCallback(() => { setShowSortDropdown(!showSortDropdown); }, [setShowSortDropdown, showSortDropdown]);

    const handleSortOrderChange = useCallback((newOrder: SortOrderType) => {
        setSortOrder(newOrder);
        setShowSortDropdown(false); // Chiudi il dropdown dopo la selezione
    }, [setSortOrder, setShowSortDropdown]);


    const handleFilterChange = useCallback((filterName: keyof FilterByType, isEnabled: boolean) => {
        setFilters(prevFilters => ({ ...prevFilters, [filterName]: isEnabled }));
    }, [setFilters]);


    // Ottieni la lista TODO corrente
    const currentTodoList = currentListId ? todoLists.find(list => list.id === currentListId) : null;
    const currentTodos = currentTodoList ? currentTodoList.todos : [];


    // Funzione per ordinare le TODOs
    const getSortedTodos = useCallback(() => {
        let sortedTodos = [...currentTodos]; // copia array per non modificare l'originale

        switch (sortOrder) {
            case 'alphaAsc':
                sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'alphaDesc':
                sortedTodos.sort((a, b) => b.text.localeCompare(a.text));
                break;
            case 'recent':
                sortedTodos.sort((a, b) => b.createdAt - a.createdAt);
                break;
            case 'oldest':
                sortedTodos.sort((a, b) => a.createdAt - b.createdAt);
                break;
            default:
                break;
        }
        return sortedTodos;
    }, [sortOrder, currentTodos]);


    // Funzione per filtrare le TODOs
    const getFilteredTodos = useCallback(() => {
        let filteredTodos = getSortedTodos();

        if (filters.completed) {
            filteredTodos = filteredTodos.filter(todo => todo.completed);
        }
        if (filters.incomplete) {
            filteredTodos = filteredTodos.filter(todo => !todo.completed);
        }

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filteredTodos = filteredTodos.filter(todo => todo.text.toLowerCase().includes(lowerSearchTerm));
        }

        return filteredTodos;
    }, [getSortedTodos, searchTerm, filters]);


    // Ottieni le TODOs filtrate e ordinate per la visualizzazione
    const displayedTodos = getFilteredTodos();

    // Define the background image URL
    const backgroundPaperImageURL = `url(${paperTextureImage.src})`;


    return (
        <div className="flex flex-col min-h-screen bg-paper bg-cover w-full px-2 sm:px-4 lg:px-0 lg:max-w-lg lg:mx-auto ">
            <main className="w-full max-w-7xl mx-auto py-2 px-2 sm:py-6 sm:px-4 lg:px-8 lg:py-6">    
                <ListManagementControls
                    isListManagementVisible={isListManagementVisible}
                    setIsListManagementVisible={setIsListManagementVisible}
                    newListNameToCreate={newListNameToCreate}
                    setNewListNameToCreate={setNewListNameToCreate}
                    createNewTodoList={createNewTodoList}
                    isRenamingList={isRenamingList}
                    setIsRenamingList={setIsRenamingList}
                    currentListName={currentListName}
                    setCurrentListName={setCurrentListName}
                    renameCurrentTodoList={renameCurrentTodoList}
                    showDeleteConfirmation={showDeleteConfirmation}
                    newTodo={newTodo}
                    setNewTodo={setNewTodo}
                    addTodo={addTodo}
                    isDeleteConfirmationVisible={isDeleteConfirmationVisible}
                    hideDeleteConfirmation={hideDeleteConfirmation}
                    deleteCurrentTodoList={deleteCurrentTodoList}
                    todoLists={todoLists} 
                    currentListId={currentListId} 
                />

                <TodoListTabs
                    todoLists={todoLists}
                    currentListId={currentListId}
                    setCurrentListId={setCurrentListId}
                />

                <div className={`bg-repeat brightness-115 bg-[length:500px] rounded-lg p-2 sm:p-4`} style={{ backgroundImage: backgroundPaperImageURL }}>

                    <TodoInput
                        newTodo={newTodo}
                        setNewTodo={setNewTodo}
                        addTodo={addTodo} 
                    />

                    <div className="mt-2 mb-4 flex items-center justify-between relative">
                        <SortControls
                            sortOrder={sortOrder}
                            sortOrderIcons={sortOrderIcons}
                            toggleSortDropdown={toggleSortDropdown}
                            showSortDropdown={showSortDropdown}
                            handleSortOrderChange={handleSortOrderChange} 
                            setShowSortDropdown={setShowSortDropdown}
                        />
                        <FilterControls
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            filters={filters}
                            setFilters={setFilters}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            handleFilterChange={handleFilterChange}
                        />
                    </div>

                    <EmptyListMessage
                        searchTerm={searchTerm}
                        displayedTodos={displayedTodos}
                    />

                    <ul className="todo-list">
                        {displayedTodos.map((todo, index) => (
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

                </div>

                {isDeleteConfirmationVisible && (
                    <ConfirmationDialog
                        message={`Sei sicuro di voler eliminare la lista "${currentTodoList?.name || 'corrente'}"? Questa azione è irreversibile.`}
                        listName={currentTodoList?.name}
                        onConfirm={deleteCurrentTodoList}
                        onCancel={hideDeleteConfirmation}
                    />
                )}
            </main>
        </div>
    );
}