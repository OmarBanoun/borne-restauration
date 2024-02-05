import { useState, useEffect } from 'react';
import axios from 'axios';

export const useThemeSettings = () => {
  const [settings, setSettings] = useState({
    themePrimaryColor: '',
    themeSecondaryColor: '',
    companyName: '',
  });

  useEffect(() => {
    axios.get('https://maro.alwaysdata.net/api/settings')
      .then(response => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const { themePrimaryColor, themeSecondaryColor, companyName } = response.data[0];
          setSettings({ themePrimaryColor, themeSecondaryColor, companyName });
          document.documentElement.style.setProperty('--primary-color', themePrimaryColor);
          document.documentElement.style.setProperty('--secondary-color', themeSecondaryColor);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des paramètres du thème:', error);
      });
  }, []);

  return settings;
};
