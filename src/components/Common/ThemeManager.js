import React, { useEffect } from 'react';
import axios from 'axios';

const ThemeManager = () => {
  useEffect(() => {
    axios.get('https://maro.alwaysdata.net/api/settings')
      .then(response => {
        if(response.data.length > 0) {
          const { themePrimaryColor, themeSecondaryColor } = response.data[0];
          document.documentElement.style.setProperty('--primary-color', themePrimaryColor);
          document.documentElement.style.setProperty('--secondary-color', themeSecondaryColor);
        }
      })
      .catch(error => console.log(error));
  }, []);

  return null; // Ce composant ne rend rien visuellement
};

export default ThemeManager;