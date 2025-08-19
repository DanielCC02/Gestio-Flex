import React from 'react';
import './Form.css';

const Form = ({ item, handleSubmit, handleChange, fields }) => {

  return (
    <>
      <form className='userForm' onSubmit={handleSubmit}>
        {fields.map(field => (
          <div className='formBox' key={field.name}>
            <label>{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={item[field.name]}
              onChange={handleChange}
            />
          </div>
        ))}
      </form>
      <button className='btnUserForm' type="submit">Completar</button>
    </>
  );
};

export default Form;
