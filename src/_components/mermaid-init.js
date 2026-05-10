const blocks = document.querySelectorAll('code.language-mermaid')

if (blocks.length > 0) {
  import('mermaid').then(({ default: mermaid }) => {
    blocks.forEach(el => {
      el.parentElement.classList.add('mermaid')
    })
    mermaid.initialize({ startOnLoad: true })
  })
}
