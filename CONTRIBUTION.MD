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
