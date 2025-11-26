const canvas = document.getElementById('roueCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultatDiv = document.getElementById('resultat');

// --- GAGES FINALISÉS (AVEC NUMÉROS ET TEXTES LONGS STOCKÉS) ---
const gages = [
    // Note : Le champ 'id' est le numéro affiché sur la roue.
    { id: 1, text: "Critique la page d'accueil d'un concurrent\nen parlant comme un commentateur sportif", color: "#FF6347" }, 
    { id: 2, text: "Nomme 5 polices Serif et 5 Sans-serif en -20s\nou paie la tournée", color: "#6A5ACD" }, 
    { id: 3, text: "Envoie un message avec une faute de Kerning\nintentionnelle (Boss/Prof)", color: "#3A0CA3" }, 
    { id: 4, text: "Explique les 3 règles WCAG Contraste\nen faisant un Plank (gainage)", color: "#4361EE" }, 
    { id: 5, text: "Explique pourquoi déformer un logo\nest un crime (Aspect Ratio)", color: "#4CC9F0" }, 
    { id: 6, text: "Esquisse un wireframe en 1 min\nen justifiant l'espace négatif", color: "#F72585" }, 
    { id: 7, text: "Vends un objet en utilisant\nl'émotion des couleurs et la typo", color: "#7209B7" }, 
    { id: 8, text: "Mets 3 accessoires agressifs :\nexplique la limite de couleurs", color: "#3A0CA3" }, 
];
// ---------------------------------------------------

const numGages = gages.length;
const arc = Math.PI / (numGages / 2); 
let angleRotation = 0; 
let isSpinning = false;

// --- FONCTIONS CLÉS ---
function resizeCanvas() {
    const size = canvas.clientWidth; 
    canvas.width = size;
    canvas.height = size;
    drawWheel(); 
}

// --- Fonction pour dessiner la roue (AFFICHAGE NUMÉROTÉ) ---
function drawWheel() {
    const size = canvas.width;
    const radius = size / 2;
    // Taille de la police augmentée pour le numéro
    const font_size = size * 0.08; 

    ctx.clearRect(0, 0, size, size); 
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;

    const startAngleOffset = -(Math.PI / 2); 

    for (let i = 0; i < numGages; i++) {
        const angle = angleRotation + i * arc + startAngleOffset;
        
        ctx.beginPath();
        ctx.arc(radius, radius, radius, angle, angle + arc); 
        ctx.lineTo(radius, radius);
        ctx.closePath();
        
        ctx.fillStyle = gages[i].color; 
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(radius, radius); 
        
        const textAngle = angle + arc / 2;
        ctx.rotate(textAngle);
        
        ctx.textAlign = 'center'; 
        ctx.fillStyle = '#fff';
        
        // Nouvelle police grande et centrée pour le numéro
        ctx.font = 'bold ' + font_size + 'px Arial'; 
        
        // Affiche le numéro du gage au centre du segment
        ctx.fillText(gages[i].id, radius * 0.5, 0 + (font_size * 0.3)); // 50% du rayon
        
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinButton.disabled = true;
    resultatDiv.textContent = "The wheel is spinning...";

    const randomGageIndex = Math.floor(Math.random() * numGages);
    
    const centerAngleRad = randomGageIndex * arc + arc / 2;

    const randomOffsetRad = (Math.random() - 0.5) * arc * 0.8;
    const targetAngleRadWithRandom = centerAngleRad + randomOffsetRad;

    const targetAngleDegrees = targetAngleRadWithRandom * (180 / Math.PI); 

    const baseAngle = 360 * 5; 
    let totalRotation = baseAngle + targetAngleDegrees;

    canvas.style.transform = `rotate(-${totalRotation}deg)`;

    setTimeout(() => {
        isSpinning = false;
        spinButton.disabled = false;
        
        const winningGage = gages[randomGageIndex];
        // Message adapté pour afficher le numéro et le texte long
        resultatDiv.innerHTML = `Bravo. Le numéro ${winningGage.id} est sorti.<br>Ton gage est : <strong>${winningGage.text.replace(/\n/g, ' ')}</strong> 😬`;

        canvas.style.transition = 'none';
        canvas.style.transform = `rotate(-${targetAngleDegrees}deg)`; 
        setTimeout(() => {
            canvas.style.transition = 'transform 5s cubic-bezier(0.2, 0.8, 0.4, 1)';
        }, 50);

    }, 5000); 
}

// --- INITIALISATION RESPONSIVE ---
window.addEventListener('load', resizeCanvas); 
window.addEventListener('resize', resizeCanvas); 
spinButton.addEventListener('click', spinWheel);