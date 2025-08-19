import React, { useState, useEffect } from 'react';
import './CheckList.css';

const Checklist = ({ items = [], onSelectionChange }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [cantidadPorItem, setCantidadPorItem] = useState({}); // Objeto para manejar cantidades por item

    // Maneja el cambio de selección del checklist
    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prevSelected) => {
            let newSelected;
            if (prevSelected.includes(itemId)) {
                // Si se deselecciona el checkbox, eliminamos la cantidad también
                newSelected = prevSelected.filter(id => id !== itemId);
                const { [itemId]: _, ...rest } = cantidadPorItem; // Elimina la cantidad correspondiente
                setCantidadPorItem(rest);
                return newSelected;
            } else {
                return [...prevSelected, itemId]; 
            }
        });
    };

    // Maneja el cambio de la cantidad por cada item seleccionado
    const handleCantidadChange = (e, itemId) => {
        const { value } = e.target;
        setCantidadPorItem((prevState) => ({
            ...prevState,
            [itemId]: value, // Asigna la cantidad al item correspondiente
        }));
    };

    // Notificar al componente padre cuando cambia la selección o las cantidades
    useEffect(() => {
        const selectedItemsWithQuantity = selectedItems.map((itemId) => ({
            id: itemId,
            cantidad: cantidadPorItem[itemId] || 1, // Por defecto cantidad 1 si no se ha seleccionado
        }));
        onSelectionChange(selectedItemsWithQuantity);
        console.log('Selected items with quantity:', selectedItemsWithQuantity);
    // Eliminamos 'onSelectionChange' de las dependencias para evitar el bucle
    }, [selectedItems, cantidadPorItem]);

    return (
        <div className="checklist-table">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Seleccionar</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(items) && items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.nombre}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleCheckboxChange(item.id)}
                                    />
                                </td>
                                <td>
                                    {selectedItems.includes(item.id) && (
                                        <input
                                            type="number"
                                            min="1"
                                            value={cantidadPorItem[item.id] || 1}
                                            onChange={(e) => handleCantidadChange(e, item.id)}
                                            style={{ width: '60px' }}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay items disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Checklist;
