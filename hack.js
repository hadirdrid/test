// Charger les modèles de détection faciale
async function loadModels() {
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models'),
        faceapi.nets.emotionNet.loadFromUri('/models')
    ]);
    document.getElementById("status").textContent = "Modèles chargés !";
    startVideo();
}

// Lancer le flux vidéo de la webcam
async function startVideo() {
    const video = document.getElementById('webcam');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    video.onplay = () => {
        detectEmotions();
    };
}

// Détecter les émotions en temps réel
async function detectEmotions() {
    const video = document.getElementById('webcam');
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withAgeAndGender()
            .withEmotion();

        canvas?.clear();
        canvas?.resize(displaySize);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas?.draw(resizedDetections);

        if (detections.length > 0) {
            const emotions = detections[0].expressions;
            displayEmotion(emotions);
        }
    }, 100);
}

// Afficher l'émotion détectée et proposer des solutions
function displayEmotion(emotions) {
    let emotion = "Aucune";
    let highestEmotion = Math.max(...Object.values(emotions));

    for (let key in emotions) {
        if (emotions[key] === highestEmotion) {
            emotion = key;
            break;
        }
    }

    document.getElementById("emotionText").textContent = emotion.charAt(0).toUpperCase() + emotion.slice(1);
    provideSuggestions(emotion);
}

// Fournir des suggestions en fonction de l'émotion détectée
function provideSuggestions(emotion) {
    const suggestionsList = document.getElementById("suggestionsList");
    suggestionsList.innerHTML = "";  // Réinitialiser les suggestions

    switch (emotion) {
        case 'happy':
            suggestionsList.innerHTML = "<li>Continuez à profiter de ce moment !</li><li>Essayez de partager votre bonne humeur avec quelqu'un.</li>";
            break;
        case 'sad':
            suggestionsList.innerHTML = "<li>Écoutez de la musique douce pour apaiser votre esprit.</li><li>Prenez une pause et respirez profondément.</li>";
            break;
        case 'angry':
            suggestionsList.innerHTML = "<li>Essayez de faire une activité physique pour libérer la tension.</li><li>Faites une pause et respirez profondément.</li>";
            break;
        case 'fearful':
            suggestionsList.innerHTML = "<li>Pratiquez une méditation guidée pour réduire l'anxiété.</li><li>Écrivez vos pensées pour les vider de votre esprit.</li>";
            break;
        case 'surprised':
            suggestionsList.innerHTML = "<li>Essayez de vous recentrer avec une activité de relaxation.</li><li>Prenez quelques minutes pour vous détendre et respirer profondément.</li>";
            break;
        case 'neutral':
            suggestionsList.innerHTML = "<li>Profitez de cette sérénité pour faire une activité relaxante.</li><li>Faites une promenade ou buvez une boisson chaude.</li>";
            break;
        default:
            suggestionsList.innerHTML = "<li>Il semble que vous soyez calme. Continuez ainsi et profitez de votre journée !</li>";
    }
}

// Charger les modèles et démarrer le processus
window.onload = () => {
    loadModels();
};

