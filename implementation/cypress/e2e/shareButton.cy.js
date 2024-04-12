describe('Share Tets', function() {
    it('Share a List', function() {
      cy.visit('http://localhost:8081')

      cy.get('#addButton').click()

      cy.get('#shoppingName').type('Merkur')
      cy.get('#shoppingTags').type('Mayer')
      cy.get('#checkList').click()

      cy.get('#moreButton').click()

      cy.get('#shareButton').click()

      cy.task('getClipboard').then((url) => {
        // Schritt 4: Besuche die URL aus der Zwischenablage
        cy.visit(url);

        // Schritt 5: Überprüfe, ob die Liste korrekt angezeigt wird
        cy.get('#shoppingName').invoke('val').then((text) => {
          expect(text).to.equal('Merkur');
        });
      });

    })
  })