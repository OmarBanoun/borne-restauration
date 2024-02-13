import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { UseThemeSettings } from '../../components/Common/ThemeManager';
const Home = () => {
    const { companyName, homeImg } = UseThemeSettings();
    return (
        <div className="Home">
            <main>
                <img src={`https://maro.alwaysdata.net/${ homeImg }`} className="bg-main" alt="bg-main" />
                <h1>{companyName}</h1>
                <button type="button" className="btn btn-orange btn-lg btn-block col-6 col-lg-3 my-auto">
                    <Link to="/Order">Commander <i className="fa-solid fa-utensils"></i></Link>
                </button>
            </main>
        </div>
    );
};

export default Home;