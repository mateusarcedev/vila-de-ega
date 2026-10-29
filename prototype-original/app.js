(() => {
  const root = document.documentElement;
  const modeButtons = [...document.querySelectorAll('[data-mode-choice]')];
  const modeToggle = document.querySelector('#rail-mode-toggle');
  const portalIntro = document.querySelector('.portal-head .section-intro');
  const initialPortalCopy = portalIntro?.textContent ?? '';
  const modeCopy = {
    guided: initialPortalCopy,
    free: 'Escolha um portal para chegar a um período. A linha do tempo continua disponível para seguir adiante ou voltar sem perder seu lugar.'
  };
  const periods = [...document.querySelectorAll('[data-chapter]')];
  const railLinks = [...document.querySelectorAll('[data-rail]')];
  const currentPeriod = document.querySelector('#current-period');
  const currentDate = document.querySelector('#current-date');
  const progressFill = document.querySelector('#progress-fill');
  let activeId = periods[0]?.id ?? '';

  function setMode(mode) {
    const nextMode = mode === 'free' ? 'free' : 'guided';
    root.dataset.mode = nextMode;
    modeButtons.forEach((button) => {
      const active = button.dataset.modeChoice === nextMode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (portalIntro) portalIntro.textContent = modeCopy[nextMode];
    if (modeToggle) {
      const label = modeToggle.querySelector('span:last-child');
      if (label) label.textContent = nextMode === 'guided' ? 'Explorar livremente' : 'Seguir a viagem guiada';
      modeToggle.setAttribute('aria-label', nextMode === 'guided' ? 'Alternar para exploração livre' : 'Alternar para viagem guiada');
    }
  }

  function selectPeriod(id) {
    const chapter = document.getElementById(id);
    if (!chapter) return;
    activeId = id;
    currentPeriod.textContent = chapter.dataset.label ?? chapter.querySelector('h2')?.textContent.replace(/\s+/g, ' ').trim() ?? chapter.dataset.period;
    currentDate.textContent = chapter.dataset.period;
    railLinks.forEach((link) => {
      const active = link.dataset.rail === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return;
    selectPeriod(target.matches('[data-chapter]') ? id : activeId);
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    if (target.matches('[data-chapter]')) history.replaceState(null, '', `#${id}`);
  }

  modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.modeChoice)));
  document.querySelectorAll('[data-mode][data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      setMode(button.dataset.mode);
      scrollToId(button.dataset.scroll);
    });
  });
  document.querySelectorAll('[data-jump]').forEach((button) => {
    button.addEventListener('click', () => scrollToId(button.dataset.jump));
  });
  railLinks.forEach((link) => link.addEventListener('click', () => selectPeriod(link.dataset.rail)));
  if (modeToggle) modeToggle.addEventListener('click', () => setMode(root.dataset.mode === 'free' ? 'guided' : 'free'));

  const chapterObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) selectPeriod(visible.target.id);
  }, { rootMargin: '-28% 0px -48% 0px', threshold: [0, .15, .3, .5, .7] });
  periods.forEach((chapter) => chapterObserver.observe(chapter));

  function updateProgress() {
    const shell = document.querySelector('.timeline-shell');
    if (!shell || !progressFill) return;
    const rect = shell.getBoundingClientRect();
    const distance = Math.max(1, shell.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    progressFill.style.width = `${progress * 100}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  const menuButton = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('#main-nav');
  if (menuButton && mainNav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      mainNav.classList.toggle('is-open', open);
      menuButton.querySelector('.menu-toggle-text').textContent = open ? 'Fechar' : 'Menu';
    });
    mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
      menuButton.querySelector('.menu-toggle-text').textContent = 'Menu';
    }));
  }

  document.querySelectorAll('[data-motion-toggle]').forEach((button) => button.addEventListener('click', () => {
    const paused = document.body.classList.toggle('motion-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Retomar movimento' : 'Pausar movimento';
  }));

  const dialog = document.querySelector('#detail-dialog');
  const dialogTitle = document.querySelector('#dialog-title');
  const dialogCopy = document.querySelector('#dialog-copy');
  const dialogKicker = document.querySelector('#dialog-kicker');
  const detailContent = {
    'ega-detail': {
      kicker: 'Ficha de acontecimento',
      title: '1759 · Vila de Ega',
      copy: 'Esta ficha é demonstrativa. O contexto administrativo e a cronologia serão completados após a associação de fontes verificáveis.'
    },
    'scene-city': {
      kicker: 'Cena 3D · espaço reservado',
      title: 'Uma cidade em construção',
      copy: 'Área preparada para receber uma reconstrução em GLB ou glTF. A ilustração atual é uma composição artística provisória, sem valor documental; a imagem alternativa permanece disponível.'
    },
    'scene-ega': {
      kicker: 'Cena 3D · espaço reservado',
      title: 'Vila de Ega',
      copy: 'Área preparada para futura reconstrução digital. A cartografia atual é cenográfica e não propõe uma planta histórica documentada; ela será substituída ou acompanhada por fontes e um modo de leitura alternativo.'
    }
  };
  document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => {
    const detail = detailContent[button.dataset.open];
    if (!dialog || !detail) return;
    dialogKicker.textContent = detail.kicker;
    dialogTitle.textContent = detail.title;
    dialogCopy.textContent = detail.copy;
    if (typeof dialog.showModal === 'function') dialog.showModal();
  }));
  if (dialog) {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.dialog-ok').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  if (location.hash) {
    const hashTarget = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (hashTarget?.matches('[data-chapter]')) selectPeriod(hashTarget.id);
  }
})();
