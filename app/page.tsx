'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TodoListTabs from './components/TodoList/TodoListTabs';
import ListManagementControls from './components/TodoList/ListManagementControls';
import EmptyListMessage from './components/TodoList/EmptyListMessage';
import TodoItem from './components/TodoList/TodoItem';
import ConfirmationDialog from './components/UI/ConfirmationDialog';
import { BarsArrowUpIcon, ListBulletIcon, BarsArrowDownIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';import TodoInput from './components/TodoList/TodoInput';
import paperTextureImage from './styles/images/PAPER.jpg';
import { getSortedTodos, getFilteredTodos } from './utils/todoUtils';
import SortAndFilterControls from './components/Sort/SortAndFilterControls';

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
    // --- SEZIONE: STATI DELL'APPLICAZIONE ---
    const [todoLists, setTodoLists] = useState<TodoList[]>(() => {
        return [{ id: uuidv4(), name: 'Lista Predefinita', todos: [] }];
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
        alphaAsc: <BarsArrowDownIcon className="h-4 w-4 align-middle" aria-hidden="true" />,
        alphaDesc: <BarsArrowUpIcon className="h-4 w-4 align-middle" aria-hidden="true" />,
        recent: <ListBulletIcon className="h-4 w-4 align-middle" aria-hidden="true" />,
        oldest: <CalendarDaysIcon className="h-4 w-4 align-middle" aria-hidden="true" />,
    });

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterByType>({ completed: false, incomplete: false });
    const [searchTerm, setSearchTerm] = useState('');

    const [isListManagementVisible, setIsListManagementVisible] = useState(false);
    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);

    // --- SEZIONE: EFFETTI (useEffect) ---
    useEffect(() => {
        const savedLists = localStorage.getItem('todoListsApp017');
        if (savedLists) {
            setTodoLists(JSON.parse(savedLists));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todoListsApp017', JSON.stringify(todoLists));
    }, [todoLists]);

    // --- SEZIONE: GESTIONE LISTE TODO ---
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
            setIsRenamingList(false);
        }
    }, [todoLists, currentListId, currentListName, setTodoLists, setIsRenamingList]);

    const deleteCurrentTodoList = useCallback(() => {
        if (currentListId) {
            const updatedLists = todoLists.filter(list => list.id !== currentListId);
            setTodoLists(updatedLists);
            setCurrentListId(updatedLists.length > 0 ? updatedLists[0].id : null);
            setIsDeleteConfirmationVisible(false);
        }
    }, [todoLists, currentListId, setTodoLists, setCurrentListId, setIsDeleteConfirmationVisible]);

    // --- SEZIONE: GESTIONE TODO ITEMS ---
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
            setItemsToRemove(prevItems => [...prevItems, idToDelete]);
            const updateTodoListAfterAnimation = () => { 
                const updatedLists = todoLists.map(list => {
                    if (list.id === currentListId) {
                        const updatedTodos = list.todos.filter(todo => todo.id !== idToDelete);
                        return { ...list, todos: updatedTodos };
                    }
                    return list;
                });
                setTodoLists(updatedLists);
                setItemsToRemove(prevItems => prevItems.filter(id => id !== idToDelete));
            };
            setTimeout(updateTodoListAfterAnimation, 300);
        }
    }, [todoLists, currentListId, setTodoLists, setItemsToRemove]);

    // --- SEZIONE: GESTIONE FINESTRE DI CONFERMA ---
    const showDeleteConfirmation = useCallback(() => { setIsDeleteConfirmationVisible(true); }, [setIsDeleteConfirmationVisible]);
    const hideDeleteConfirmation = useCallback(() => { setIsDeleteConfirmationVisible(false); }, [setIsDeleteConfirmationVisible]);

    // --- SEZIONE: GESTIONE ORDINAMENTO E FILTRI ---
    const toggleSortDropdown = useCallback(() => { setShowSortDropdown(!showSortDropdown); }, [setShowSortDropdown, showSortDropdown]);

    const handleSortOrderChange = useCallback((newOrder: SortOrderType) => {
        setSortOrder(newOrder);
        setShowSortDropdown(false);
    }, [setSortOrder, setShowSortDropdown]);

    const handleFilterChange = useCallback((filterName: keyof FilterByType, isEnabled: boolean) => {
        setFilters(prevFilters => ({ ...prevFilters, [filterName]: isEnabled }));
    }, [setFilters]);

    // --- SEZIONE: OTTENIMENTO E FILTRAGGIO/ORDINAMENTO DELLE TODOs DA VISUALIZZARE ---
    const currentTodoList = currentListId ? todoLists.find(list => list.id === currentListId) : null;
    const currentTodos = currentTodoList ? currentTodoList.todos : [];

    const getSortedTodosMemoized = useCallback(() => {
        if (!currentTodos) return [];
        return getSortedTodos(currentTodos, sortOrder); 
    }, [currentTodos, sortOrder]);
    
    const getFilteredTodosMemoized = useCallback(() => {
        const sortedTodos = getSortedTodosMemoized();
        return getFilteredTodos(sortedTodos, filters, searchTerm);
    }, [getSortedTodosMemoized, filters, searchTerm]);
    
    const displayedTodos = getFilteredTodosMemoized();

    // Define the background image URL
    const backgroundPaperImageURL = `url(${paperTextureImage.src})`;

    // --- SEZIONE: RENDERING (JSX) ---
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
                <div className={`bg-repeat brightness-115 bg-[length:500px] rounded-t-md rounded-b-lg p-2 sm:p-4`} style={{ backgroundImage: backgroundPaperImageURL }}>
                    <TodoInput
                        newTodo={newTodo}
                        setNewTodo={setNewTodo}
                        addTodo={addTodo}
                    />
                    <SortAndFilterControls
                        sortOrder={sortOrder}
                        sortOrderIcons={sortOrderIcons}
                        toggleSortDropdown={toggleSortDropdown}
                        showSortDropdown={showSortDropdown}
                        handleSortOrderChange={handleSortOrderChange}
                        setShowSortDropdown={setShowSortDropdown}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        filters={filters}
                        setFilters={setFilters}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleFilterChange={handleFilterChange}
                    />
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