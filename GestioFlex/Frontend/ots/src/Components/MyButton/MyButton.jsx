import React from 'react';
import { useSnackbar } from 'notistack';

function MyButton() {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar('¡Notificación enviada con éxito!', { variant: 'success' });
  };

  return (
    <button onClick={handleClick}>
      Mostrar Notificación
    </button>
  );
}

export default MyButton;
