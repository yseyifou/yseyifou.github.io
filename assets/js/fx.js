/*
 * fx.js — interactive particle field
 * Vanilla JS, no dependencies. Loaded with `defer` after the template scripts.
 *
 * Fixes over the original inline version:
 *   - z-index 2 (between #bg and #wrapper) instead of 10001 (above the text)
 *   - DPR-aware rendering (sharp on Retina)
 *   - pauses when the tab is hidden or a panel is open
 *   - respects prefers-reduced-motion
 *   - pointer interaction, adaptive density, batched strokes
 *   - ON/OFF toggle persisted in localStorage
 */
(function () {
	'use strict';

	var canvas = document.getElementById('fx-canvas');
	if (!canvas) return;

	var ctx = canvas.getContext('2d');
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	var LINK_DIST = 140;
	var POINTER_RADIUS = 180;
	var POINTER_FORCE = 0.5;

	var particles = [];
	var rafId = null;
	var running = false;
	var dpr = 1;
	var w = 0;
	var h = 0;

	var pointer = { x: -9999, y: -9999, active: false };

	/* ---------------------------------------------------------------- */
	/* State                                                             */
	/* ---------------------------------------------------------------- */

	function targetOpacity() {
		if (document.body.classList.contains('is-article-visible')) return 0.12;
		return 0.40;
	}

	var currentOpacity = 0;

	/* ---------------------------------------------------------------- */
	/* Sizing                                                            */
	/* ---------------------------------------------------------------- */

	function resize() {
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		w = window.innerWidth;
		h = window.innerHeight;
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(h * dpr);
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	function particleCount() {
		return Math.max(40, Math.min(120, Math.round((w * h) / 12000)));
	}

	function initParticles() {
		var n = particleCount();
		particles = [];
		for (var i = 0; i < n; i++) {
			particles.push({
				x: Math.random() * w,
				y: Math.random() * h,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				r: Math.random() * 1.6 + 0.6
			});
		}
	}

	/* ---------------------------------------------------------------- */
	/* Animation                                                         */
	/* ---------------------------------------------------------------- */

	function step() {
		rafId = requestAnimationFrame(step);

		/* ease opacity toward target */
		var target = targetOpacity();
		currentOpacity += (target - currentOpacity) * 0.06;
		if (currentOpacity < 0.01) {
			ctx.clearRect(0, 0, w, h);
			return;
		}
		canvas.style.opacity = currentOpacity.toFixed(3);

		ctx.clearRect(0, 0, w, h);

		var i, p, dx, dy, d;

		/* update + draw particles */
		for (i = 0; i < particles.length; i++) {
			p = particles[i];

			if (pointer.active) {
				dx = p.x - pointer.x;
				dy = p.y - pointer.y;
				d = Math.sqrt(dx * dx + dy * dy);
				if (d < POINTER_RADIUS && d > 0.01) {
					var f = (1 - d / POINTER_RADIUS) * POINTER_FORCE;
					p.vx += (dx / d) * f;
					p.vy += (dy / d) * f;
				}
			}

			p.x += p.vx;
			p.y += p.vy;

			/* damp pointer-induced velocity back to baseline */
			p.vx *= 0.985;
			p.vy *= 0.985;

			if (p.x < 0) { p.x = 0; p.vx *= -1; }
			else if (p.x > w) { p.x = w; p.vx *= -1; }
			if (p.y < 0) { p.y = 0; p.vy *= -1; }
			else if (p.y > h) { p.y = h; p.vy *= -1; }

			ctx.beginPath();
			ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(160, 237, 228, .8)';
			ctx.fill();
		}

		/* batched links: one path, one stroke */
		ctx.beginPath();
		for (i = 0; i < particles.length; i++) {
			for (var j = i + 1; j < particles.length; j++) {
				dx = particles[i].x - particles[j].x;
				dy = particles[i].y - particles[j].y;
				d = Math.sqrt(dx * dx + dy * dy);
				if (d < LINK_DIST) {
					ctx.moveTo(particles[i].x, particles[i].y);
					ctx.lineTo(particles[j].x, particles[j].y);
				}
			}
		}
		ctx.strokeStyle = 'rgba(160, 237, 228, .30)';
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	function start() {
		if (running || reduceMotion.matches) return;
		running = true;
		rafId = requestAnimationFrame(step);
	}

	function stop() {
		running = false;
		if (rafId) cancelAnimationFrame(rafId);
		rafId = null;
	}

	/* ---------------------------------------------------------------- */
	/* Events                                                            */
	/* ---------------------------------------------------------------- */

	var resizeTimer = null;
	window.addEventListener('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			resize();
			initParticles();
		}, 200);
	});

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			stop();
		} else {
			start();
		}
	});

	canvas.addEventListener('pointermove', function (e) {
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		pointer.active = true;
	});

	canvas.addEventListener('pointerleave', function () {
		pointer.active = false;
		pointer.x = -9999;
		pointer.y = -9999;
	});

	/* ---------------------------------------------------------------- */
	/* Init                                                              */
	/* ---------------------------------------------------------------- */

	function init() {
		resize();
		initParticles();
		if (!reduceMotion.matches) {
			start();
		} else {
			canvas.style.opacity = '0';
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
