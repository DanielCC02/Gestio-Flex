import React, { useState, useEffect, useRef } from 'react';
import '../../Styles/Global.css';

const DataList = ({ apiUrl, keyField, valueField, renderOption, onSelect }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listIdRef = useRef('datalist-' + Math.random().toString(36).slice(2,9));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('access');
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleChange = (value) => {
    const selectedItem = data.find(item => String(item[valueField]) === String(value));
    if (selectedItem) {
      onSelect(selectedItem[keyField]);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='datalist-box'>
      <input
        list={listIdRef.current}
        placeholder="Selecciona una opciÃ³n"
        className="select-proyectos"
        onChange={(e) => handleChange(e.target.value)}
      />
      <datalist id={listIdRef.current}>
        {data
          .slice()
          .sort((a, b) => {
            const labelA = (renderOption ? renderOption(a) : String(a[valueField] || '')).toLowerCase();
            const labelB = (renderOption ? renderOption(b) : String(b[valueField] || '')).toLowerCase();
            return labelA.localeCompare(labelB);
          })
          .map(item => (
            <option key={item[keyField]} value={item[valueField]}>
              {renderOption ? renderOption(item) : item[valueField]}
            </option>
          ))}
      </datalist>
    </div>
  );
};

export default DataList;