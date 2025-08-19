import React from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const downloadPDF = (filename) => {
  const url = `${API_URL}/pdf/pdfs/download/${filename}/`;
  
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/pdf',
    },
  })
  .then((response) => response.blob())
  .then((blob) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link); // Elimina el enlace después de descargar
  })
  .catch((error) => console.error('Error al descargar el archivo:', error));
};

const App = () => {
  return (
    <div>
      <button onClick={() => downloadPDF('tu-archivo.pdf')}>Descargar PDF</button>
    </div>
  );
};

export default App;
