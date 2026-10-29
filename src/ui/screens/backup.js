import { h } from '../dom.js';
import { heroTitle } from '../common.js';
import { createBackup, parseBackup, applyBackup, markExported, currentSummary, orphanReport } from '../../core/backup.js';
import { dayToDate } from '../../core/clock.js';

const fmt = (ms) => (ms ? new Date(ms).toLocaleString() : 'never');

export function backupScreen({ ctx }) {
  const { store } = ctx;
  const status = h('div', { role: 'status', 'aria-live': 'polite', id: 'backup-status' });
  const previewBox = h('div', { id: 'import-preview' });
  const cur = currentSummary(store);
  const last = store.state.meta.lastExportAt;

  async function doExport() {
    const content = await ctx.getContent().catch(() => null);
    const { filename, text } = await createBackup(store, { contentVersion: content?.contentVersion || null });
    const blob = new Blob([text], { type: 'application/json' });
    const file = new File([blob], filename, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Tabi Nihongo backup' }); markExported(store); status.replaceChildren(h('p', { class: 'banner ok' }, `Backup shared: ${filename}`)); return; } catch { /* fall through to download */ }
    }
    const a = h('a', { href: URL.createObjectURL(blob), download: filename });
    document.body.append(a); a.click(); a.remove();
    markExported(store);
    status.replaceChildren(h('p', { class: 'banner ok' }, `Backup created: ${filename}. It contains your progress only (about ${Math.round(text.length / 1024)} KB). Keep it somewhere safe; it never leaves your device unless you move it.`));
    ctx.refreshBanners();
  }

  async function onFile(e) {
    const f = e.target.files && e.target.files[0];
    previewBox.replaceChildren(); status.replaceChildren();
    if (!f) return;
    let text;
    try { text = await f.text(); } catch { status.replaceChildren(h('p', { class: 'banner bad', role: 'alert' }, 'Could not read that file. Nothing was changed.')); return; }
    const r = await parseBackup(text, { sizeBytes: f.size });
    if (!r.ok) { status.replaceChildren(h('p', { class: 'banner bad', role: 'alert' }, r.message)); return; }
    const p = r.preview; const content = await ctx.getContent().catch(() => null);
    const known = content ? new Set([...content.lessons.map((l) => l.id), ...content.vocab.map((v) => v.id), ...content.kana.map((k) => k.id), ...content.kanji.map((k) => k.id), ...content.grammar.map((g) => g.id)]) : null;
    const orph = known ? orphanReport(r.doc, known) : null;
    const confirm = h('input', { type: 'checkbox', id: 'confirm-overwrite' });
    const go = h('button', { class: 'btn danger', type: 'button', id: 'do-restore', disabled: true, onclick: () => {
      const res = applyBackup(store, r.doc, { confirmed: confirm.checked });
      if (res.ok) { previewBox.replaceChildren(); status.replaceChildren(h('p', { class: 'banner ok', role: 'status' }, 'Restored. Your progress is back. ', h('a', { href: '#/' }, 'Go to the map'))); ctx.refreshBanners(); }
      else status.replaceChildren(h('p', { class: 'banner bad', role: 'alert' }, res.error));
    } }, 'Replace my progress with this backup');
    confirm.addEventListener('change', () => { go.disabled = !confirm.checked; });
    previewBox.replaceChildren(h('div', { class: 'card' }, h('h3', null, 'Backup preview'),
      h('table', null, h('thead', null, h('tr', null, ['', 'This backup', 'On this device now'].map((x) => h('th', { scope: 'col' }, x)))), h('tbody', null,
        [['Exported', new Date(p.exportedAt).toLocaleString(), '—'], ['App / content version', `${p.appVersion} / ${p.contentVersion || '—'}`, '—'], ['Lessons completed', p.lessonsCompleted, cur.lessonsCompleted], ['Units completed', p.unitsCompleted, cur.unitsCompleted], ['Review items (facets)', p.facets, cur.facets], ['Stamps', p.stamps, cur.stamps], ['Mock attempts', p.mockAttempts, cur.mockAttempts], ['XP', p.xp, cur.xp], ['Last activity', p.lastActivity || '—', cur.lastActivityDay === null ? '—' : dayToDate(cur.lastActivityDay)]].map(([a, b, c]) => h('tr', null, h('th', { scope: 'row' }, a), h('td', null, String(b)), h('td', null, String(c)))))),
      orph && orph.count ? h('p', { class: 'small muted' }, `${orph.count} item(s) in this backup are not in the content on this device (for example from a newer content release). They are kept, not deleted.`) : null,
      h('p', { class: 'banner warn' }, 'Restoring replaces the progress currently on this device. A safety copy is made first and used to roll back if anything fails.'),
      h('label', { class: 'check', for: 'confirm-overwrite' }, confirm, 'I understand this overwrites my current progress.'), go));
  }

  return h('div', { class: 'stack' }, heroTitle('Backup and restore', 'Profile'),
    h('div', { class: 'card' }, h('h3', null, 'Export'), h('p', null, 'Save your progress and settings as a file. Last backup: ', h('strong', null, fmt(last)), '.'), h('button', { class: 'btn primary', type: 'button', id: 'do-export', onclick: doExport }, 'Export backup file'),
      h('p', { class: 'small muted' }, 'The file contains your settings, progress, review schedule and journal (not lessons or audio). It is created on this device and is not uploaded anywhere.')),
    h('div', { class: 'card' }, h('h3', null, 'Import'), h('label', { for: 'import-file' }, 'Choose a backup file (.json, up to 5 MB)'), h('input', { type: 'file', id: 'import-file', accept: 'application/json,.json', onchange: onFile }), previewBox),
    status,
    h('div', { class: 'card tint' }, h('p', { class: 'small' }, 'iPhone: an installed Home Screen app has separate storage from Safari tabs. To move progress between them, export in one and import in the other. Safari may delete tab data after 7 days without use.')));
}
