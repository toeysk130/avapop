const clickCountDisplay = document.getElementById('click-count');
const avaImage = document.getElementById('ava-image');
const fireContainer = document.createElement('div'); // Fire effect container
fireContainer.id = 'fire-container';
document.body.appendChild(fireContainer);

// Load a pop sound
const popSound = new Audio('sounds/pop.mp3');

// Fetch the current click count
async function fetchClicks() {
    try {
        const response = await fetch('/api/clicks');
        if (!response.ok) throw new Error('Failed to fetch click count');
        const data = await response.json();
        clickCountDisplay.textContent = `Clicks: ${data.clickCount}`;
    } catch (error) {
        console.error(error);
        clickCountDisplay.textContent = 'Clicks: Error';
    }
}

// Show fire explosion
function showFireExplosion() {
    // Get the position and size of the AVA image
    const avaRect = avaImage.getBoundingClientRect();

    // Create a glowing ring
    const ring = document.createElement('div');
    ring.classList.add('fire-ring');

    // Center the ring on the AVA image
    ring.style.top = `${avaRect.top + avaRect.height / 2 - 100}px`; // Center vertically (-100 for half ring size)
    ring.style.left = `${avaRect.left + avaRect.width / 2 - 100}px`; // Center horizontally (-100 for half ring size)

    fireContainer.appendChild(ring);

    // Add multiple fire particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('fire-particle');
        fireContainer.appendChild(particle);

        // Randomize particle animation
        const angle = Math.random() * 360;
        const distance = Math.random() * 150 + 50;
        const size = Math.random() * 8 + 4;

        particle.style.transform = `translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle)}px)`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        setTimeout(() => particle.remove(), 1000); // Remove particle after animation
    }

    // Remove the ring after animation
    setTimeout(() => ring.remove(), 1200);
}


// Increment the click count and add animations
async function incrementClicks() {
    try {
        // Change pop sound pitch dynamically
        popSound.playbackRate = 1 + Math.random() * 0.5;
        popSound.play();

        // Add pop animation to AVA image
        avaImage.classList.add('pop-animation');

        // Change image to "mouth open"
        avaImage.src = 'images/ava-open.png';

        // Remove animation class and reset image
        setTimeout(() => {
            avaImage.classList.remove('pop-animation');
            avaImage.src = 'images/ava-close.png';
        }, 250);

        // Send click data to the backend
        const response = await fetch('/api/clicks', {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to increment click count');
        const data = await response.json();

        // Update the click count display
        clickCountDisplay.textContent = `Clicks: ${data.clickCount}`;

        // Trigger fire explosion every 10 clicks
        if (data.clickCount % 10 === 0) {
            showFireExplosion();
        }
    } catch (error) {
        console.error(error);
        alert('Something went wrong. Please try again later.');
    }
}

// Attach event listener to AVA image
avaImage.addEventListener('click', incrementClicks);

// Fetch clicks on page load
fetchClicks();
