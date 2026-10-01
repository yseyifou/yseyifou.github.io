/*
 * ui.js — interactions
 * Vanilla JS, no dependencies. Loaded with `defer` after the template scripts.
 *
 *  - keyboard navigation (←/→, 1-8, Esc is native)
 *  - aria-current on the active nav link
 *  - accessible .close (role/tabindex/keyboard) without breaking main.js's handler
 *  - clickable tag badges → filter #projects
 *  - copy-email button + toast
 *  - live GitHub repos (idle fetch + sessionStorage cache + static fallback)
 *  - MathJax re-typeset when a panel opens
 *  - staggered reveal on panel open
 *  - language switcher (preserves the current panel)
 */
(function () {
	'use strict';

	/* ---------------------------------------------------------------- */
	/* Helpers                                                           */
	/* ---------------------------------------------------------------- */

	function $(sel, root) { return (root || document).querySelector(sel); }
	function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

	function isFormFocus(el) {
		if (!el) return false;
		var tag = el.tagName;
		return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
	}

	/* ---------------------------------------------------------------- */
	/* Panel model                                                       */
	/* ---------------------------------------------------------------- */

	var PANELS = ['intro', 'education', 'research', 'projects', 'skills', 'arts', 'cv', 'contact'];

	function currentPanel() {
		var hash = window.location.hash.replace('#', '');
		return PANELS.indexOf(hash) !== -1 ? hash : null;
	}

	function goToPanel(id) {
		if (PANELS.indexOf(id) === -1) return;
		window.location.hash = id;
	}

	/* ---------------------------------------------------------------- */
	/* Keyboard navigation                                               */
	/* ---------------------------------------------------------------- */

	document.addEventListener('keydown', function (e) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		if (isFormFocus(e.target)) return;

		var idx = PANELS.indexOf(currentPanel());

		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				goToPanel(PANELS[(idx + 1) % PANELS.length]);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				goToPanel(PANELS[(idx - 1 + PANELS.length) % PANELS.length]);
				break;
			default:
				if (/^[1-8]$/.test(e.key)) {
					var target = PANELS[parseInt(e.key, 10) - 1];
					if (target) {
						e.preventDefault();
						goToPanel(target);
					}
				}
		}
	});

	/* ---------------------------------------------------------------- */
	/* aria-current + reveal + MathJax on panel open                      */
	/* ---------------------------------------------------------------- */

	function onPanelShown() {
		var id = currentPanel();

		/* aria-current */
		$all('#header nav a').forEach(function (a) {
			if (a.getAttribute('href') === '#' + id) {
				a.setAttribute('aria-current', 'page');
			} else {
				a.removeAttribute('aria-current');
			}
		});

		/* reveal */
		var article = id ? document.getElementById(id) : null;
		if (article) {
			article.classList.remove('reveal');
			/* force reflow so the animation restarts */
			void article.offsetWidth;
			article.classList.add('reveal');
			setRevealIndexes(article);
		}

		/* MathJax: typeset the panel that just became visible */
		if (window.MathJax && MathJax.typesetPromise) {
			if (MathJax.startup && MathJax.startup.promise) {
				MathJax.startup.promise.then(function () {
					return MathJax.typesetPromise(article ? [article] : undefined);
				}).catch(function () { /* ignore */ });
			} else {
				MathJax.typesetPromise(article ? [article] : undefined).catch(function () { /* ignore */ });
			}
		}
	}

	function setRevealIndexes(article) {
		var items = $all('.timeline-item, .project-card, .award, .badge, .cv-item', article);
		items.forEach(function (el, i) {
			el.style.setProperty('--i', i);
		});
	}

	window.addEventListener('hashchange', onPanelShown);

	/* ---------------------------------------------------------------- */
	/* Accessible .close (do NOT replace the node — main.js owns it)     */
	/* ---------------------------------------------------------------- */

	function makeCloseAccessible() {
		$all('.close').forEach(function (el) {
			el.setAttribute('role', 'button');
			el.setAttribute('tabindex', '0');
			el.setAttribute('aria-label', 'Close');

			el.addEventListener('keydown', function (e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					window.location.hash = '';
				}
			});
		});
	}

	/* ---------------------------------------------------------------- */
	/* Tag filter                                                        */
	/* ---------------------------------------------------------------- */

	function applyFilter(slug) {
		var cards = $all('.project-card');
		var chip = $('#active-filter');

		if (!slug) {
			cards.forEach(function (c) {
				c.style.display = '';
				c.classList.remove('dim', 'hit');
			});
			if (chip) chip.remove();
			return;
		}

		cards.forEach(function (c) {
			var tags = (c.getAttribute('data-tags') || '').split(/\s+/);
			if (tags.indexOf(slug) !== -1) {
				c.style.display = '';
				c.classList.add('hit');
				c.classList.remove('dim');
			} else {
				c.style.display = 'none';
				c.classList.add('dim');
				c.classList.remove('hit');
			}
		});

		if (!chip) {
			chip = document.createElement('div');
			chip.id = 'active-filter';
			chip.style.cssText = 'margin:0 0 1rem;font-size:.8rem;letter-spacing:.05rem;text-transform:uppercase;color:var(--accent-soft);display:flex;align-items:center;gap:.6rem;';
			var list = $('#projects .project-list') || $('#projects');
			list.parentNode.insertBefore(chip, list);
		}
		chip.innerHTML = '';
		var label = document.createElement('span');
		label.textContent = 'Filter: ' + slug;
		var clear = document.createElement('button');
		clear.type = 'button';
		clear.textContent = '✕';
		clear.setAttribute('aria-label', 'Clear filter');
		clear.style.cssText = 'background:none;border:1px solid rgba(255,255,255,.3);border-radius:50%;width:1.4rem;height:1.4rem;line-height:1;cursor:pointer;color:inherit;font-size:.7rem;';
		clear.addEventListener('click', function () { applyFilter(null); });
		chip.appendChild(label);
		chip.appendChild(clear);
	}

	function onBadgeClick(e) {
		var badge = e.target.closest('.badge[data-filter]');
		if (!badge) return;
		e.preventDefault();
		var slug = badge.getAttribute('data-filter');
		if (currentPanel() !== 'projects') {
			window.location.hash = 'projects';
			/* wait for the panel to render, then filter */
			setTimeout(function () { applyFilter(slug); }, 400);
		} else {
			applyFilter(slug);
		}
	}

	document.addEventListener('click', onBadgeClick);

	/* ---------------------------------------------------------------- */
	/* Live GitHub repos                                                 */
	/* ---------------------------------------------------------------- */

	var GH_CACHE_KEY = 'gh:repos';
	var GH_CACHE_TTL = 6 * 60 * 60 * 1000; /* 6 h */

	function ghCached() {
		try {
			var raw = sessionStorage.getItem(GH_CACHE_KEY);
			if (!raw) return null;
			var data = JSON.parse(raw);
			if (Date.now() - data.ts > GH_CACHE_TTL) return null;
			return data.repos;
		} catch (e) { return null; }
	}

	function ghCache(repos) {
		try {
			sessionStorage.setItem(GH_CACHE_KEY, JSON.stringify({ ts: Date.now(), repos: repos }));
		} catch (e) { /* ignore */ }
	}

	function renderRepos(repos) {
		var list = $('#repo-list');
		if (!list) return;
		list.innerHTML = '';
		repos.forEach(function (r) {
			var li = document.createElement('li');
			li.className = 'repo-card';

			var name = document.createElement('div');
			name.className = 'repo-name';
			var a = document.createElement('a');
			a.href = r.html_url;
			a.target = '_blank';
			a.rel = 'noopener noreferrer';
			a.textContent = r.name;
			name.appendChild(a);

			var desc = document.createElement('div');
			desc.className = 'repo-desc';
			desc.textContent = r.description || '';

			var meta = document.createElement('div');
			meta.className = 'repo-meta';
			if (r.language) {
				var lang = document.createElement('span');
				lang.className = 'lang';
				lang.textContent = r.language;
				meta.appendChild(lang);
			}
			var stars = document.createElement('span');
			stars.textContent = '★ ' + r.stargazers_count;
			meta.appendChild(stars);
			var updated = document.createElement('span');
			updated.textContent = 'Updated ' + new Date(r.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
			meta.appendChild(updated);

			li.appendChild(name);
			li.appendChild(desc);
			li.appendChild(meta);
			list.appendChild(li);
		});
	}

	function loadRepos() {
		var cached = ghCached();
		if (cached) {
			renderRepos(cached);
			return;
		}

		function fetchRepos() {
			fetch('https://api.github.com/users/yseyifou/repos?sort=updated&per_page=10')
				.then(function (r) { return r.json(); })
				.then(function (data) {
					if (!Array.isArray(data)) return;
					var repos = data.filter(function (r) { return r.name !== 'yseyifou.github.io'; });
					ghCache(repos);
					renderRepos(repos);
				})
				.catch(function () { /* static fallback stays in place */ });
		}

		if ('requestIdleCallback' in window) {
			requestIdleCallback(fetchRepos, { timeout: 4000 });
		} else {
			setTimeout(fetchRepos, 1500);
		}
	}

	/* ---------------------------------------------------------------- */
	/* Language switcher                                                 */
	/* ---------------------------------------------------------------- */

	function buildLangSwitch() {
		if ($('.lang-switch')) return;

		var isFr = window.location.pathname.indexOf('/fr/') === 0;
		var wrap = document.createElement('div');
		wrap.className = 'lang-switch';

		var a = document.createElement('a');
		var hash = window.location.hash;
		if (isFr) {
			a.href = '/' + hash;
			a.textContent = 'EN';
		} else {
			a.href = '/fr/' + hash;
			a.textContent = 'FR';
		}
		a.setAttribute('aria-label', isFr ? 'Switch to English' : 'Passer au français');

		wrap.appendChild(a);
		document.body.appendChild(wrap);
	}

	/* ---------------------------------------------------------------- */
	/* Init                                                              */
	/* ---------------------------------------------------------------- */

	function init() {
		makeCloseAccessible();
		buildLangSwitch();
		loadRepos();

		/* run once on load (covers deep links) */
		onPanelShown();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
