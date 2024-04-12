describe('Test Items Tag hinzufügen', () => {
    it('Tag einem Item zuweisen', () => {
      cy.visit('http://localhost:8081')

      cy.get('#addButton').click()

      cy.get('#shoppingName').type('Merkur')
      cy.get('#shoppingTags').type('Mayer')
      cy.get('#checkList').click()
      cy.get('#editItemsListButton').click()

      cy.get('#itemInput').type('Apfel')
      cy.get('#tagInput').type('Grün')
      cy.get('#addItemstoList').click()

      cy.get('#displayTags').should('be.visible');

      cy.get('#displayTags .tag').should('exist');
    })
  })