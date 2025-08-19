import React from 'react';
import './SwitchRadio.css';

const SwitchRadio = ({ name, value, checked, onChange, label }) => {
    return (
        <label className="switch">
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <span className="slider"></span>
            <span className="label-text">{label}</span>
        </label>
    );
};

export default SwitchRadio;
