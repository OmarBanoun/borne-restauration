import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './Header/Header.css';
import SablierLogo from '../../assets/sablier.png';

export const useInactivityAlert = () => {
  const navigate = useNavigate();
  useEffect(() => {
  let timer;
    const showAlert = () => {
      Swal.fire({
        title: 'Êtes-vous toujours là ?',
        text: 'Cliquez sur le bouton ci-dessous pour rester sur cette page.',
        imageUrl: SablierLogo,
        imageWidth: 100,
        imageHeight: 100,
        timer: 10000,
        timerProgressBar: true,
        confirmButtonText: 'Oui, je suis toujours là !',
        // Retire willClose puisqu'on va gérer la fermeture avec then
      }).then((result) => {
        // Si le timer expire, Swal.DismissReason.timer sera la raison
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log('Alerte fermée par le timer');
          navigate('/');
        }
      });
    };

    // const timer = setTimeout(showAlert, 20000);

    // Réinitialiser le timer lors des interactions de l'utilisateur
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(showAlert, 20000); // Réinitialiser pour 1 minute d'inactivité
    };

    window.onload = resetTimer;
    document.addEventListener('touchstart', resetTimer);
    document.addEventListener('click', resetTimer);

    resetTimer();

    return () => {
        clearTimeout(timer); // Annule le timer actif
        document.removeEventListener('touchstart', resetTimer);
        document.removeEventListener('click', resetTimer); // N'oubliez pas de retirer les écouteurs
    };
    }, []);
};
