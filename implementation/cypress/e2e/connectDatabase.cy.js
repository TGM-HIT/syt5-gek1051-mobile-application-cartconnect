describe('Test Database Connection', () => {
  it('Visit the shopping list und enter database url for syncing', () => {
    cy.visit('http://localhost:8081')

    cy.get('#button-settings').click()

    cy.get('#database-link-input').should('be.visible')
    cy.get('#database-link-input').type('https://apikey-v2-acuxi2pr4lwdbym25p2bihjwgqna7bnmk9n3jgh4c8q:0bff15771652f3f1a868939e52dcb96b@5d45a58a-2ea7-47d5-8b73-7cec03892bfb-bluemix.cloudantnosqldb.appdomain.cloud/shopping-list')
    cy.get('#buttonExecute').click()
    cy.get('#syncing').should('be.visible')
  })
})
