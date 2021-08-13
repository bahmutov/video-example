/// <reference types="cypress" />

it('plays video', () => {
  cy.visit('index.html')
  // https://html.spec.whatwg.org/multipage/media.html#playing-the-media-resource
  cy.get('video')
    .should('have.prop', 'paused', true)
    .and('have.prop', 'ended', false)
    .then(($video) => {
      $video[0].play()
    })

  // once the video starts playing, check props
  cy.get('video')
    .should('have.prop', 'paused', false)
    .and('have.prop', 'ended', false)
})
