/// <reference types="cypress" />

it('transcribes video', () => {
  let finished = false
  const output = {
    results: null,
  }

  cy.visit('index.html')
  cy.get('video').then(($video) => {
    const recognition = new webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = function () {
      console.log('recognition.onstart')
      finished = false
    }
    recognition.onerror = function (event) {
      console.error(event.error)
      finished = true
    }
    recognition.onend = function () {
      console.log('recognition.onend')
      finished = true
    }
    recognition.onresult = function (event) {
      console.log('recognition.onresult')
      console.log(event.results)
      output.results = event.results
    }

    console.log('starting recognition')
    recognition.start()

    $video[0].play()
  })

  // wait for the recognition to stop
  cy.wrap(null, { timeout: 20000 }).should(() => {
    expect(output.results, 'results').to.have.length(1)
    expect(output.results[0], 'isFinal').to.have.property('isFinal', true)
  })

  // show the final transcript
  cy.wrap(output, { log: true }).its('results.0.0.transcript').then(cy.log)
})
