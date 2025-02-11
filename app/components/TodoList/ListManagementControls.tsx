import React, { useState } from 'react'; // Importa useState

import { ListBulletIcon } from '@heroicons/react/24/outline';
import { TodoList } from '../../page';

interface ListManagementControlsProps {
    isListManagementVisible: boolean;
    setIsListManagementVisible: React.Dispatch<React.SetStateAction<boolean>>;
    newListNameToCreate: string;
    setNewListNameToCreate: React.Dispatch<React.SetStateAction<string>>;
    createNewTodoList: () => void;
    isRenamingList: boolean;
    setIsRenamingList: React.Dispatch<React.SetStateAction<boolean>>;
    currentListName: string;
    setCurrentListName: React.Dispatch<React.SetStateAction<string>>;
    renameCurrentTodoList: () => void;
    showDeleteConfirmation: () => void;
    newTodo: string;
    setNewTodo:  React.Dispatch<React.SetStateAction<string>>;
    addTodo: () => void;
    isDeleteConfirmationVisible: boolean;
    hideDeleteConfirmation: () => void;
    deleteCurrentTodoList: () => void;
    todoLists: TodoList[];
    currentListId: string | null;
}

const ListManagementControls: React.FC<ListManagementControlsProps> = ({
    isListManagementVisible, setIsListManagementVisible, newListNameToCreate, setNewListNameToCreate, createNewTodoList,
    isRenamingList, setIsRenamingList, currentListName, setCurrentListName, renameCurrentTodoList, showDeleteConfirmation,
    newTodo, setNewTodo, addTodo, isDeleteConfirmationVisible, hideDeleteConfirmation, deleteCurrentTodoList, todoLists, currentListId
}) => {

    // Stati per la visibilità degli input e bottone attivo
    const [isCreateListInputVisible, setIsCreateListInputVisible] = useState(false);
    const [isRenameListInputVisible, setIsRenameListInputVisible] = useState(false);
    const [activeButton, setActiveButton] = useState< 'create' | 'rename' | null>(null); // Stato per il bottone attivo


    // Classi CSS per l'animazione (mantieni quelle esistenti)
    const FILTER_CONTAINER_TRANSITION_CLASSES = " transition-opacity transition-all duration-1000 ease-in-out transform origin-top-right";
    const FILTER_CONTAINER_OPEN_CLASSES = "scale-100 opacity-100";
    const FILTER_CONTAINER_CLOSED_CLASSES = "scale-0 opacity-0";
    const FILTER_ACTIVE_CLASS = "bg-yellow-400 text-gray-800 hover:bg-yellow-500 ring-2 ring-offset-2 ring-yellow-400 shadow-2xl shadow-yellow-300";
    const FILTER_INACTIVE_CLASS = "bg-yellow-100 text-gray-700 hover:bg-yellow-200";


    return (
        <>
        <div>
            {/* Bottone per attivare/disattivare il div di gestione liste (MANTENUTO) */}
            <div className="mb-2 flex justify-center">
                <button
                    onClick={() => setIsListManagementVisible(!isListManagementVisible)}
                    className={` flex items-center py-2 px-3 rounded transition-colors duration-300 border border-black ${isListManagementVisible ? FILTER_ACTIVE_CLASS : FILTER_INACTIVE_CLASS}`}
                >
                    <ListBulletIcon className="h-5 w-5 mr-2" />
                    Gestione Liste
                </button>
            </div>

            {/* Div a scomparsa per la gestione delle liste */}
            {isListManagementVisible && ( // Renderizza il div solo se isListManagementVisible è true
                <div className={`${FILTER_CONTAINER_TRANSITION_CLASSES}
                    ${isListManagementVisible ? FILTER_CONTAINER_OPEN_CLASSES : FILTER_CONTAINER_CLOSED_CLASSES}
                    rounded-lg mb-4 bg-yellow-100 overflow-hidden p-4 border border-black gap-1`}>


                    <div className="flex justify-center"> 
                        {/* Bottoni Crea, Rinomina, Elimina Lista (LAYOUT MODIFICATO) */}
                        <div className="flex gap-3 align-middle">
                            <button
                                onClick={() => {
                                    setIsCreateListInputVisible(true);
                                    setIsRenameListInputVisible(false);
                                    setActiveButton('create');
                                }}
                                className={`bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded-md text-sm ${activeButton === 'create' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                            >
                                Crea Lista
                            </button>

                            <button
                                onClick={() => {
                                    setIsRenameListInputVisible(true);
                                    setIsCreateListInputVisible(false);
                                    setActiveButton('rename');
                                }}
                                className={`bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-1 px-2 rounded-md text-sm ${activeButton === 'rename' ? 'ring-2 ring-offset-2 ring-yellow-400' : ''}`}
                            >
                                Rinomina Lista
                            </button>

                            <button
                                onClick={showDeleteConfirmation}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-2 rounded-md text-sm"
                            >
                                Elimina Lista
                            </button>
                        </div>
                    </div>

                    {/* Input Crea Lista (RENDERIZZATO CONDIZIONALMENTE) */}
                    {isCreateListInputVisible && (
                        <div className="p-2"> 
                            <div className="flex items-center space-x-2 p-1">
                                <input
                                    type="text"
                                    placeholder="Nome nuova lista..."
                                    value={newListNameToCreate}
                                    onChange={(e) => setNewListNameToCreate(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createNewTodoList(); } }}
                                    className="p-1 border border-green-500 rounded w-full focus:ring-2 focus:ring-green-500 outline-none text-black text-sm text-center" />
                            </div>
                            <div className="flex justify-center space-x-2 p-1">
                                <button
                                    onClick={createNewTodoList}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded-md text-sm"
                                >
                                    Crea
                                </button>
                                <button
                                    onClick={() => { setIsCreateListInputVisible(false); setActiveButton(null); }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-1 px-2 rounded-md text-sm"
                                >
                                    Annulla
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input Rinomina Lista (RENDERIZZATO CONDIZIONALMENTE) */}
                    {isRenameListInputVisible && (
                        <div className="p-2">
                            <div className="flex items-center space-x-2 p-1">
                                <input
                                    type="text"
                                    placeholder={`Rinomina lista "${currentListName}"`}
                                    value={currentListName}
                                    onChange={(e) => setCurrentListName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); renameCurrentTodoList(); } }}
                                    className="p-1 border border-yellow-400 rounded w-full focus:ring-2 focus:ring-yellow-400 outline-none text-black text-sm text-center" />
                            </div>
                            <div className="flex justify-center space-x-2 p-1">
                                <button onClick={renameCurrentTodoList} className="bg-yellow-400 hover:bg-yellow-600 text-black font-medium py-1 px-2 rounded-md text-sm">Rinomina</button>
                                <button onClick={() => { setIsRenameListInputVisible(false); setActiveButton(null); }} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-1 px-2 rounded-md text-sm">Annulla</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
        </>
    );
};

export default ListManagementControls;