import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../Context/sessionContext';
import './ListPDF.css';

const ListPDFs = () => {
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setPdfUrl } = useSession();  // Obtenemos setPdfUrl del contexto

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchPDFs = async () => {
            try {
                const response = await fetch(`${API_URL}/pdf/pdfs/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('PDF Data:', data);  // Log the data to the console
                setPdfs(data);
            } catch (error) {
                console.error('There was an error fetching the PDFs!', error);
                setError('There was an error fetching the PDFs.');
            }
        };

        fetchPDFs();
    }, []);

    const handlePdfClick = (pdfUrl) => {
        setPdfUrl(pdfUrl);  // Establecemos la URL del PDF en el contexto
        navigate('/view-pdf/1');
    };

    const downloadPDF = (filePath) => {
        const filename = filePath.split('/').pop(); // Extrae el nombre del archivo del path completo
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

    return (
        <div className='PdfList'>
            <h2>Lista de PDFs</h2>
            {error && <p>{error}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {pdfs.map(pdf => (
                    <div key={pdf.id} style={{ margin: '10px' }}>
                        <a onClick={() => handlePdfClick(pdf.file_url)} style={{ cursor: 'pointer' }}>
                            {pdf.title}
                        </a>
                        <button onClick={() => downloadPDF(pdf.file)}>Descargar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListPDFs;
