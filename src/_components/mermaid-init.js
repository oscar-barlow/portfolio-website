const blocks = document.querySelectorAll('code.language-mermaid')

if (blocks.length > 0) {
  import('mermaid').then(({ default: mermaid }) => {
    const rootStyles = getComputedStyle(document.documentElement)
    const token = name => rootStyles.getPropertyValue(name).trim()

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
        background: token('--color-surface'),
        primaryColor: token('--color-action-soft'),
        primaryBorderColor: token('--color-action'),
        primaryTextColor: token('--color-heading'),
        secondaryColor: token('--color-accent-soft'),
        tertiaryColor: token('--color-surface'),
        lineColor: token('--color-accent'),
        edgeLabelBackground: token('--color-surface'),
        fontFamily: 'Inter, sans-serif',
      }
    })
    mermaid.run({ querySelector: 'pre.mermaid' })
  })
}
