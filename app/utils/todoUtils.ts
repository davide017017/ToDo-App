import { TodoType, SortOrderType, FilterByType } from '../page'; 

export const getSortedTodos = (todos: TodoType[], sortOrder: SortOrderType): TodoType[] => {
    let sortedTodos = [...todos];

    switch (sortOrder) {
        case 'alphaAsc':
            sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
            break;
        case 'alphaDesc':
            sortedTodos.sort((a, b) => b.text.localeCompare(b.text));
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
};

export const getFilteredTodos = (sortedTodos: TodoType[], filters: FilterByType, searchTerm: string): TodoType[] => { 
    let filteredTodos = [...sortedTodos]; 

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
};