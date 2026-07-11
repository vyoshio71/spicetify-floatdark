// FloatDark Theme — Toggle Dark/Light
// Injeta botão de alternância no topbar do Spotify

(async function FloatDarkTheme() {

  // Aguarda o Spicetify carregar
  while (!Spicetify?.showNotification) {
    await new Promise(r => setTimeout(r, 100));
  }

  // ─── Paletas de cores ───────────────────────────────────────────────────

  const SCHEMES = {
    dark: {
      text:               'F1F1F1',
      subtext:            '888888',
      'sidebar-text':     'DDDDDD',
      main:               '0A0A0A',
      sidebar:            '0F0F0F',
      player:             '141414',
      card:               '1A1A1A',
      shadow:             '000000',
      'selected-row':     'A855F7',
      button:             'A855F7',
      'button-active':    'C084FC',
      'button-disabled':  '3A3A3A',
      'tab-active':       'A855F7',
      notification:       'A855F7',
      'notification-error': 'EF4444',
      misc:               '272727',
      shadowStrength:     '0.6',
    },
    light: {
      text:               '1A1A1A',
      subtext:            '666666',
      'sidebar-text':     '222222',
      main:               'F2F2F2',
      sidebar:            'E8E8E8',
      player:             'FFFFFF',
      card:               'E0E0E0',
      shadow:             '999999',
      'selected-row':     '7C3AED',
      button:             '7C3AED',
      'button-active':    '6D28D9',
      'button-disabled':  'BBBBBB',
      'tab-active':       '7C3AED',
      notification:       '7C3AED',
      'notification-error': 'DC2626',
      misc:               'CCCCCC',
      shadowStrength:     '0.15',
    },
  };

  // ─── Utilitários ────────────────────────────────────────────────────────

  const KEY = 'floatdark_scheme';

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `${r},${g},${b}`;
  }

  function applyScheme(scheme) {
    const root = document.documentElement;
    const colors = SCHEMES[scheme];

    for (const [key, value] of Object.entries(colors)) {
      if (key === 'shadowStrength') {
        root.style.setProperty('--shadow-strength', value);
        continue;
      }
      root.style.setProperty(`--spice-${key}`, `#${value}`);
      root.style.setProperty(`--spice-rgb-${key}`, hexToRgb(value));
    }

    localStorage.setItem(KEY, scheme);
  }

  // ─── SVG Icons ──────────────────────────────────────────────────────────

  const ICON_MOON = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3
               a7 7 0 0 0 9.79 9.79z"/>
    </svg>`;

  const ICON_SUN = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`;

  // ─── Criar botão de toggle ───────────────────────────────────────────────

  function createToggleButton(isDark) {
    const btn = document.createElement('button');
    btn.id = 'floatdark-toggle';
    btn.title = 'Alternar entre tema claro e escuro';
    btn.innerHTML = isDark ? ICON_MOON : ICON_SUN;
    return btn;
  }

  // ─── Injetar botão no topbar ─────────────────────────────────────────────

  async function injectButton(isDark) {
    // Remove botão anterior se existir
    document.getElementById('floatdark-toggle')?.remove();

    // Aguarda o topbar estar disponível
    let topbarRight = null;
    let attempts = 0;
    while (!topbarRight && attempts < 50) {
      topbarRight =
        document.querySelector('.main-topBar-topbarContent') ||
        document.querySelector('.main-topBar-container > div:last-child') ||
        document.querySelector('[class*="topBar"] [class*="right"]');
      if (!topbarRight) await new Promise(r => setTimeout(r, 200));
      attempts++;
    }

    const btn = createToggleButton(isDark);

    btn.addEventListener('click', () => {
      const current = localStorage.getItem(KEY) || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyScheme(next);
      btn.innerHTML = next === 'dark' ? ICON_MOON : ICON_SUN;
      Spicetify.showNotification(
        next === 'dark' ? '🌙 Tema escuro ativado' : '☀️ Tema claro ativado'
      );
    });

    if (topbarRight) {
      topbarRight.insertBefore(btn, topbarRight.firstChild);
    } else {
      // Fallback: botão fixo no canto superior direito
      btn.style.cssText += `
        position: fixed !important;
        top: 12px !important;
        right: 16px !important;
        z-index: 9999 !important;
      `;
      document.body.appendChild(btn);
    }
  }

  // ─── Init ────────────────────────────────────────────────────────────────

  const saved = localStorage.getItem(KEY) || 'dark';
  applyScheme(saved);
  await injectButton(saved === 'dark');

})();
