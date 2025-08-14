import "$styles/index.css"
import "$styles/syntax-highlighting.css"

// Import all JavaScript & CSS files from src/_components
import components from "$components/**/*.{js,jsx,js.rb,css}"

console.info("Bridgetown is loaded!")

// Display post excerpts from data attributes
document.addEventListener('DOMContentLoaded', function() {
  const postExcerpts = document.querySelectorAll('.post-excerpt');
  
  postExcerpts.forEach(excerpt => {
    const content = excerpt.getAttribute('data-content');
    if (content) {
      excerpt.textContent = content;
    }
  });
});
