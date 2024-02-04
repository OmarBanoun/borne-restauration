import { useState, useEffect } from 'react';
import axios from 'axios';

// export const useThemeSettings = () => {
export const useThemeSettings = () => {
  const [settings, setSettings] = useState({
    themePrimaryColor: '',
    themeSecondaryColor: '',
    companyName: '', // Ajoutez d'autres paramètres de thème ici si nécessaire
  });

  useEffect(() => {
    axios.get('https://maro.alwaysdata.net/api/settings')
      .then(response => {
        if (response.data.length > 0) {
          const { themePrimaryColor, themeSecondaryColor, companyName } = response.data[0];
          setSettings({ themePrimaryColor, themeSecondaryColor, companyName });
          // Appliquez les couleurs au style du document ici si vous souhaitez continuer à le faire globalement
          document.documentElement.style.setProperty('--primary-color', themePrimaryColor);
          document.documentElement.style.setProperty('--secondary-color', themeSecondaryColor);
        }
      })
      .catch(error => console.log(error));
  }, []);

  return settings;
};