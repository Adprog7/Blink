const canvas = document.getElementById('roueCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultatDiv = document.getElementById('resultat');

// --- GAGES FINALISÉS (AVEC NUMÉROS ET TEXTES LONGS STOCKÉS) ---
const gages = [
    { 
        id: 1, 
        text: "Post a story in Comic Sans\n& justify why it kills credibility", 
        color: "#FF6347",
        rule: "Unprofessional Font: Comic Sans undermines brand credibility and professionalism. Stick to approved fonts."
    }, 
    { 
        id: 2, 
        text: "Change profile pic to a\ndistorted logo & explain the design crime", 
        color: "#6A5ACD",
        rule: "Aspect Ratio Distortion: A logo's proportion (aspect ratio) is mandatory and must never be stretched or squashed."
    }, 
    { 
        id: 3, 
        text: "Read 5 sentences without breathing\nto highlight lack of padding (Leading)", 
        color: "#3A0CA3",
        rule: "Leading Readability: Inadequate vertical spacing (Leading) makes text difficult to track and reduces reading comfort."
    }, 
    { 
        id: 4, 
        text: "Explain the Color Contrast Rule simply, while holding the invisible chair (wall sit).", 
        color: "#4361EE",
        rule: "The Color Contrast Rule specifies the difference in brightness between text and its background. For essential readability and accessibility, you must use light text on a dark background, or vice-versa."
    }, 
    { 
        id: 5, 
        text: "Sketch a wireframe in 1 minute\njustifying the negative space", 
        color: "#3A0CA3",
        rule: "Whitespace Importance: Negative space guides the eye, reduces clutter, and establishes clear visual hierarchy, vital for layout."
    
    }, 
    { 
        id: 6, 
        text: "Wear 3 aggressively colored accessories\nand explain why color limits are crucial", 
        color: "#F72585",
        rule: "Palette Discipline: Overuse of colors leads to visual clutter. Brand guides usually limit usage to 2-3 primary colors."
    }, 
    { 
        id: 7, 
        text: "Explain why using red in finance is a mistake, speaking like an overly enthusiastic game show host (30s).", 
        color: "#7209B7",
        rule: "Color Psychology Clashes: Specific colors evoke certain feelings (red = danger/debt). Finance brands require colors (Blue/Green) that inspire Trust and Stability."
    }, 
    { 
        id: 8, 
        text: "Draw the same object (e.g., a heart) in three different styles (line, solid, 3D) and explain why consistency is vital (30s).", 
        color: "#4CC9F0",
        rule: "All icons and graphic elements must belong to the same approved Visual Style (e.g., all outline or all filled) to maintain a unified and professional design."}, 
];
// ---------------------------------------------------

const numGages = gages.length;
const arc = Math.PI / (numGages / 2); 
let angleRotation = 0; 
let isSpinning = false;

// --- NOUVELLE FONCTION POUR AFFICHER/MASQUER LA RÈGLE ---
window.toggleRule = function() {
    const ruleBox = document.getElementById('ruleBox');
    const toggleButton = document.getElementById('toggleButton');
    if (ruleBox.style.display === 'none') {
        ruleBox.style.display = 'block';
        toggleButton.textContent = 'Hide Rule';
    } else {
        ruleBox.style.display = 'none';
        toggleButton.textContent = 'Explanation of Challenge';
    }
};

// --- FONCTIONS CLÉS ---
function resizeCanvas() {
    const size = canvas.clientWidth; 
    canvas.width = size;
    canvas.height = size;
    drawWheel(); 
}

function drawWheel() {
    const size = canvas.width;
    const radius = size / 2;
    const line_height = size * 0.03; 
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
        
        ctx.font = 'bold ' + font_size + 'px Arial'; 
        
        ctx.fillText(gages[i].id, radius * 0.5, 0 + (font_size * 0.3)); 
        
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinButton.disabled = true;
    resultatDiv.innerHTML = "<p>The wheel is spinning...</p>";

    const randomGageIndex = Math.floor(Math.random() * numGages);
    const winningGage = gages[randomGageIndex];
    
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
        
        // --- AFFICHAGE FINAL AVEC BOUTON "SHOW RULE" ---
        resultatDiv.innerHTML = `
            <p style="font-size: 0.6em; font-weight: bold; margin-bottom: 10px;">You landed on number ${winningGage.id}! Your dare is: <strong>${winningGage.text.replace(/\n/g, ' ')}</strong> 😬</p>
            
            <button id="toggleButton" onclick="toggleRule()" style="background-color: #4361EE; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                 Explanation of Challenge
            </button>

            <div id="ruleBox" style="display: none; margin-top: 15px; padding: 10px; border: 1px dashed #4CC9F0;">
                <p style="font-size: 0.6em; font-weight: normal; color: #4CC9F0; text-align: center; margin: 0;">
                    <strong>THE RULE (Expert Mode):</strong> ${winningGage.rule}
                </p>
            </div>
        `;

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