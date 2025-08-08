/**
 * CV Loader - Handles dynamic loading and conversion of LaTeX CV content
 * This component is automatically imported by Bridgetown's component system
 */
class CVLoader {
  constructor() {
    this.cache = null;
    this.cacheTime = null;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    this.pdfUrl = null;
  }

  /**
   * Main entry point - fetches and displays CV content
   */
  async fetchCV() {
    const loadingEl = document.getElementById('cv-loading');
    const errorEl = document.getElementById('cv-error');
    const contentEl = document.getElementById('cv-content');

    try {
      // Fetch PDF URL first
      await this.fetchPdfUrl();
      
      // Check cache first
      if (this.cache && this.cacheTime && (Date.now() - this.cacheTime < this.cacheDuration)) {
        this.displayCV(this.cache.htmlContent, this.cache.title, this.cache.email);
        return;
      }

      // Fetch LaTeX file from GitHub
      const response = await fetch('https://raw.githubusercontent.com/oscar-barlow/CV/master/CV.tex');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const latexContent = await response.text();
      
      // Convert LaTeX to HTML using simplified parser
      const { htmlContent, title, email } = this.convertLatex(latexContent);
      
      // Cache the result
      this.cache = { htmlContent, title, email };
      this.cacheTime = Date.now();
      
      this.displayCV(htmlContent, title, email);
      
    } catch (error) {
      console.error('Error loading CV:', error);
      const fallbackEl = document.getElementById('cv-fallback');
      loadingEl.style.display = 'none';
      
      // Show fallback with download links instead of just error message
      if (fallbackEl) {
        fallbackEl.style.display = 'block';
      } else {
        errorEl.style.display = 'block';
      }
    }
  }

  /**
   * Fetches the correct PDF download URL from GitHub API
   */
  async fetchPdfUrl() {
    try {
      // Use GitHub API to get latest release info
      const response = await fetch('https://api.github.com/repos/oscar-barlow/CV/releases/latest');
      
      if (response.ok) {
        const release = await response.json();
        const tag = release.tag_name;
        
        if (tag) {
          this.pdfUrl = `https://github.com/oscar-barlow/CV/releases/download/${tag}/Oscar.Barlow.CV.${tag}.pdf`;
        }
      }
      
      // Fallback if we can't determine the URL
      if (!this.pdfUrl) {
        this.pdfUrl = 'https://github.com/oscar-barlow/CV/releases/latest';
      }
      
      // Update all download links
      this.updateDownloadLinks();
      
    } catch (error) {
      console.warn('Could not fetch PDF URL, using fallback:', error);
      this.pdfUrl = 'https://github.com/oscar-barlow/CV/releases/latest';
      this.updateDownloadLinks();
    }
  }

  /**
   * Updates all download links with the correct PDF URL
   */
  updateDownloadLinks() {
    const downloadLinks = document.querySelectorAll('.cv-download-link');
    downloadLinks.forEach(link => {
      link.href = this.pdfUrl;
    });
  }

  /**
   * Converts LaTeX content to HTML
   * TODO: Replace this regex-based approach with LaTeX.js
   * @param {string} latexContent - Raw LaTeX content
   * @returns {object} - Parsed content with htmlContent, title, email
   */
  convertLatex(latexContent) {
    let content = latexContent;
    
    // Extract important information before removing commands
    const titleMatch = content.match(/\\title\{([^}]*)\}/);
    const emailMatch = content.match(/\\cvsubtitle\{([^}]*)\}/);
    const title = titleMatch ? titleMatch[1] : 'Oscar Barlow';
    const email = emailMatch ? emailMatch[1] : '';
    
    // Remove LaTeX document structure and commands
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
    
    // Remove LaTeX comments and scope markers
    content = content.replace(/%.*$/gm, '');
    content = content.replace(/\{\s*%\s*Start of local scope/g, '');
    content = content.replace(/\}\s*%\s*End of local scope/g, '');
    content = content.replace(/^\s*\{\s*$/gm, '');
    content = content.replace(/^\s*\}\s*$/gm, '');
    
    // Convert sections and subsections
    content = content.replace(/\\section\*?\{([^}]*)\}/g, '<h2 class="cv-section-title">$1</h2>');
    content = content.replace(/\\subsection\*?\{([^}]*)\}/g, '<h3 class="cv-subsection-title">$1</h3>');
    
    // Convert lists
    content = content.replace(/\\begin\{itemize\}/g, '<ul class="cv-list">');
    content = content.replace(/\\end\{itemize\}/g, '</ul>');
    content = content.replace(/\\item\s*/g, '<li>');
    
    // Convert text formatting
    content = content.replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>');
    content = content.replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');
    content = content.replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>');
    
    // Handle LaTeX character escaping
    content = content.replace(/\\&/g, '&');  // LaTeX escaped ampersand
    content = content.replace(/--/g, '–');   // Double dash to en dash
    content = content.replace(/---/g, '—');  // Triple dash to em dash
    
    // Handle line breaks
    content = content.replace(/\\\\/g, '<br>');
    
    // Clean up excessive whitespace
    content = content.replace(/\s+/g, ' ');
    content = content.replace(/\n\s*\n/g, '\n\n');
    
    // Split into paragraphs and wrap properly
    const sections = content.split(/(?=<h[2-3])/);
    let htmlContent = '';
    
    for (let section of sections) {
      section = section.trim();
      if (!section) continue;
      
      // Split section into parts: heading + content
      const parts = section.split(/(<h[2-3][^>]*>.*?<\/h[2-3]>)/);
      
      for (let part of parts) {
        part = part.trim();
        if (!part) continue;
        
        if (part.match(/^<h[2-3]/)) {
          htmlContent += part + '\n';
        } else if (part.match(/^<ul/)) {
          htmlContent += part + '\n';
        } else {
          // Regular content - wrap in paragraphs
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
    
    // Final cleanup
    htmlContent = htmlContent.replace(/<p>\s*<\/p>/g, '');
    htmlContent = htmlContent.replace(/<p>\s*(<[uh][1-6ul])/g, '$1');
    htmlContent = htmlContent.replace(/(<\/[uh][1-6ul]>)\s*<\/p>/g, '$1');
    
    return { htmlContent, title, email };
  }

  /**
   * Displays the converted CV content
   * @param {string} htmlContent - Converted HTML content
   * @param {string} title - CV title/name
   * @param {string} email - Contact email
   */
  displayCV(htmlContent, title = 'Oscar Barlow', email = '') {
    const loadingEl = document.getElementById('cv-loading');
    const contentEl = document.getElementById('cv-content');
    
    // Wrap content in proper structure
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
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    
    // Update download links after content is rendered
    this.updateDownloadLinks();
  }
}

// Initialize CV loader when page loads - but only if CV container exists
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.cv-container')) {
    const cvLoader = new CVLoader();
    cvLoader.fetchCV();
  }
});