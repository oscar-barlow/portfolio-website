import { describe, it, expect, vi, beforeEach } from 'vitest';
import CVLoader from '../src/_components/cv.js';

describe('CVLoader', () => {
  let cvLoader;
  let mockElements;

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <div id="cv-loading" style="display: block;">Loading...</div>
      <div id="cv-error" style="display: none;">Error</div>
      <div id="cv-fallback" style="display: none;">Fallback</div>
      <div id="cv-content" style="display: none;"></div>
      <a class="cv-download-link" href="#">Download</a>
    `;

    mockElements = {
      loading: document.getElementById('cv-loading'),
      error: document.getElementById('cv-error'),
      fallback: document.getElementById('cv-fallback'),
      content: document.getElementById('cv-content')
    };

    cvLoader = new CVLoader();
    
    // Mock console methods
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('Constructor', () => {
    it('should initialize with correct default values', () => {
      expect(cvLoader.cache).toBe(null);
      expect(cvLoader.cacheTime).toBe(null);
      expect(cvLoader.cacheDuration).toBe(3 * 60 * 60 * 1000);
      expect(cvLoader.pdfUrl).toBe(null);
    });
  });

  describe('Cache Management', () => {
    it('should use cached content when available and fresh', async () => {
      // Setup cache
      cvLoader.cache = {
        htmlContent: '<p>Cached content</p>',
        title: 'Cached Title',
        email: 'cached@test.com'
      };
      cvLoader.cacheTime = Date.now() - 1000; // 1 second ago

      const displaySpy = vi.spyOn(cvLoader, 'displayCV');
      const fetchPdfSpy = vi.spyOn(cvLoader, 'fetchPdfUrl').mockResolvedValue();

      await cvLoader.fetchCV();

      expect(mockElements.loading.style.display).toBe('none');
      expect(displaySpy).toHaveBeenCalledWith('<p>Cached content</p>', 'Cached Title', 'cached@test.com');
      expect(fetchPdfSpy).toHaveBeenCalled();
    });

    it('should not use expired cache', async () => {
      // Setup expired cache
      cvLoader.cache = { htmlContent: '<p>Old content</p>', title: 'Old', email: 'old@test.com' };
      cvLoader.cacheTime = Date.now() - (4 * 60 * 60 * 1000); // 4 hours ago

      const fetchLatexSpy = vi.spyOn(cvLoader, 'fetchLatexContent').mockResolvedValue();
      const fetchPdfSpy = vi.spyOn(cvLoader, 'fetchPdfUrl').mockResolvedValue();

      await cvLoader.fetchCV();

      expect(fetchLatexSpy).toHaveBeenCalled();
      expect(fetchPdfSpy).toHaveBeenCalled();
    });
  });

  describe('LaTeX Content Fetching', () => {
    it('should fetch and process LaTeX content successfully', async () => {
      const mockLatexContent = '\\\\section{Skills}\\\\textbf{JavaScript}';
      const mockResponse = {
        ok: true,
        text: () => Promise.resolve(mockLatexContent)
      };

      fetch.mockResolvedValue(mockResponse);
      const displaySpy = vi.spyOn(cvLoader, 'displayCV').mockImplementation(() => {});

      await cvLoader.fetchLatexContent();

      expect(fetch).toHaveBeenCalledWith('https://raw.githubusercontent.com/oscar-barlow/CV/master/CV.tex');
      expect(cvLoader.cache).toBeDefined();
      expect(cvLoader.cacheTime).toBeDefined();
      expect(displaySpy).toHaveBeenCalled();
    });

    it('should handle LaTeX fetch errors', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };

      fetch.mockResolvedValue(mockResponse);

      await expect(cvLoader.fetchLatexContent()).rejects.toThrow('HTTP 404: Not Found');
    });
  });

  describe('PDF URL Fetching', () => {
    it('should fetch PDF URL from GitHub API successfully', async () => {
      const mockRelease = {
        tag_name: '2025-01-01'
      };
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockRelease)
      };

      fetch.mockResolvedValue(mockResponse);
      const updateLinksSpy = vi.spyOn(cvLoader, 'updateDownloadLinks').mockImplementation(() => {});

      await cvLoader.fetchPdfUrl();

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/oscar-barlow/CV/releases/latest');
      expect(cvLoader.pdfUrl).toBe('https://github.com/oscar-barlow/CV/releases/download/2025-01-01/Oscar.Barlow.CV.2025-01-01.pdf');
      expect(updateLinksSpy).toHaveBeenCalled();
    });

    it('should use fallback URL when API fails', async () => {
      fetch.mockRejectedValue(new Error('Network error'));
      const updateLinksSpy = vi.spyOn(cvLoader, 'updateDownloadLinks').mockImplementation(() => {});

      await cvLoader.fetchPdfUrl();

      expect(cvLoader.pdfUrl).toBe('https://github.com/oscar-barlow/CV/releases/latest');
      expect(updateLinksSpy).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('LaTeX Conversion', () => {
    it('should convert basic LaTeX to HTML', () => {
      const latexInput = '\\\\section{Experience}\\\\textbf{Senior Developer}';
      const result = cvLoader.convertLatex(latexInput);

      expect(result.htmlContent).toContain('<h2 class="cv-section-title">Experience</h2>');
      expect(result.htmlContent).toContain('<strong>Senior Developer</strong>');
      expect(result.title).toBe('Oscar Barlow');
      expect(result.email).toBe('');
    });

    it('should extract title and email from LaTeX', () => {
      const latexInput = '\\\\title{John Doe}\\\\cvsubtitle{john@example.com}';
      const result = cvLoader.convertLatex(latexInput);

      expect(result.title).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
    });
  });

  describe('Display Methods', () => {
    it('should display CV content correctly', () => {
      const htmlContent = '<p>Test content</p>';
      const title = 'Test Title';
      const email = 'test@example.com';

      cvLoader.pdfUrl = 'https://example.com/cv.pdf';
      cvLoader.displayCV(htmlContent, title, email);

      expect(mockElements.content.innerHTML).toContain(title);
      expect(mockElements.content.innerHTML).toContain(email);
      expect(mockElements.content.innerHTML).toContain(htmlContent);
      expect(mockElements.content.style.display).toBe('block');
    });

    it('should update download links', () => {
      cvLoader.pdfUrl = 'https://example.com/test.pdf';
      cvLoader.updateDownloadLinks();

      const downloadLink = document.querySelector('.cv-download-link');
      expect(downloadLink.href).toBe('https://example.com/test.pdf');
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully and show fallback', async () => {
      const fetchLatexSpy = vi.spyOn(cvLoader, 'fetchLatexContent').mockRejectedValue(new Error('Network error'));
      const fetchPdfSpy = vi.spyOn(cvLoader, 'fetchPdfUrl').mockResolvedValue();

      // Mock setTimeout to run immediately for testing
      vi.spyOn(global, 'setTimeout').mockImplementation((fn) => fn());

      await cvLoader.fetchCV();

      expect(console.error).toHaveBeenCalledWith('Error loading CV:', expect.any(Error));
      expect(mockElements.loading.style.opacity).toBe('0');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full CV loading cycle', async () => {
      const mockLatexContent = '\\\\section{Skills}\\\\textbf{JavaScript}';
      const mockRelease = { tag_name: '2025-01-01' };
      
      fetch
        .mockResolvedValueOnce({ // GitHub API call first
          ok: true,
          json: () => Promise.resolve(mockRelease)
        })
        .mockResolvedValueOnce({ // LaTeX content call second
          ok: true,
          text: () => Promise.resolve(mockLatexContent)
        });

      await cvLoader.fetchCV();

      expect(cvLoader.cache).toBeDefined();
      expect(cvLoader.pdfUrl).toBe('https://github.com/oscar-barlow/CV/releases/download/2025-01-01/Oscar.Barlow.CV.2025-01-01.pdf');
      expect(mockElements.content.style.display).toBe('block');
    });
  });
});