const blocks = document.querySelectorAll('code.language-mermaid')

if (blocks.length > 0) {
  import('mermaid').then(({ default: mermaid }) => {
    // Replace each <pre><code class="language-mermaid">...</code></pre> with
    // <pre class="mermaid">plain text</pre>. We use textContent to both strip
    // the <code> wrapper and decode HTML entities (e.g. --&gt; → -->).
    blocks.forEach(code => {
      const pre = code.parentElement
      pre.textContent = code.textContent
      pre.classList.add('mermaid')
    })
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        background: '#ffffff',
        primaryColor: '#f7edef',
        primaryBorderColor: '#722F37',
        primaryTextColor: '#1a1a1a',
        secondaryColor: '#e8f0f0',
        tertiaryColor: '#ffffff',
        lineColor: '#2F5F5F',
        edgeLabelBackground: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      }
    })
    mermaid.run({ querySelector: 'pre.mermaid' })
  })
}
