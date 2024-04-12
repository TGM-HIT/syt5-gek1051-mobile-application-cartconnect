describe('Test Sortieren der Listenitems', () => {
    it('Sortiere die Items auf einer Liste', () => {
      cy.visit('http://localhost:8081')

      cy.get('#addButton').click()

      cy.get('#shoppingName').type('Merkur')
      cy.get('#shoppingTags').type('Mayer')
      cy.get('#checkList').click()
      cy.get('#editItemsListButton').click()

      cy.get('#itemInput').type('Apfel')
      cy.get('#addItemstoList').click()

      cy.get('#itemInput').type('Zitrone')
      cy.get('#addItemstoList').click()

      cy.get('#itemInput').type('Brot')
      cy.get('#addItemstoList').click()

      cy.get('#sortOrderButton').click()
      cy.get('.md-list-text-container #itemContainer span').first().invoke('text').then((text) => {
        expect(text.trim()).to.equal('Brot'); 
      });

      cy.get('#sortOrderButton').click()
      cy.get('.md-list-text-container #itemContainer span').first().invoke('text').then((text) => {
        expect(text.trim()).to.equal('Apfel'); 
      });

      cy.get('#sortTypeButton').click()
      cy.get('.md-list-text-container #itemContainer span').first().invoke('text').then((text) => {
        expect(text.trim()).to.equal('Apfel'); 
      });

      cy.get('#sortTypeButton').click()
      cy.get('.md-list-text-container #itemContainer span').first().invoke('text').then((text) => {
        expect(text.trim()).to.equal('Zitrone'); 
      });
    })
  })