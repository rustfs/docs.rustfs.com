
# # Leitfaden für Beiträge zur RustFS-Dokumentation

Willkommen in der RustFS-Community! Wir freuen uns sehr über Ihr Interesse an der Mitarbeit an unserer Dokumentation. Ihr Beitrag, sei es die Korrektur eines Tippfehlers oder die Übersetzung eines kompletten Leitfadens, ist uns wichtig. Dieser Leitfaden bietet Ihnen klare Anweisungen, damit Sie reibungslos an der gemeinsamen Erstellung der RustFS-Dokumentation mitwirken können.



<p align="center">
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ZH.md">English </a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ZH.md">简体中文</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_JA.md">日本語</a> |
 (#deutsch) |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_FR.md">rançais</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_TR.md">Türkçe</a>
</p>

------




### Inhaltsverzeichnis



1. (#1-was-ist-rustfs)
2. (#2-unsere-mission-zugängliche--sichere-daten-für-alle)
3. (#3-ihr-weg-zum-beitrag)
   - (#31-erste-schritte-ihr-erster-beitrag)
   - (#32-übersetzung-der-dokumentation-eine-neue-sprache-hinzufügen)
4. (#4-der-technische-arbeitsablauf)
   - Voraussetzungen
   - Lokale Entwicklungsumgebung einrichten
   - (#43-pull-request-pr--commit-richtlinien)
   - (#44-automatisierte-prüfungen--bereitstellung)
5. Community & Lizenzierung
   - (#51-danksagungen)
   - Inhaltslizenz



### 1. Was ist RustFS?



RustFS ist eine einfache, hochleistungsfähige, verteilte Objektspeicherlösung. Es ist zu 100 % S3-kompatibel und wird unter der Apache-2.0-Lizenz veröffentlicht, was es zu einer kommerziell freundlichen Open-Source-Software macht.

RustFS ist vollständig in Rust geschrieben – der modernen Programmiersprache, die für Speichersicherheit und außergewöhnliche Leistung bekannt ist.1 Es wird von einer globalen Gemeinschaft talentierter Ingenieure entwickelt und ist als leistungsstarke, zuverlässige Open-Source-Alternative konzipiert, die als direkter Ersatz für Produkte wie MinIO dienen kann.2



### 2. Unsere Mission: Zugängliche & sichere Daten für alle



Wir glauben, dass Datenspeicherung für jeden und überall erschwinglich, zuverlässig und sicher sein sollte.

Hochwertige, mehrsprachige Dokumentation ist für diese Mission von zentraler Bedeutung. Sie ist nicht nur ein Zusatz, sondern der Schlüssel, um die Eintrittsbarriere für Benutzer und Entwickler auf der ganzen Welt zu senken. Wenn Sie eine Anleitung übersetzen oder einen Fehler beheben, helfen Sie Menschen in verschiedenen Sprachgemeinschaften direkt dabei, einfacher robuste und kosteneffiziente Dateninfrastrukturen aufzubauen. Ihre Beiträge befähigen ein globales Publikum und verbessern gemeinsam die Datensicherheit und -souveränität. Dieser gemeinschaftsgetriebene Ansatz des Wissensaustauschs maximiert den Wert des Projekts und hilft uns, unsere Vision wirklich zu verwirklichen.4



### 3. Ihr Weg zum Beitrag



Wir haben verschiedene Wege für unterschiedliche Arten von Mitwirkenden konzipiert. Ob Sie ein kleines Problem schnell beheben oder die gesamte Dokumentation systematisch übersetzen möchten, hier finden Sie die richtige Anleitung.



#### 3.1 Erste Schritte: Ihr erster Beitrag



Der einfachste Weg, um anzufangen, ist, kleine Änderungen direkt über die GitHub-Weboberfläche vorzunehmen. Diese Methode erfordert keine lokale Entwicklungsumgebung und ist perfekt für geringfügige Änderungen.6

Einfache Beiträge, die Sie leisten können, sind:

- Beheben von Tippfehlern oder grammatikalischen Fehlern.
- Korrigieren von defekten Links.
- Klarstellen von verwirrenden Sätzen oder Absätzen.
- Melden eines Problems, für das Sie keine Lösung kennen, indem Sie ein Issue erstellen.

**Der "5-Minuten"-Pull-Request-Prozess:**

1. Navigieren Sie auf der Dokumentationsseite `https://docs.rustfs.com/` zu der Seite, die Sie bearbeiten möchten.
2. Scrollen Sie nach unten und klicken Sie auf den Link "Diese Seite auf GitHub bearbeiten".
3. Dies führt Sie zur entsprechenden Markdown-Quelldatei auf GitHub. Klicken Sie auf das Stiftsymbol (✏️) oben rechts, um in den Bearbeitungsmodus zu gelangen.
4. Nehmen Sie Ihre Änderungen im Texteditor vor.
5. Wenn Sie fertig sind, scrollen Sie nach unten. Geben Sie im Bereich "Propose changes" eine prägnante Commit-Nachricht ein, z. B. "Tippfehler in der Installationsanleitung behoben".
6. Klicken Sie auf die Schaltfläche "Propose changes". GitHub führt Sie dann durch den Prozess der Erstellung eines Pull Requests.

Dieser Prozess dient als ausgezeichneter "Einstieg für Mitwirkende" und ermöglicht es Ihnen, sich ohne komplexe Einrichtung mit unserem Arbeitsablauf vertraut zu machen. Ein erfolgreicher kleiner Beitrag ist oft der erste Schritt zu einem tieferen Engagement.5



#### 3.2 Übersetzung der Dokumentation: Eine neue Sprache hinzufügen



Dies ist der Kernbereich, in dem wir die Hilfe der Community am dringendsten benötigen. Bitte befolgen Sie diese Schritte, um Übersetzungen hinzuzufügen oder zu verbessern.

**Schritt 1: Koordination über GitHub Issues**

Um doppelte Arbeit zu vermeiden und die Zusammenarbeit zu gewährleisten, besuchen Sie bitte unsere(https://github.com/rustfs/rustfs/issues), bevor Sie mit dem Übersetzen beginnen.

- **Hinzufügen einer neuen Sprache**: Prüfen Sie, ob bereits jemand an der Sprache arbeitet, die Sie übersetzen möchten. Wenn nicht, erstellen Sie bitte ein neues Issue mit dem Titel `[i18n] Add <Language> (<lang-code>) Translation`, z. B. `[i18n] Add German (de) Translation`. Dies hilft uns, den Fortschritt zu verfolgen und die Zuständigkeit zuzuweisen.7
- **Verbessern einer bestehenden Übersetzung**: Wenn Sie eine bestehende Übersetzung verbessern möchten, suchen Sie das entsprechende Issue oder erstellen Sie ein neues, in dem Sie die geplanten Verbesserungen detailliert beschreiben.

**Schritt 2: Verstehen der Verzeichnisstruktur**

Unsere Dokumentationsseite wird mit VitePress erstellt, das eine dateibasierte Verzeichnisstruktur zur Verwaltung mehrerer Sprachen verwendet.9 Alle Quelldateien befinden sich im Verzeichnis 

`docs/`.

```
docs/
├── en/                  # Englisch (oder als Stammverzeichnis)
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
├── ja/                  # Japanisch
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
└──.vitepress/
    └── config.ts        # VitePress-Konfigurationsdatei
```

**Schritt 3: Hinzufügen eines neuen Sprachpakets**

1. **Forken und klonen** Sie das Repository auf Ihren lokalen Rechner und erstellen Sie dann einen neuen Branch.

2. Erstellen Sie im Verzeichnis `docs/` einen neuen Ordner mit dem entsprechenden **ISO 639-1-Sprachcode** für Ihre Zielsprache. Bitte beachten Sie die unten stehende Sprachcode-Tabelle.

3. Kopieren Sie den **gesamten Inhalt** von `docs/en/` (oder die englischen Quelldateien im Stammverzeichnis) in Ihren neuen Sprachordner. Dies gibt Ihnen eine vollständige Dateistruktur zum Übersetzen.

4. Öffnen Sie die Datei `docs/.vitepress/config.ts` und fügen Sie einen neuen Eintrag für Ihre Sprache im `locales`-Objekt hinzu.

   Zum Beispiel, um Deutsch (`de`) hinzuzufügen:

   TypeScript

   ```
   //.vitepress/config.ts
   import { defineConfig } from 'vitepress'
   
   export default defineConfig({
     //... andere Konfigurationen
     locales: {
       root: {
         label: 'English',
         lang: 'en'
       },
       // Fügen Sie hier die neue Locale-Konfiguration hinzu
       de: {
         label: 'Deutsch', // Text im Sprach-Dropdown
         lang: 'de',       // HTML-Lang-Attribut
         link: '/de/',     // Link zur Weiterleitung
         // Sie können Theme-Konfigurationen für diese Locale überschreiben,
         // z.B. für Navbar- und Sidebar-Texte.
         themeConfig: {
           nav: [
             { text: 'Anleitung', link: '/de/guide/getting-started' }
           ],
           sidebar: {
             '/de/guide/':
               }
             ]
           }
         }
       }
     }
   })
   ```

   Um Ihnen bei der korrekten Konfiguration zu helfen, erklärt die folgende Tabelle den Zweck jeder Eigenschaft im `locales`-Objekt.9

| Eigenschaft   | Typ      | Erforderlich | Beschreibung                                                 |
| ------------- | -------- | ------------ | ------------------------------------------------------------ |
| `label`       | `string` | Ja           | Der Text, der im Sprachauswahl-Dropdown-Menü in der Navigationsleiste angezeigt wird. |
| `lang`        | `string` | Nein         | Das `lang`-Attribut für das `<html>`-Tag. Wenn nicht angegeben, wird der Verzeichnisname verwendet. |
| `link`        | `string` | Nein         | Der Link, zu dem der Benutzer weitergeleitet wird, wenn er diese Sprache auswählt. Standardmäßig der Stamm-Pfad der Locale (z. B. `/ja/`). |
| `title`       | `string` | Nein         | Überschreibt den Haupttitel der Website für diese spezifische Locale. |
| `description` | `string` | Nein         | Überschreibt die Hauptbeschreibung der Website für diese spezifische Locale. |
| `themeConfig` | `object` | Nein         | Locale-spezifische Theme-Konfiguration. Wird verwendet, um Navbar-Links, Sidebar-Texte usw. zu übersetzen. |

```
Diese Tabelle soll Unklarheiten bei der Konfiguration beseitigen und sicherstellen, dass Mitwirkende es beim ersten Mal richtig machen, was die Notwendigkeit von Korrekturschleifen reduziert.
```

**Schritt 4: Übersetzen des Inhalts**

- Öffnen Sie in Ihrem neuen Sprachverzeichnis die Markdown-Dateien nacheinander und übersetzen Sie den Textinhalt.
- **Wichtig**: Bitte übersetzen Sie **nicht** Folgendes:
  - Schlüssel im Frontmatter (z. B. `title:`, `layout:`).
  - Jeglichen Code innerhalb von Codeblöcken.
  - URL-Links.
  - HTML-Tags.
- Übersetzen Sie nur den für Menschen lesbaren Text.

**Schritt 5: Einreichen Ihres Pull Requests**

Wenn Sie mit dem Übersetzen fertig sind, befolgen Sie bitte die(#43-pull-request-pr--commit-richtlinien), um Ihren Beitrag einzureichen, und stellen Sie sicher, dass Sie ihn mit dem in Schritt 1 erstellten Issue verknüpfen.

**Sprachcode-Referenz**

Um Konsistenz zu gewährleisten, verwenden Sie bitte die Standard-ISO-639-1-Codes aus der folgenden Tabelle.13

| Sprache                  | ISO 639-1 Code    |
| ------------------------ | ----------------- |
| Chinesisch (vereinfacht) | `zh` oder `zh-CN` |
| Englisch                 | `en`              |
| Japanisch                | `ja`              |
| Deutsch                  | `de`              |
| Französisch              | `fr`              |



### 4. Der technische Arbeitsablauf



Für Entwickler, die lokal umfangreichere Beiträge leisten möchten (z. B. das Hinzufügen eines neuen Sprachpakets oder umfangreiche Änderungen), befolgen Sie bitte diesen technischen Arbeitsablauf.



#### 4.1 Voraussetzungen



Bevor Sie beginnen, stellen Sie bitte sicher, dass die folgende Software auf Ihrem System installiert ist:

- **Node.js**: Version `18.x` oder höher.14 Sie können es von der 

  [offiziellen Node.js-Website](https://nodejs.org/) herunterladen.

- **Paketmanager**: Wir empfehlen die Verwendung von `pnpm` für mehr Effizienz. Sie können es global mit `npm install -g pnpm` installieren. Alternativ können Sie `npm` oder `yarn` verwenden.15

- **Git**: Ein Versionskontrollsystem. Sie können es von der [offiziellen Git-Website](https://git-scm.com/) herunterladen.



#### 4.2 Lokale Entwicklungsumgebung einrichten



Befolgen Sie diese Befehlssequenz, um den Entwicklungs-Server für die Dokumentation lokal auszuführen:

1. Repository forken & klonen

   Forken Sie zuerst dieses Repository auf GitHub. Klonen Sie dann Ihren Fork auf Ihren lokalen Rechner.

   Bash

   ```
   # Ersetzen Sie <YOUR_USERNAME> durch Ihren GitHub-Benutzernamen
   git clone https://github.com/<YOUR_USERNAME>/docs.rustfs.com.git
   cd docs.rustfs.com
   ```

2. Abhängigkeiten installieren

   Verwenden Sie pnpm, um alle erforderlichen Projektabhängigkeiten zu installieren.

   Bash

   ```
   pnpm install
   ```

3. Entwicklungs-Server starten

   Dieser Befehl startet einen lokalen Entwicklungs-Server mit Hot-Reloading.

   Bash

   ```
   pnpm docs:dev
   ```

4. Auf die Seite zugreifen

   Nach erfolgreicher Ausführung sollten Sie in Ihrem Terminal eine Ausgabe ähnlich wie VitePress dev server running at: http://localhost:5173/ sehen. Öffnen Sie diese URL in Ihrem Browser, um die Dokumentationsseite zu sehen. Alle Änderungen, die Sie an den Markdown-Dateien vornehmen, werden sofort im Browser angezeigt.15



#### 4.3 Pull Request (PR) & Commit-Richtlinien



Wir folgen einem standardisierten Arbeitsablauf, um Codequalität und eine saubere Projekthistorie zu gewährleisten.

- **Branching-Strategie**

  - Erstellen Sie immer einen neuen Branch für Ihre Arbeit. Committen Sie nicht direkt in den `main`-Branch.
  - Verwenden Sie einen beschreibenden Branch-Namen, wie z. B. `feat/add-german-translation` oder `fix/correct-s3-api-typo`.17

- Commit-Nachrichten-Konvention

  Wir halten uns an die Conventional Commits-Spezifikation. Dies hilft uns, Changelogs zu automatisieren und die Commit-Historie verständlicher zu machen.

  - **Format**: `<type>(<scope>): <subject>`

  - **Beispiele**:

    - `feat(i18n): add initial french translation`

    - `fix(guide): correct typo in getting-started.md`

    - docs(contributing): update local development setup

      Dieser strukturierte Ansatz ist eine bewährte Praxis in vielen reifen Open-Source-Projekten.8

- **Einreichen eines Pull Requests**

  1. Pushen Sie Ihren Branch zu Ihrem Fork: `git push -u origin your-branch-name`.
  2. Öffnen Sie auf GitHub einen Pull Request von Ihrem Fork zum `main`-Branch des `rustfs/docs.rustfs.com`-Repositorys.
  3. **Issue verknüpfen**: Verwenden Sie in der PR-Beschreibung Schlüsselwörter wie `Closes #123` oder `Fixes #123`, um das zuvor erstellte Issue zu verknüpfen. Dies schließt das Issue automatisch, wenn der PR gemerged wird, ein wichtiger Schritt in unserer Workflow-Automatisierung.7
  4. **Schreiben Sie eine klare Beschreibung**: Erklären Sie klar, **was** Sie geändert haben und **warum**. Wenn Ihre Änderungen visuell sind, fügen Sie bitte Vorher-Nachher-Screenshots bei.5

- **Der Review-Prozess**

  - Sobald Sie einen PR eingereicht haben, wird ein Projekt-Maintainer ihn überprüfen.
  - Wir können Änderungen anfordern. Bitte lassen Sie sich davon nicht entmutigen! Dies ist ein normaler Teil der kollaborativen Open-Source-Entwicklung, der darauf abzielt, die Qualität der Beiträge zu verbessern.
  - Sobald Ihr PR genehmigt ist und alle automatisierten Prüfungen bestanden hat, wird ein Maintainer ihn mergen.



#### 4.4 Automatisierte Prüfungen & Bereitstellung



Um die Qualität und Stabilität unserer Dokumentation zu gewährleisten, haben wir eine vollständig automatisierte CI/CD (Continuous Integration/Continuous Deployment)-Pipeline.

- **Automatisierte Prüfungen**: Wenn Sie einen Pull Request einreichen, führt GitHub Actions automatisch eine Reihe von Prüfungen durch. Diese Prüfungen stellen sicher, dass die Dokumentationsseite erfolgreich erstellt wird und die Codeformatierung korrekt ist (Linting).19
- **Automatisierte Bereitstellung**: Sobald Ihr PR in den `main`-Branch gemerged wird, wird GitHub Actions erneut ausgelöst, um automatisch die neueste Version der Seite zu erstellen und sie auf `https://docs.rustfs.com` bereitzustellen.

Indem wir diesen Prozess transparent machen, möchten wir das Vertrauen der Mitwirkenden in unseren Arbeitsablauf stärken. Sie müssen sich nicht um die Details der Bereitstellung kümmern; ein erfolgreicher Merge bedeutet eine erfolgreiche Bereitstellung. Dies gibt Ihnen einen klaren Überblick über den gesamten Lebenszyklus Ihres Beitrags, von der Einreichung bis zur Veröffentlichung.19



### 5. Community & Lizenzierung





#### 5.1 Danksagungen



Die RustFS-Dokumentation wird von der Community für die Community erstellt. Wir sind allen, die ihre Zeit und ihr Fachwissen beitragen, unglaublich dankbar.

Jeder Beitrag, egal wie klein, wird sehr geschätzt. Um alle Beiträge fair und transparent anzuerkennen, verwenden wir die integrierten Werkzeuge von GitHub.

Sie können eine Liste all unserer großartigen Mitwirkenden im **[Contributors-Graph](https://github.com/rustfs/docs.rustfs.com/graphs/contributors)** sehen. Dieser automatisierte, skalierbare Ansatz stellt sicher, dass jeder Beitrag anerkannt wird und immer auf dem neuesten Stand ist.22



#### 5.2 Inhaltslizenz



Alle Dokumentationen in diesem Projekt sind unter der **Creative Commons Namensnennung 4.0 International Lizenz** lizenziert.23

Indem Sie zum RustFS-Dokumentationsprojekt beitragen, stimmen Sie zu, dass Ihre Beiträge unter dieser Lizenz veröffentlicht werden.

Unter dieser Lizenz dürfen Sie:

- **Teilen** — das Material in jedwedem Format oder Medium vervielfältigen und weiterverbreiten.
- **Bearbeiten** — das Material remixen, verändern und darauf aufbauen, und zwar für beliebige Zwecke, sogar kommerziell.

Sie müssen folgende Bedingungen einhalten:

- **Namensnennung (Attribution)** — Sie müssen **angemessene Urheber- und Rechteangaben** machen, einen Link zur Lizenz beifügen und **angeben, ob Änderungen vorgenommen wurden**. Diese Angaben dürfen in jeder angemessenen Art und Weise gemacht werden, allerdings nicht so, dass der Eindruck entsteht, der Lizenzgeber unterstütze gerade Sie oder Ihre Nutzung besonders.23
