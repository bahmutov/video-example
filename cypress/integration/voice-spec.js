/// <reference types="cypress" />

it('transcribes video', () => {
  const state = {
    started: false,
    finished: false,
  }

  cy.visit('index.html').then(() => {
    const recognition = new webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = function () {
      console.log('recognition.onstart')
      state.started = true
    }
    recognition.onerror = function (event) {
      console.error(event.error)
      state.finished = true
      // TODO: handle error, probably should check for it in the test
    }
    recognition.onend = function () {
      console.log('recognition.onend')
      state.finished = true
    }
    recognition.onresult = function (event) {
      console.log('recognition.onresult')
      console.log(event.results)
      state.results = event.results
    }

    console.log('starting recognition')
    recognition.start()
  })

  // wait for recognition to start before playing the video
  cy.wrap(state).should('have.property', 'started', true)

  cy.get('video').then(($video) => {
    $video[0].play()
  })

  // wait for the recognition to stop
  cy.wrap(state, { timeout: 30000 }).should('have.property', 'finished', true)

  // wait for the recognition results
  cy.wrap(state, { timeout: 20000 })
    .should((o) => {
      expect(o.results, 'results').to.have.length(1)
      expect(o.results[0], 'isFinal').to.have.property('isFinal', true)
    })
    // show the final transcript
    .its('results.0.0.transcript')
    .then(cy.log)
})
