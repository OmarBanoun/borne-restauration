import React from 'react';
import './Home.css';
import BgMain from "../../assets/accueil.jpg";
import { Link } from 'react-router-dom'
const Home = () => {

    return (
        <div className="Home">
            <main>
                <img src={ BgMain } class="bg-main" alt="bg-main" />
                <h1>Bienvenue au Kebab de la gare</h1>
                <button type="button" class="btn btn-orange btn-lg btn-block col-6 col-lg-3 my-auto">
                    <Link to="/Order">Commander <i class="fa-solid fa-utensils"></i></Link>
                </button>
            </main>
        </div>
    );
};
Home.propTypes = {};

Home.defaultProps = {};

export default Home;