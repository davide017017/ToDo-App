import React from 'react';

interface ConfirmationDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    listName?: string; // listName è opzionale
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel, listName }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <h2 className="text-lg font-semibold mb-4">Conferma Eliminazione</h2>
                <p className="text-gray-700 mb-6">
                    {/* Usa JSX per il messaggio e grassetto */}
                    Sei sicuro di voler eliminare la lista {listName ? <strong>{listName}</strong> : null}?
                    Questa azione è irreversibile.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                    >
                        Sì, Elimina
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md"
                    >
                        No, Annulla
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;