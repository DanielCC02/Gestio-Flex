import React, { useState } from 'react';
import './ChecklistWQ.css';

const ChecklistWithQuantity = ({ items, onSelectionChange }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSwitchChange = (item, isChecked) => {
        let updatedItems;
        if (isChecked) {
            // Agregar el item con cantidad vacía por defecto
            updatedItems = [...selectedItems, { ...item, cantidad: '' }];
        } else {
            // Eliminar el item de la lista
            updatedItems = selectedItems.filter(i => i.id !== item.id);
        }
        setSelectedItems(updatedItems);
        onSelectionChange(updatedItems); // Notificar el cambio al componente padre
    };

    const handleCantidadChange = (itemId, cantidad) => {
        const updatedItems = selectedItems.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    cantidad: cantidad === '' ? '' : isNaN(cantidad) || cantidad < 1 ? 1 : cantidad,
                };
            }
            return item;
        });
        setSelectedItems(updatedItems);
        onSelectionChange(updatedItems); // Notificar el cambio al componente padre
    };

    return (
        <>
            {items.map(item => {
                const isSelected = selectedItems.some(i => i.id === item.id);
                const selectedItem = selectedItems.find(i => i.id === item.id);

                return (
                    <div key={item.id} className="switch-container">
                        <div className='switch-input-container'>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => handleSwitchChange(item, e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                            <div className='datos'>
                                <span className="item-label bold">{item.nombre}</span>
                                <span className="item-label">{item.num_fabricante}</span>
                            </div>
                        </div>
                        {isSelected && (
                            <input
                                type="number"
                                inputMode="numeric" // Muestra teclado numérico en móviles
                                value={selectedItem.cantidad === null ? '' : selectedItem.cantidad} // Permite mostrar vacío temporalmente
                                onChange={(e) => {
                                    const value = e.target.value;
                                    handleCantidadChange(item.id, value === '' ? '' : parseInt(value, 10));
                                }}
                                placeholder="Cantidad"
                                className="quantity-input"
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default ChecklistWithQuantity;
