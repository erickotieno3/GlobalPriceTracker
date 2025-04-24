// Simple counter functionality
let count = 0;
const countElement = document.getElementById('count');
const incrementButton = document.getElementById('increment');
const resetButton = document.getElementById('reset');
const timeElement = document.getElementById('time');

// Update counter display
function updateCounter() {
  countElement.textContent = count;
}

// Increment button click handler
incrementButton.addEventListener('click', () => {
  count++;
  updateCounter();
});

// Reset button click handler
resetButton.addEventListener('click', () => {
  count = 0;
  updateCounter();
});

// Update time
function updateTime() {
  const now = new Date();
  timeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
}

// Initial time update
updateTime();

// Update time every second
setInterval(updateTime, 1000);

// Log for debugging
console.log('Minimalist test app initialized successfully');