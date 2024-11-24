// Sélectionner les éléments nécessaires
const video = document.getElementById('webcam');
const canvas = document.getElementById('snapshot');
const captureButton = document.getElementById('capture');
const context = canvas.getContext('2d');

// Demander l'accès à la webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        // Associer le flux vidéo à l'élément vidéo
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error('Erreur lors de l\'accès à la webcam :', error);
        alert('Impossible d\'accéder à la webcam. Vérifiez vos permissions.');
    });

// Fonction pour capturer une image
captureButton.addEventListener('click', () => {
    // Configurer le canvas pour correspondre à la taille de la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image de la vidéo sur le canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    alert('Image capturée !');
});

