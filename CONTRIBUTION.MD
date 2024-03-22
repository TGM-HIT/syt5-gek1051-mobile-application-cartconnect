# CONTRIBUTION

## Team

| Name               | E-Mail                          | Rolle               |
| ------------------ | ------------------------------- | ------------------- |
| Alexander Hauser   | ahauser2@student.tgm.ac.at      | Technical Architect |
| Niklas Kisser      | nkisser@student.tgm.ac.at       | Product Owner       |
| Benjamin Kissinger | bkissinger@student.tgm.ac.at    | Ameise              |
| Lukas Latschbacher | llatschbacher@student.tgm.ac.at | Bmeise              |



## Commit Message Konvention

Unsere Projektgruppe verwendet die Konvention für git commit messages gemäß den Richtlinien von [Conventional Commits](https://github.com/pvdlg/conventional-commit-types), um eine klare und einheitliche Struktur in unseren Commit-Nachrichten zu gewährleisten. Dies erleichtert die Verfolgung von Änderungen und ermöglicht eine bessere Zusammenarbeit innerhalb des Teams.

### Commit-Typen

Wir verwenden die folgenden Commit-Typen gemäß der Conventional Commit-Spezifikation:

- **feat**: für die Einführung einer neuen Funktion oder eines neuen Features
- **fix**: für die Behebung eines Fehlers oder einer Bug
- **docs**: für Änderungen an der Dokumentation
- **style**: für Änderungen, die die Formatierung, Leerzeichen oder Semantik betreffen, jedoch keinen Code ändern (z. B. Formatierung)
- **refactor**: für Code-Änderungen, die weder eine Fehlerbehebung noch das Hinzufügen einer Funktion bewirken
- **test**: für das Hinzufügen oder die Aktualisierung von Tests
- **chore**: für sonstige Änderungen, die nicht in die obigen Kategorien passen

### Commit Nachrichtenformat

Das Format unserer Commit-Nachrichten sollte wie folgt aussehen:

```
php
<type>(<scope>): <description>

[optional body]

[optional footer]
```

- `<type>`: Der Typ des Commits gemäß der oben genannten Liste.
- `<scope>`: Der Bereich des Codes, auf den sich der Commit bezieht (optional).
- `<description>`: Eine präzise Beschreibung der Änderungen im Commit.
- `[optional body]`: Zusätzliche Informationen oder Kontext zum Commit (optional).
- `[optional footer]`: Fußnoten wie Schließung von Issues oder Referenzen (optional).

Durch die Verwendung dieser Konventionen erleichtern wir die Automatisierung von Release-Notes, Changelog-Einträgen und anderen Prozessen, die auf unseren Commit-Nachrichten basieren. Dies trägt dazu bei, eine klare und transparente Entwicklungsgeschichte für unser Projekt zu gewährleisten.



## Branching-Regeln

Unser Projekt folgt einem agilen Arbeitsansatz, der eine effiziente Zusammenarbeit und eine klare Strukturierung des Codes gewährleistet. Um eine konsistente und stabile Codebasis zu gewährleisten, haben wir bestimmte Regeln für das Branching festgelegt:

### Hauptbranch (main)

- Der Hauptbranch (main) ist gesperrt, um direkte Änderungen zu verhindern.
- Alle Änderungen am Code müssen über Pull Requests eingereicht werden.

### Teammitglieder-Branches

- Jedes Teammitglied hat seinen eigenen Branch, der nach dem Namensschema "<Name des Teammitglieds>" benannt ist.
- Auf diesen Branches arbeiten die Teammitglieder an ihren zugewiesenen Aufgaben und neuen Features.

### Pull Requests

- Um Änderungen in den Hauptbranch (main) zu integrieren, muss ein Pull Request erstellt werden.
- Der Pull Request muss von mindestens einem anderen Teammitglied überprüft und bestätigt werden, bevor er gemergt werden kann.
- Bei Bedarf können weitere Anpassungen und Diskussionen über den Code im Pull Request erfolgen, um sicherzustellen, dass die Änderungen den Projektstandards entsprechen und keine Probleme verursachen.

Diese Branching-Regeln helfen uns, eine saubere Codebasis aufrechtzuerhalten, die leicht zu verwalten und zu pflegen ist, und ermöglichen es jedem Teammitglied, effektiv an unserem Projekt zu arbeiten.

### Arbeitsweise
Um neue Funktionen zu testen wird lokal eine CouchDB-Instanz mittels docker-compose erstellt. Die finale Version wird eine Couch-DB Instanz mittels eines IBM-Cloudant Services verwenden.

## API Entrypoints

### PouchDB Initialisierung
```javascript
// Initialize PouchDB database
var db = new PouchDB('shopping-list');
```

Hier wird eine Instanz von PouchDB erstellt, die für die lokale Speicherung der Einkaufslisten und -elemente verwendet wird. Der Name der Datenbank lautet 'shopping-list'.

### Template Objects
```javascript
// Template for shopping list object
const sampleShoppingList = { ... };

// Template for shopping list item object
const sampleListItem = { ... };
```

Diese beiden Objekte dienen als Vorlagen für neue Einkaufslisten und Einkaufslistelemente. Sie enthalten leere Platzhalterfelder für verschiedene Eigenschaften, die später mit spezifischen Daten gefüllt werden.

### Sorting Function
```javascript
/**
 * Sort comparison function to sort an object by "createdAt" field
 *
 * @param  {Object} a
 * @param  {Object} b
 * @returns {Number}
 */
const newestFirst = (a, b) => { ... };
```

Diese Funktion wird verwendet, um Objekte nach ihrem "createdAt" Feld zu sortieren. Sie wird insbesondere für die Sortierung von Einkaufslisten und Einkaufslistelementen nach dem Erstellungsdatum verwendet.

### AJAX Request Function
```javascript
/**
 * Perform an "AJAX" request i.e call the URL supplied with the 
 * a querystring constructed from the supplied object
 *
 * @param  {String} url 
 * @param  {Object} querystring 
 * @returns {Promise}
 */
const ajax = function (url, querystring) { ... };
```

Die ajax-Funktion führt eine AJAX-Anfrage an eine bestimmte URL mit einem angegebenen Query-String-Objekt aus. Diese Funktion wird genutzt, um Daten von externen Quellen abzurufen, wie zum Beispiel Ortsinformationen von OpenStreetMap.

### Vue Material Plugin und Theme Setup
```javascript
// Vue Material plugin setup
Vue.use(VueMaterial);

// Vue Material theme setup
Vue.material.registerTheme('default', { ... });
```

Hier wird das Vue Material Plugin eingebunden und ein Standard-Thema registriert. Dies ermöglicht die Verwendung von Material Design-Komponenten in der Vue.js-Anwendung mit einem voreingestellten Farbschema.

## Arbeiten/Testen mit Cypress.io
Cypress.io ist ein End-to-End-Test-Framework, das entwickelt wurde, um Entwicklern zu helfen, ihre Webanwendungen effizient zu testen [^1]. Es ermöglicht das Schreiben von Tests in einer einfach zu verstehenden Syntax und bietet eine Vielzahl von Funktionen, die das Testen von Webanwendungen vereinfachen.

**Eine Story gilt erst als abgeschlossen, sobald ein funktionierender Test erstellt wurde, welcher die Funktionalität überprüft.**

### Installation von Cypress
Cypress ist bereits im [package.json](implementation/package.json) enthalten, daher reicht ein einfaches `npm install` aus, um sich das javascript Framework herunterzuladen.

### Schreiben von Tests
Tests in Cypress werden in JavaScript geschrieben und folgen einer einfachen Syntax, die auf Mocha und Chai basiert. Ein einfacher Test könnte so aussehen:

```JavaScript
describe('Mein erster Test', function() {
  it('Besucht meine Webseite', function() {
    cy.visit('https://cart-connect.netlify.app/')
  })
})
```
Für einen komplexeren Test, welcher die Funktionalität der Datenbank überprüft, kann man  [hier](implementation/cypress/e2e/connectDatabase.cy.js) schauen.

### Ausführen von Tests
Diesen Befehl im Terminal ausführen:

```bash
npx cypress open
```

Das öffnet das Cypress Test Runner-Fenster, in dem man die Tests auswählen und ausführen können.


### Weitere Informationen
Für weitere Informationen über das Arbeiten mit Cypress, einschließlich detaillierter Anleitungen und Beispiele, besuchen Sie bitte die offizielle [Cypress-Dokumentation](https://docs.cypress.io/guides/overview/why-cypress/).

## Prompt Verzeichnis
[^1]: "Was ist Cypress.io? Fasse die wichtigsten Funktionalitäten zusammen! (ChatGPT, 22.03.2024)"
