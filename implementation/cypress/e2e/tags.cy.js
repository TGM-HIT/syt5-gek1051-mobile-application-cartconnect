describe('Test tag function', () => {
    it('Create a shopping list with tags', () => {
      cy.visit('http://localhost:8081')
  
      cy.get('#addButton').click()
      cy.get('#shoppingName').type('Test Shopping List')
      cy.get('#shoppingTags').type('Ben, Niklas')
      cy.get('#checkList').click()
      cy.get('#displayTags').should('be.visible')


    
    })
  })
  