describe('Duplicate Tets', function() {
    it('Dupliziert eine Liste', function() {
      cy.visit('http://localhost:8081')

      cy.get('#addButton').click()

      cy.get('#shoppingName').type('Merkur')
      cy.get('#shoppingTags').type('Mayer')
      cy.get('#checkList').click()

      cy.get('#moreButton').click()

      cy.get('#copyButton').click()

    })
  })