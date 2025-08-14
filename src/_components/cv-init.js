import CVLoader from '$components/cv.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.cv-container');
  if (container) {
    const cvLoader = new CVLoader();
    cvLoader.fetchCV();
  }
});