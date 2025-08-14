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

// CV Loader functionality - inline to ensure it loads
class CVLoader {
  constructor() {
    this.cache = null;
    this.cacheTime = null;
    this.cacheDuration = 3 * 60 * 60 * 1000; // 3 hours
    this.pdfUrl = null;
  }

  async fetchCV() {
    const loadingEl = document.getElementById('cv-loading');
    const errorEl = document.getElementById('cv-error');
    const contentEl = document.getElementById('cv-content');

    // Check cache first
    if (this.cache && this.cacheTime && (Date.now() - this.cacheTime < this.cacheDuration)) {
      loadingEl.style.display = 'none';
      this.displayCV(this.cache.htmlContent, this.cache.title, this.cache.email);
      this.fetchPdfUrl();
      return;
    }

    try {
      const pdfUrlPromise = this.fetchPdfUrl();
      const contentPromise = this.fetchLatexContent();
      
      await Promise.all([pdfUrlPromise, contentPromise]);
      
    } catch (error) {
      console.error('Error loading CV:', error);
      const fallbackEl = document.getElementById('cv-fallback');
      
      loadingEl.style.opacity = '0';
      setTimeout(() => {
        loadingEl.style.display = 'none';
        
        if (fallbackEl) {
          fallbackEl.style.display = 'block';
          setTimeout(() => fallbackEl.classList.add('show'), 10);
        } else {
          errorEl.style.display = 'block';
          setTimeout(() => errorEl.classList.add('show'), 10);
        }
      }, 300);
    }
  }

  async fetchLatexContent() {
    const response = await fetch('https://raw.githubusercontent.com/oscar-barlow/CV/master/CV.tex');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const latexContent = await response.text();
    const { htmlContent, title, email } = this.convertLatex(latexContent);
    
    this.cache = { htmlContent, title, email };
    this.cacheTime = Date.now();
    
    this.displayCV(htmlContent, title, email);
  }

  async fetchPdfUrl() {
    try {
      const response = await fetch('https://api.github.com/repos/oscar-barlow/CV/releases/latest');
      
      if (response.ok) {
        const release = await response.json();
        const tag = release.tag_name;
        
        if (tag) {
          this.pdfUrl = `https://github.com/oscar-barlow/CV/releases/download/${tag}/Oscar.Barlow.CV.${tag}.pdf`;
        }
      }
      
      if (!this.pdfUrl) {
        this.pdfUrl = 'https://github.com/oscar-barlow/CV/releases/latest';
      }
      
      this.updateDownloadLinks();
      
    } catch (error) {
      console.warn('Could not fetch PDF URL, using fallback:', error);
      this.pdfUrl = 'https://github.com/oscar-barlow/CV/releases/latest';
      this.updateDownloadLinks();
    }
  }

  updateDownloadLinks() {
    const downloadLinks = document.querySelectorAll('.cv-download-link');
    downloadLinks.forEach(link => {
      link.href = this.pdfUrl;
    });
  }

  convertLatex(latexContent) {
    let content = latexContent;
    
    const titleMatch = content.match(/\\title\{([^}]*)\}/);
    const emailMatch = content.match(/\\cvsubtitle\{([^}]*)\}/);
    const title = titleMatch ? titleMatch[1] : 'Oscar Barlow';
    const email = emailMatch ? emailMatch[1] : '';
    
    // LaTeX conversion logic (simplified for brevity)
    content = content.replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, '');
    content = content.replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, '');
    content = content.replace(/\\begin\{document\}/g, '');
    content = content.replace(/\\end\{document\}/g, '');
    content = content.replace(/\\author\{[^}]*\}/g, '');
    content = content.replace(/\\date\{[^}]*\}/g, '');
    content = content.replace(/\\title\{[^}]*\}/g, '');
    content = content.replace(/\\maketitle/g, '');
    content = content.replace(/\\cvsubtitle\{[^}]*\}/g, '');
    content = content.replace(/\\pagestyle\{[^}]*\}/g, '');
    content = content.replace(/\\setlength\{[^}]*\}\{[^}]*\}/g, '');
    content = content.replace(/%.*$/gm, '');
    content = content.replace(/\{\s*%\s*Start of local scope/g, '');
    content = content.replace(/\}\s*%\s*End of local scope/g, '');
    content = content.replace(/^\s*\{\s*$/gm, '');
    content = content.replace(/^\s*\}\s*$/gm, '');
    content = content.replace(/\\section\*?\{([^}]*)\}/g, '<h2 class="cv-section-title">$1</h2>');
    content = content.replace(/\\subsection\*?\{([^}]*)\}/g, '<h3 class="cv-subsection-title">$1</h3>');
    content = content.replace(/\\begin\{itemize\}/g, '<ul class="cv-list">');
    content = content.replace(/\\end\{itemize\}/g, '</ul>');
    content = content.replace(/\\item\s*/g, '<li>');
    content = content.replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>');
    content = content.replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');
    content = content.replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>');
    content = content.replace(/\\&/g, '&');
    content = content.replace(/--/g, '–');
    content = content.replace(/---/g, '—');
    content = content.replace(/\\\\/g, '<br>');
    content = content.replace(/\s+/g, ' ');
    content = content.replace(/\n\s*\n/g, '\n\n');
    
    const sections = content.split(/(?=<h[2-3])/);
    let htmlContent = '';
    
    for (let section of sections) {
      section = section.trim();
      if (!section) continue;
      
      const parts = section.split(/(<h[2-3][^>]*>.*?<\/h[2-3]>)/);
      
      for (let part of parts) {
        part = part.trim();
        if (!part) continue;
        
        if (part.match(/^<h[2-3]/)) {
          htmlContent += part + '\n';
        } else if (part.match(/^<ul/)) {
          htmlContent += part + '\n';
        } else {
          const paragraphs = part.split(/\n\s*\n/).filter(p => p.trim());
          for (let para of paragraphs) {
            para = para.trim().replace(/\n/g, ' ');
            if (para && !para.match(/^<[ul]/)) {
              htmlContent += '<p>' + para + '</p>\n';
            } else if (para.match(/^<[ul]/)) {
              htmlContent += para + '\n';
            }
          }
        }
      }
    }
    
    htmlContent = htmlContent.replace(/<p>\s*<\/p>/g, '');
    htmlContent = htmlContent.replace(/<p>\s*(<[uh][1-6ul])/g, '$1');
    htmlContent = htmlContent.replace(/(<\/[uh][1-6ul]>)\s*<\/p>/g, '$1');
    
    return { htmlContent, title, email };
  }

  displayCV(htmlContent, title = 'Oscar Barlow', email = '') {
    const loadingEl = document.getElementById('cv-loading');
    const contentEl = document.getElementById('cv-content');
    
    const wrappedContent = `
      <header class="cv-header">
        <h1 class="cv-title">${title}</h1>
        ${email ? `<p class="cv-email"><a href="mailto:${email}">${email}</a></p>` : ''}
        <p class="cv-subtitle">Curriculum Vitae</p>
        <p class="cv-download">
          <a href="${this.pdfUrl || 'https://github.com/oscar-barlow/CV/releases/latest'}" class="cv-pdf-link cv-download-link" target="_blank">
            PDF ↓
          </a>
        </p>
      </header>
      <div class="cv-separator">
        <div class="brand-shape-tiny"></div>
      </div>
      <div class="cv-body">
        ${htmlContent}
      </div>
      <footer class="cv-footer">
        <div class="cv-signature">
          <div class="brand-shape-tiny"></div>
        </div>
      </footer>
    `;
    
    contentEl.innerHTML = wrappedContent;
    contentEl.style.display = 'block';
    
    if (loadingEl.style.display !== 'none') {
      loadingEl.style.opacity = '0';
      setTimeout(() => {
        loadingEl.style.display = 'none';
        contentEl.classList.add('show');
      }, 300);
    } else {
      contentEl.classList.add('show');
    }
    
    this.updateDownloadLinks();
  }
}

// Initialize CV loader for CV pages
document.addEventListener('DOMContentLoaded', () => {
  console.log('CV.js: DOMContentLoaded fired');
  const container = document.querySelector('.cv-container');
  console.log('CV.js: Container found:', !!container);
  if (container) {
    console.log('CV.js: Initializing CVLoader');
    const cvLoader = new CVLoader();
    cvLoader.fetchCV();
  }
});
