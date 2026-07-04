# 🎬 Scenár Studio — návod na inštaláciu

Základný scenáristický nástroj pre **Google Docs** (inšpirovaný Arc Studio / Final Draft).
Zdieľanie, komentáre a písanie viacerých ľudí naraz rieši samotný Google Docs — script pridáva
scenáristické formátovanie, navigáciu po scénach a štatistiky.

## Inštalácia (cca 3 minúty, raz pre každý dokument)

1. Otvor (alebo vytvor) dokument na [docs.google.com](https://docs.google.com).
2. V menu klikni na **Rozšírenia → Apps Script** (Extensions → Apps Script).
3. Otvorí sa editor scriptov. Do súboru `Kód.gs` (Code.gs) vlož **celý obsah súboru
   [`Code.gs`](Code.gs)** z tohto priečinka (pôvodný obsah zmaž).
4. Klikni na **➕ vedľa „Súbory"** → **HTML** → pomenuj ho presne **`Sidebar`**
   (bez prípony, tá sa doplní sama). Vlož doň celý obsah súboru
   [`Sidebar.html`](Sidebar.html).
5. Ulož (💾 alebo Ctrl+S) a **znovu načítaj dokument** (F5).
6. V menu dokumentu sa objaví položka **🎬 Scenár Studio**.
7. Pri prvom použití si Google vypýta povolenie — potvrď, že scriptu dôveruješ
   (je to tvoj vlastný script, beží len v tvojom dokumente).

> **Tip:** Ak chceš nástroj v každom novom scenári, sprav si jeden dokument ako
> **šablónu** — nainštaluj script raz a nové scenáre začínaj cez
> *Súbor → Vytvoriť kópiu* (script sa skopíruje spolu s dokumentom).

## Ako sa s tým píše

1. Najprv spusti **🎬 Scenár Studio → Nastaviť stránku scenára**
   (Courier 12, okraje 1,5" / 1" — štandard).
2. Otvor **🎬 Scenár Studio → Otvoriť panel** — bočný panel s tlačidlami.
3. Píš normálne a formátuj:
   - **✨ Rozpoznať automaticky** — postav kurzor na riadok (alebo označ viac riadkov)
     a script sám určí, či je to scéna, postava, dialóg…
   - alebo klikni na konkrétny prvok (Scéna / Akcia / Postava / Dialóg / Zátvorka / Prechod).
4. **✨ Preformátovať celý dokument** — vezme hotový text (napr. prilepený odinakiaľ)
   a naformátuje ho celý naraz.

### Ako funguje automatické rozpoznanie

| Riadok | Rozpozná sa ako |
|---|---|
| `INT. KUCHYŇA - DEŇ` / `EXT. ULICA - NOC` | Scéna |
| `MIRO` (KRÁTKY RIADOK VEĽKÝMI PÍSMENAMI) | Postava |
| riadok hneď za postavou | Dialóg |
| `(potichu)` | Zátvorka |
| `STRIH NA:`, `CUT TO:`, `FADE OUT` | Prechod |
| všetko ostatné | Akcia |

## Bočný panel

- **Štatistiky** — odhad strán (55 riadkov/strana) a minút (1 strana ≈ 1 minúta), počet scén a slov.
- **Scény** — klikateľný zoznam scén, skok kurzorom priamo na scénu.
- **Postavy** — zoznam postáv s počtom replík.
- **Očíslovať scény** — pridá `1.`, `2.`… pred INT./EXT. (a dá sa aj odstrániť cez menu).
- **Titulná strana** — vygeneruje titulku s názvom a autorom.

## Zdieľanie a spolupráca

Nič navyše netreba — funguje štandardný Google Docs:

- **Zdieľať** (vpravo hore) → pridaj e-mail, alebo vytvor odkaz na čítanie/komentovanie/úpravy.
- Komentáre, návrhy (suggesting mode) a história verzií fungujú normálne.
- Spoluautor **nemusí script inštalovať** na čítanie a komentovanie. Ak chce aj formátovať
  cez panel, script v dokumente už je — stačí, keď povolenia potvrdí aj on.

## Obmedzenia (čím sa to líši od Arc Studia)

- Google Docs nepodporuje vlastné klávesové skratky pre scripty — formátuje sa
  cez bočný panel alebo menu (najrýchlejšie: kurzor na riadok → ✨ Rozpoznať).
- Automatické „ďalší prvok po Enteri" (ako v Arc Studiu) sa v Docs nedá spraviť —
  náhradou je automatické rozpoznanie riadku.
- Export do PDF je štandardný Docs export (*Súbor → Stiahnuť → PDF*) — formát sedí,
  lebo dokument je fyzicky naformátovaný ako scenár.
