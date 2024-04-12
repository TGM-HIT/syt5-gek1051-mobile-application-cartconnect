describe('Test download functionality', () => {
    it('should start download when button is clicked', () => {
      cy.visit('http://localhost:8081');
  
      // Setze eine benutzerdefinierte Eigenschaft, um den Download-Status zu verfolgen
      let downloadStarted = false;
      cy.window().then(win => {
        win.addEventListener('before:download', () => {
          downloadStarted = true;
        });
      });
  
      // Klicke auf den Download-Button
      cy.get('#pdfButton').click();
  
      // Überprüfe, ob der Download gestartet wurde
      cy.readFile("/home/ben10/OneDrive/TGM/5/SYT/DezSys/syt5-gek1051-mobile-application-cartconnect/implementation/cypress/downloads/shopping_lists.pdf") // GOOD   
     });
  });
  
