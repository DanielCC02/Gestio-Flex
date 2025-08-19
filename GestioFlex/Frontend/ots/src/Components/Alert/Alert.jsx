import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Alert.css';

const Alert = ({ message, type, duration = 3000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const getAlertVariant = () => {
    if (type === 'success') return 'success';
    if (type === 'error') return 'danger';
    return 'primary'; 
  };

  return (
    show && (
      <div className={`alert alert-${getAlertVariant()} fade show sticky-alert`} role="alert">
        {message}
      </div>
    )
  );
};

export default Alert;
