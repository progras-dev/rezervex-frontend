// https://docs.cypress.io/api/introduction/api.html

describe('basic', function() {

  it('visits the homepage', function() {

    cy.visit('http://localhost:8080/#/')

    cy.contains('Giriş')

    cy.get('#input-email')
      .type('francesco.mussi@hotmail.it')

    cy.get('#input-password')
      .type('111111')

    cy.get('#login-button').click()

  })
})