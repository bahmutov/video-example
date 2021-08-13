/// <reference types="cypress" />

it('has known duration', () => {
  cy.visit('index.html')
  cy.get('video').should('have.prop', 'duration', 6.8)
})

it('has some positive duration', () => {
  cy.visit('index.html')
  // at first it is NaN, then it becomes a number
  cy.get('video').should(($video) => {
    expect($video[0].duration).to.be.gt(0)
  })
})

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

  // wait for the video to finish playing
  // by retrying the assertion
  // I think our video is about 6 seconds long
  cy.get('video', { timeout: 10000 }).should('have.prop', 'ended', true)
})

it('plays video at 4x speed', () => {
  cy.visit('index.html')
  cy.get('video').then(($video) => {
    $video[0].playbackRate = 4
    $video[0].play()
  })

  // wait for the video to finish playing
  // because the video is playing at 4x speed
  // we don't have to wait as long
  cy.get('video', { timeout: 2000 }).should('have.prop', 'ended', true)
})
