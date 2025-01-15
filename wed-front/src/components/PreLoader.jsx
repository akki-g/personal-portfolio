import React, { useEffect } from 'react';
import { preLoaderAnim } from '../animations/aimations';
import './preloader.css';

const PreLoader = () => {


    useEffect(() => {
        preLoaderAnim();
    }, []);

    return (
        <div className="preloader">
            <div className="texts-container">
                <span>Student, </span>
                <span>Researcher, </span>
                <span>Developer, </span>
                <span>Engineer.</span>
            </div>
        </div>
    );
    }

export default PreLoader;