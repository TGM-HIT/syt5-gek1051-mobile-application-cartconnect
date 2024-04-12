describe('Darkmode Test', function() {
    it('Schaltet den Darkmode ein', function() {
        cy.visit('http://localhost:8081')

        cy.get('#darkmodeButton').click()

        cy.get('body').should('have.class', 'dark-mode');

    })
  })