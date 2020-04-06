describe('my first test', function() {
  it('does not do much', function() {
    expect(true).to.equal(true)
  })

  it('visits the kitchen sink and test email field', function() {
    // Arrange - setup initial app state
        // - visit a webpage
        // - query for an element
    // Act - take an action
        // - once found an element, interact with it
    // Assert - make an assertion
        // - make an assetion about page content

    cy.visit('https://example.cypress.io/')

    // cy.pause()

    cy.contains('type').click()

    cy.url()
      .should('include', '/commands/actions')

    cy.get('.action-email')
      .type('fake@gmail.com')
      .should('have.value', 'fake@gmail.com')
  })
})