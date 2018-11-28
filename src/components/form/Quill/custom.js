export const registerHr = () => {
  return new Promise(resolve => {
    const BlockEmbed = Quill.import('blots/block/embed')
    class Hr extends BlockEmbed {
      static create(value) {
        const node = super.create(value)
        return node
      }
    }
    Hr.blotName = 'hr'
    Hr.tagName = 'hr'
    Quill.register({ 'formats/hr': Hr, })
    resolve()
  })
}

export const registerEmbed = () => {
  return new Promise(resolve => {
    const BlockEmbed = Quill.import('blots/block/embed')
    class Embbed extends BlockEmbed {
      static create(value) {
        const node = super.create(value)
        node.innerHTML = value
        return node
      }
    }
    Embbed.blotName = 'embed'
    Embbed.tagName = 'div'
    Quill.register({ 'formats/embed': Embbed, })
    resolve()
  })
}

export const registerFigcaption = hintWording => {
  return new Promise(resolve => {
    const Block = Quill.import('blots/block')
    class Figcaption extends Block {
      static create(value) {
        const node = super.create(value)
        node.innerText = hintWording || 'Please enter the description for this image.'
        return node
      }
      static value(node) {
        return node.innerText
      }
    }
    Figcaption.blotName = 'figcaption'
    Figcaption.tagName = 'figcaption'
    Quill.register({ 'formats/figcaption': Figcaption, })  
    resolve()    
  })
}
