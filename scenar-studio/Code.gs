/**
 * SCENÁR STUDIO — základný scenáristický nástroj pre Google Docs
 * (inšpirované Arc Studio / Final Draft)
 *
 * Inštalácia: pozri NAVOD.md
 * Zdieľanie a spolupráca fungujú natívne cez Google Docs (tlačidlo Zdieľať).
 */

// ─────────────────────────────────────────────
// KONŠTANTY — štandardný scenáristický formát
// (Courier 12, okraje v bodoch: 1" = 72 pt)
// ─────────────────────────────────────────────
var FONT = 'Courier New';
var FONT_SIZE = 12;

// Odsadenia sú merané od ľavého okraja strany (1,5")
var EL = {
  SCENA: {
    indentStart: 0, indentEnd: 0,
    caps: true, bold: true,
    spacingBefore: 24, spacingAfter: 12,
    alignment: DocumentApp.HorizontalAlignment.LEFT
  },
  AKCIA: {
    indentStart: 0, indentEnd: 0,
    caps: false, bold: false,
    spacingBefore: 0, spacingAfter: 12,
    alignment: DocumentApp.HorizontalAlignment.LEFT
  },
  POSTAVA: {
    indentStart: 144, indentEnd: 0,           // 2,0" od okraja
    caps: true, bold: false,
    spacingBefore: 12, spacingAfter: 0,
    alignment: DocumentApp.HorizontalAlignment.LEFT
  },
  ZATVORKA: {
    indentStart: 108, indentEnd: 144,         // (potichu), (pauza)…
    caps: false, bold: false,
    spacingBefore: 0, spacingAfter: 0,
    alignment: DocumentApp.HorizontalAlignment.LEFT
  },
  DIALOG: {
    indentStart: 72, indentEnd: 108,          // 1,0" od okraja
    caps: false, bold: false,
    spacingBefore: 0, spacingAfter: 12,
    alignment: DocumentApp.HorizontalAlignment.LEFT
  },
  PRECHOD: {
    indentStart: 0, indentEnd: 0,
    caps: true, bold: false,
    spacingBefore: 12, spacingAfter: 12,
    alignment: DocumentApp.HorizontalAlignment.RIGHT
  }
};

// ─────────────────────────────────────────────
// MENU
// ─────────────────────────────────────────────
function onOpen() {
  DocumentApp.getUi()
    .createMenu('🎬 Scenár Studio')
    .addItem('Otvoriť panel', 'showSidebar')
    .addSeparator()
    .addItem('Scéna (INT./EXT.)', 'fmtScena')
    .addItem('Akcia', 'fmtAkcia')
    .addItem('Postava', 'fmtPostava')
    .addItem('Zátvorka (poznámka)', 'fmtZatvorka')
    .addItem('Dialóg', 'fmtDialog')
    .addItem('Prechod (STRIH NA:)', 'fmtPrechod')
    .addSeparator()
    .addItem('✨ Rozpoznať riadok automaticky', 'autoFormatSelection')
    .addItem('✨ Preformátovať celý dokument', 'autoFormatDocument')
    .addSeparator()
    .addItem('Nastaviť stránku scenára', 'setupDocument')
    .addItem('Vložiť titulnú stranu', 'insertTitlePage')
    .addItem('Očíslovať scény', 'numberScenes')
    .addItem('Odstrániť čísla scén', 'removeSceneNumbers')
    .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('🎬 Scenár Studio');
  DocumentApp.getUi().showSidebar(html);
}

// ─────────────────────────────────────────────
// NASTAVENIE DOKUMENTU (okraje + písmo)
// ─────────────────────────────────────────────
function setupDocument() {
  var body = DocumentApp.getActiveDocument().getBody();
  body.setMarginLeft(108);   // 1,5"
  body.setMarginRight(72);   // 1,0"
  body.setMarginTop(72);
  body.setMarginBottom(72);
  var style = {};
  style[DocumentApp.Attribute.FONT_FAMILY] = FONT;
  style[DocumentApp.Attribute.FONT_SIZE] = FONT_SIZE;
  style[DocumentApp.Attribute.LINE_SPACING] = 1;
  body.setAttributes(style);
  DocumentApp.getUi().alert('Stránka je nastavená na scenáristický formát (Courier 12, okraje 1,5" / 1").');
}

// ─────────────────────────────────────────────
// FORMÁTOVANIE PRVKOV
// ─────────────────────────────────────────────
function fmtScena()    { applyToSelection_('SCENA'); }
function fmtAkcia()    { applyToSelection_('AKCIA'); }
function fmtPostava()  { applyToSelection_('POSTAVA'); }
function fmtZatvorka() { applyToSelection_('ZATVORKA'); }
function fmtDialog()   { applyToSelection_('DIALOG'); }
function fmtPrechod()  { applyToSelection_('PRECHOD'); }

function applyToSelection_(type) {
  getSelectedParagraphs_().forEach(function (p) { applyElement_(p, type); });
}

function applyElement_(para, type) {
  var spec = EL[type];
  if (!spec) return;

  var text = para.getText();
  if (spec.caps && text && text !== text.toUpperCase()) {
    para.setText(text.toUpperCase());
  }
  para.setIndentStart(spec.indentStart);
  para.setIndentFirstLine(spec.indentStart);
  para.setIndentEnd(spec.indentEnd);
  para.setAlignment(spec.alignment);
  para.setSpacingBefore(spec.spacingBefore);
  para.setSpacingAfter(spec.spacingAfter);
  para.setLineSpacing(1);

  var t = para.editAsText();
  if (para.getText().length > 0) {
    t.setFontFamily(FONT);
    t.setFontSize(FONT_SIZE);
    t.setBold(spec.bold);
    t.setItalic(false);
  }
}

function getSelectedParagraphs_() {
  var doc = DocumentApp.getActiveDocument();
  var paras = [];
  var seen = {};

  function addPara(el) {
    while (el && el.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      el = el.getParent();
    }
    if (el) {
      var key = el.getText() + '@' + el.getParent().getChildIndex(el);
      if (!seen[key]) { seen[key] = true; paras.push(el.asParagraph()); }
    }
  }

  var sel = doc.getSelection();
  if (sel) {
    sel.getRangeElements().forEach(function (re) { addPara(re.getElement()); });
  } else {
    var cursor = doc.getCursor();
    if (cursor) addPara(cursor.getElement());
  }
  return paras;
}

// ─────────────────────────────────────────────
// AUTOMATICKÉ ROZPOZNANIE PRVKOV
// ─────────────────────────────────────────────
function detectType_(text, prevType) {
  var t = text.trim();
  if (!t) return null;

  if (/^(INT|EXT|INT\/EXT|EXT\/INT|I\/E)[\.\s\/-]/i.test(t)) return 'SCENA';
  if (/^\(.*\)$/.test(t)) return 'ZATVORKA';
  if (/^(CUT TO|FADE IN|FADE OUT|DISSOLVE|SMASH CUT|MATCH CUT|STRIH|STRIH NA|PRELÍNAČKA|ROZTMIEVAČKA|ZATMIEVAČKA|KONIEC|THE END)/i.test(t) && t.length <= 30) {
    return 'PRECHOD';
  }

  var isCaps = t === t.toUpperCase() && /[A-ZÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ]/.test(t);
  if (isCaps && t.length <= 35 && !/[\.\!\?]$/.test(t.replace(/\((V\.O\.|O\.S\.|M\.O\.|CONT'D|POKR\.)\)$/i, '').trim())) {
    return 'POSTAVA';
  }

  if (prevType === 'POSTAVA' || prevType === 'ZATVORKA') return 'DIALOG';
  return 'AKCIA';
}

function autoFormatSelection() {
  var prev = null;
  getSelectedParagraphs_().forEach(function (p) {
    var type = detectType_(p.getText(), prev);
    if (type) { applyElement_(p, type); prev = type; }
  });
}

function autoFormatDocument() {
  var body = DocumentApp.getActiveDocument().getBody();
  var paras = body.getParagraphs();
  var prev = null;
  for (var i = 0; i < paras.length; i++) {
    var type = detectType_(paras[i].getText(), prev);
    if (type) { applyElement_(paras[i], type); prev = type; }
    else if (paras[i].getText().trim() === '') { /* prázdny riadok nemení kontext dialógu iba čiastočne */ prev = (prev === 'DIALOG') ? null : prev; }
  }
}

// ─────────────────────────────────────────────
// TITULNÁ STRANA
// ─────────────────────────────────────────────
function insertTitlePage() {
  var ui = DocumentApp.getUi();
  var title = ui.prompt('Titulná strana', 'Názov scenára:', ui.ButtonSet.OK_CANCEL);
  if (title.getSelectedButton() !== ui.Button.OK) return;
  var author = ui.prompt('Titulná strana', 'Autor:', ui.ButtonSet.OK_CANCEL);
  if (author.getSelectedButton() !== ui.Button.OK) return;

  var body = DocumentApp.getActiveDocument().getBody();
  var style = {};
  style[DocumentApp.Attribute.FONT_FAMILY] = FONT;
  style[DocumentApp.Attribute.FONT_SIZE] = FONT_SIZE;

  var lines = [
    '', '', '', '', '', '', '', '',
    title.getResponseText().toUpperCase(),
    '',
    'napísal',
    '',
    author.getResponseText(),
    '', '', '', '', '', '', '', '', '', '',
    '© ' + new Date().getFullYear()
  ];

  for (var i = lines.length - 1; i >= 0; i--) {
    var p = body.insertParagraph(0, lines[i]);
    p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    p.setAttributes(style);
    if (i === 8) p.editAsText().setBold(true);
  }
  body.insertPageBreak(lines.length);
}

// ─────────────────────────────────────────────
// ČÍSLOVANIE SCÉN
// ─────────────────────────────────────────────
function numberScenes() {
  var paras = DocumentApp.getActiveDocument().getBody().getParagraphs();
  var n = 0;
  paras.forEach(function (p) {
    var t = p.getText().trim();
    if (/^(INT|EXT|INT\/EXT|EXT\/INT|I\/E)[\.\s\/-]/i.test(t)) {
      n++;
      p.setText(n + '. ' + t.replace(/^\d+\.\s+/, ''));
      applyElement_(p, 'SCENA');
    }
  });
}

function removeSceneNumbers() {
  var paras = DocumentApp.getActiveDocument().getBody().getParagraphs();
  paras.forEach(function (p) {
    var t = p.getText();
    if (/^\d+\.\s+(INT|EXT|INT\/EXT|EXT\/INT|I\/E)/i.test(t.trim())) {
      p.setText(t.replace(/^\s*\d+\.\s+/, ''));
      applyElement_(p, 'SCENA');
    }
  });
}

// ─────────────────────────────────────────────
// DÁTA PRE BOČNÝ PANEL
// ─────────────────────────────────────────────
function getSidebarData() {
  var body = DocumentApp.getActiveDocument().getBody();
  var paras = body.getParagraphs();

  var scenes = [];
  var characters = {};
  var words = 0;
  var lines = 0;
  var prev = null;

  for (var i = 0; i < paras.length; i++) {
    var text = paras[i].getText().trim();
    if (!text) { prev = (prev === 'DIALOG') ? null : prev; continue; }

    var type = detectType_(text, prev);
    prev = type;

    if (type === 'SCENA') scenes.push({ index: i, text: text });
    if (type === 'POSTAVA') {
      var name = text.replace(/\s*\((V\.O\.|O\.S\.|M\.O\.|CONT'D|POKR\.)\)\s*$/i, '').replace(/^\d+\.\s*/, '');
      characters[name] = (characters[name] || 0) + 1;
    }

    words += text.split(/\s+/).length;
    // odhad riadkov podľa šírky prvku (Courier 12 ≈ 10 znakov / palec)
    var width = { SCENA: 60, AKCIA: 60, POSTAVA: 30, ZATVORKA: 25, DIALOG: 35, PRECHOD: 60 }[type] || 60;
    lines += Math.max(1, Math.ceil(text.length / width)) + 1;
  }

  var pages = Math.max(1, Math.round(lines / 55 * 10) / 10);
  var charList = Object.keys(characters)
    .map(function (k) { return { name: k, count: characters[k] }; })
    .sort(function (a, b) { return b.count - a.count; });

  return {
    scenes: scenes,
    characters: charList,
    stats: { scenes: scenes.length, words: words, pages: pages, minutes: Math.round(pages) }
  };
}

function jumpToScene(paragraphIndex) {
  var doc = DocumentApp.getActiveDocument();
  var paras = doc.getBody().getParagraphs();
  if (paragraphIndex >= 0 && paragraphIndex < paras.length) {
    var pos = doc.newPosition(paras[paragraphIndex], 0);
    doc.setCursor(pos);
  }
}
