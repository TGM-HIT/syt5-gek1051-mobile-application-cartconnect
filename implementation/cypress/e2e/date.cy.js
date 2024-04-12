describe('Test date function', () => {
    it('Create a shopping list with date', () => {
      cy.visit('http://localhost:8081')
  
      cy.get('#addButton').click()
      cy.get('#shoppingName').type('Test Shopping List')
      cy.get('#shoppingDate').type('2021-12-24')
      cy.get('#checkList').click()
      cy.get('#displayDate').should('be.visible')
      cy.get('#hoverButton').click()
      cy.get('#deleteButton').click()
    })
  })
  