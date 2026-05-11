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
    mermaid.initialize({ startOnLoad: false })
    mermaid.run({ querySelector: 'pre.mermaid' })
  })
}
