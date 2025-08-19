import React from 'react';
import styles from './Spinner.module.css';

const Spinner = () => {
    return (
        <div className={styles['spinner-overlay']}>
            <div className={styles['spinner-modal']}>
                <div className={styles.spinner}></div>
            </div>
        </div>
    );
};

export default Spinner;
