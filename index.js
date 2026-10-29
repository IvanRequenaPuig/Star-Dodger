const $ = s => document.querySelector(s), cv = $('#c'), g = cv.getContext('2d'), W = 900, H = 540, GY = 478, R = Math.random, cl = (v, a, b) => Math.max(a, Math.min(b, v));
let G = null, state = 'menu', snd = true, mus = true, mt = null, mi = 0, best = 0, ac, last = 0, keys = {}, tm = 0;
let stats = { games: 0, stars: 0, gems: 0, top: [], ach: {}, diff: 1, skin: 0 };
try { Object.assign(stats, JSON.parse(localStorage.getItem('sd-stats') || '{}')) } catch (e) { }
let diff = stats.diff | 0, skin = stats.skin | 0;
const save = () => { stats.diff = diff; stats.skin = skin; try { localStorage.setItem('sd-stats', JSON.stringify(stats)) } catch (e) { } };
const DN = ['Fácil', 'Normal', 'Difícil'], DS = [.85, 1, 1.2], DP = [.8, 1, 1.5];
const SK = [['#a78bfa', '#6d28d9', '#ec4899', 'Violeta'], ['#6ee7b7', '#047857', '#fbbf24', 'Esmeralda'], ['#fda4af', '#be123c', '#22d3ee', 'Rubí'], ['#93c5fd', '#1d4ed8', '#f472b6', 'Océano']];
const ACH = { first: ['Primeros pasos', 'Completa tu primer nivel'], combo: ['Racha total', 'Consigue un combo x5'], lv5: ['Superviviente', 'Llega al nivel 5'], clean: ['Intocable', 'Pasa un nivel sin que te golpeen'], gem: ['Joyero', 'Recoge 10 gemas en total'], star100: ['Cazador de estrellas', 'Recoge 100 estrellas en total'], hard: ['Sin miedo', 'Llega al nivel 3 en difícil'] };
function toast(t) { const e = $('#toast'); e.textContent = t; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 2600) }
function unlock(k) { if (stats.ach[k]) return; stats.ach[k] = 1; save(); toast('🏆 ' + ACH[k][0]); beep(880, .15, 'triangle', .06, 1320) }
function lab() { $('#diffb').textContent = 'Dificultad: ' + DN[diff]; $('#skinb').textContent = 'Personaje: ' + SK[skin][3]; $('#sndb').textContent = 'Sonido: ' + (snd ? 'sí' : 'no'); $('#musb').textContent = 'Música: ' + (mus ? 'sí' : 'no') }
function music() { mt = setInterval(() => { if (state !== 'play' || !mus || !snd) return; const sc = [0, 3, 7, 10, 12, 10, 7, 3], b = [220, 196, 174.6, 196][(mi >> 3) % 4], i = mi++; beep(b * 2 ** (sc[i % 8] / 12), .22, 'triangle', .018); if (i % 4 === 0) beep(b / 2, .4, 'sine', .03) }, 210) }
function rec() { const n = Object.keys(ACH); $('#recb').innerHTML = '<div><b>Mejores partidas</b>' + (stats.top.length ? stats.top.map((t, i) => `<p>${i + 1}. ${+t.s} puntos · nivel ${+t.l} · ${DN[t.d | 0]}</p>`).join('') : '<p>Aún no hay partidas.</p>') + `<p>Partidas: ${+stats.games} · Estrellas: ${+stats.stars} · Gemas: ${+stats.gems}</p></div><div><b>Logros ${n.filter(k => stats.ach[k]).length}/${n.length}</b>` + n.map(k => `<p>${stats.ach[k] ? '🏆' : '🔒'} ${ACH[k][0]}: ${ACH[k][1]}</p>`).join('') + '</div>'; show('rec') }
try { best = +localStorage.getItem('sd-best') || 0 } catch (e) { }
$('#best').textContent = best; $('#bs').textContent = best;
const bgStars = Array.from({ length: 90 }, () => ({ x: R() * W, y: R() * GY, s: R() * 1.8 + .5, z: R() * .6 + .2, p: R() * 6 }));
const goalFor = l => 6 + l * 3, timeFor = l => Math.max(28, 48 - l * 2);
function beep(f, d = .1, t = 'square', v = .05, s = 0, at = 0) { if (!snd) return; try { ac = ac || new AudioContext(); const T = ac.currentTime + at, o = ac.createOscillator(), a = ac.createGain(); o.type = t; o.frequency.setValueAtTime(f, T); if (s) o.frequency.exponentialRampToValueAtTime(s, T + d); a.gain.setValueAtTime(v, T); a.gain.exponentialRampToValueAtTime(.001, T + d); o.connect(a); a.connect(ac.destination); o.start(T); o.stop(T + d) } catch (e) { } }
const show = id => document.querySelectorAll('.scr').forEach(e => e.classList.toggle('on', e.id === id));
function start() { G = { p: { x: W / 2, y: GY - 44, vx: 0, vy: 0, w: 30, h: 44, j: 0, f: 1, inv: 0, sh: 0, sq: 0 }, it: [], pt: [], sc: 0, lives: [4, 3, 2][diff], lv: 1, got: 0, goal: goalFor(1), time: timeFor(1), combo: 1, ct: 0, sp: .6, shake: 0, flash: 0, tm: 0, bn: 1.6, mag: 0, frost: 0, storm: 0, warn: 0, lt: 0, stormAt: 7 + R() * 12, stormDone: 0, hit: 0 }; state = 'play'; show(null); $('#hud').classList.add('on'); $('#tc').classList.add('on'); beep(520, .18, 'triangle', .06, 980); if (!mt) music() }
function menu() { state = 'menu'; G = null; show('menu'); $('#hud').classList.remove('on'); $('#tc').classList.remove('on'); $('#cb').textContent = '' }
function pause() { if (state === 'play') { state = 'pause'; show('pause') } else if (state === 'pause') { state = 'play'; show(null) } }
function over() {
    state = 'over'; stats.games++; stats.top.push({ s: G.sc, l: G.lv, d: diff }); stats.top.sort((a, b) => b.s - a.s); stats.top = stats.top.slice(0, 5); save(); const n = G.sc > best; if (n) { best = G.sc; try { localStorage.setItem('sd-best', best) } catch (e) { } }
    $('#osc').textContent = G.sc; $('#oinfo').textContent = 'Llegaste al nivel ' + G.lv + ' con ' + G.got + ' de ' + G.goal + ' estrellas en el último.'; $('#onew').textContent = n ? '¡Nuevo récord!' : 'Tu récord es ' + best; $('#best').textContent = best; $('#bs').textContent = best;
    show('over'); $('#hud').classList.remove('on'); $('#tc').classList.remove('on'); beep(300, .5, 'sawtooth', .07, 60)
}
function burst(x, y, c, n = 14, sp = 260) { for (let i = 0; i < n; i++) { const a = R() * 6.28, v = sp * (.3 + R() * .7); G.pt.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, l: .6 + R() * .5, m: 1.1, c, s: 2 + R() * 3, gr: 700 }) } }
function txt(x, y, t, c = '#fff') { G.pt.push({ x, y, vx: 0, vy: -60, l: 1.1, m: 1.1, c, t, gr: 0 }) }
function jump() { if (state !== 'play' || G.bn > 0) return; const p = G.p; if (p.j < 2) { p.vy = p.j ? -580 : -720; p.j++; burst(p.x, p.y + p.h, '#ffffff88', 5, 120); beep(p.j > 1 ? 640 : 440, .12, 'triangle', .05, p.j > 1 ? 900 : 700) } }
function hurt() {
    const p = G.p; if (p.inv > 0) return; if (p.sh) { p.sh = 0; p.inv = .9; burst(p.x, p.y + 22, '#22d3ee', 18); beep(900, .2, 'sine', .06, 300); txt(p.x, p.y - 10, '¡Bloqueado!', '#22d3ee'); return }
    G.lives--; G.hit = 1; p.inv = 1.9; G.shake = .45; G.flash = .35; G.combo = 1; G.ct = 0; burst(p.x, p.y + 22, '#ef4444', 22); beep(140, .35, 'sawtooth', .08, 40); if (G.lives <= 0) over()
}
function spawn() {
    const r = R(); let t = 'm'; if (r > .985 && G.lives < 5) t = 'h'; else if (r > .965) t = 'b'; else if (r > .945) t = 'i'; else if (r > .925) t = 'z'; else if (r > .885) t = 'c'; else if (r > .835) t = 'g'; else if (r > .55) t = 's'; if (G.storm > 0 && R() < .8) t = 'm';
    G.it.push({ t, x: 30 + R() * (W - 60), y: -30, vy: (150 + G.lv * 22 + R() * 90 * (t === 'g' ? 2 : 1)) * DS[diff], r: t === 'm' ? 14 + R() * 9 : 14, a: R() * 6 })
}
function collect(o) {
    const p = G.p; G.combo = G.ct > 0 ? Math.min(5, G.combo + 1) : 1; G.ct = 2.2; if (G.combo >= 5) unlock('combo'); let pts = 0;
    if (o.t === 's') { G.got++; stats.stars++; if (stats.stars >= 100) unlock('star100'); pts = 10; burst(o.x, o.y, '#fbbf24'); beep(880 + G.combo * 110, .12, 'triangle', .06) }
    else if (o.t === 'g') { G.got += 3; stats.gems++; if (stats.gems >= 10) unlock('gem'); pts = 50; burst(o.x, o.y, '#67e8f9', 20); beep(1200, .18, 'sine', .07, 1800) }
    else if (o.t === 'h') { G.lives = Math.min(5, G.lives + 1); txt(o.x, o.y, '+1 vida', '#fb7185'); burst(o.x, o.y, '#fb7185'); beep(500, .25, 'triangle', .07, 1000) }
    else if (o.t === 'c') { G.time += 6; txt(o.x, o.y, '+6 s', '#22d3ee'); burst(o.x, o.y, '#22d3ee'); beep(700, .2, 'sine', .07, 1100) }
    else if (o.t === 'i') { G.mag = 7; txt(o.x, o.y, 'Imán', '#f472b6'); burst(o.x, o.y, '#f472b6'); beep(600, .25, 'sine', .07, 1200) } else if (o.t === 'z') { G.frost = 5; txt(o.x, o.y, 'Hielo', '#bae6fd'); burst(o.x, o.y, '#bae6fd'); beep(1000, .3, 'sine', .06, 400) } else if (o.t === 'b') { p.sh = 1; txt(o.x, o.y, 'Escudo', '#67e8f9'); burst(o.x, o.y, '#67e8f9'); beep(400, .25, 'triangle', .07, 900) }
    if (pts) { pts = Math.round(pts * G.combo * DP[diff]); G.sc += pts; txt(o.x, o.y - 14, '+' + pts + (G.combo > 1 ? ' x' + G.combo : ''), '#fde68a') }
}
function lvlUp() { unlock('first'); if (!G.hit) unlock('clean'); G.hit = 0; G.lt = 0; G.stormAt = 7 + R() * 12; G.stormDone = 0; G.storm = 0; G.mag = 0; G.frost = 0; G.sc += Math.round(G.time) * 10; G.lv++; if (G.lv >= 5) unlock('lv5'); if (diff === 2 && G.lv >= 3) unlock('hard'); save(); G.got = 0; G.goal = goalFor(G.lv); G.time = timeFor(G.lv); G.it = []; G.bn = 2; G.p.sh = 0; for (let i = 0; i < 60; i++)G.pt.push({ x: R() * W, y: -10, vx: (R() - .5) * 120, vy: 100 + R() * 200, l: 2.4, m: 2.4, c: ['#fbbf24', '#f472b6', '#22d3ee', '#a78bfa'][i % 4], s: 3 + R() * 4, gr: 120 });[523, 659, 784, 1047].forEach((f, i) => beep(f, .2, 'triangle', .06, 0, i * .11)) }
function upd(dt) {
    const p = G.p; G.tm += dt;
    const dir = ((keys.ArrowRight || keys.d || keys.D) ? 1 : 0) - ((keys.ArrowLeft || keys.a || keys.A) ? 1 : 0), gnd = GY - p.h;
    p.vx += (dir * (330 + G.lv * 6) - p.vx) * Math.min(1, dt * (p.y < gnd ? 6 : 14)); if (dir) p.f = dir; p.x = cl(p.x + p.vx * dt, 20, W - 20);
    p.vy += 1900 * dt; p.y += p.vy * dt; if (p.y >= gnd) { if (p.vy > 350) { p.sq = .25; burst(p.x, GY, '#ffffff66', 6, 140) } p.y = gnd; p.vy = 0; p.j = 0 }
    p.sq = Math.max(0, p.sq - dt * 1.5); p.inv = Math.max(0, p.inv - dt); G.warn = Math.max(0, G.warn - dt); G.shake = Math.max(0, G.shake - dt); G.flash = Math.max(0, G.flash - dt);
    for (const q of G.pt) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += q.gr * dt; q.l -= dt } G.pt = G.pt.filter(q => q.l > 0);
    if (G.bn > 0) { G.bn -= dt; return }
    G.ct = Math.max(0, G.ct - dt); if (!G.ct) G.combo = 1; G.mag = Math.max(0, G.mag - dt); G.frost = Math.max(0, G.frost - dt); G.storm = Math.max(0, G.storm - dt); G.lt += dt; if (!G.stormDone && G.lv >= 2 && G.lt > G.stormAt) { G.storm = 6; G.stormDone = 1; G.warn = 2.2; beep(200, .6, 'sawtooth', .07, 120) }
    G.sp -= dt; if (G.sp <= 0) { G.sp = Math.max(.22, .85 - G.lv * .06) * (.6 + R() * .8) * (G.storm > 0 ? .35 : 1); spawn() }
    G.time -= dt;
    if (G.time <= 0) { G.lives--; G.hit = 1; G.shake = .4; G.flash = .3; G.it = []; G.time = timeFor(G.lv); txt(p.x, p.y - 20, '¡Se acabó el tiempo!', '#fca5a5'); beep(160, .4, 'sawtooth', .07, 60); if (G.lives <= 0) return over() }
    const fm = G.frost > 0 ? .45 : 1; for (const o of G.it) {
        o.a += dt * 3; if (G.mag > 0 && (o.t === 's' || o.t === 'g')) { const dx = p.x - o.x, dy = p.y + 22 - o.y, d = Math.hypot(dx, dy) || 1; if (d < 260) { o.x += dx / d * 420 * dt; o.y += dy / d * 420 * dt } } if (o.t === 'f') { o.x += o.vx * dt * fm; o.life -= dt; if (R() < .5) G.pt.push({ x: o.x, y: o.y, vx: 0, vy: -60, l: .4, m: .4, c: '#fb923c', s: 3, gr: -100 }) } else o.y += o.vy * dt * fm;
        const cx = cl(o.x, p.x - p.w / 2, p.x + p.w / 2), cy = cl(o.y, p.y, p.y + p.h);
        if ((o.x - cx) ** 2 + (o.y - cy) ** 2 < o.r * o.r) { if (o.t === 'm' || o.t === 'f') { if (p.inv <= 0) { hurt(); if (o.t === 'm') { o.dead = 1; burst(o.x, o.y, '#fb923c') } } } else { collect(o); o.dead = 1 } }
        if (o.t === 'm' && !o.dead && o.y >= GY - o.r) {
            o.dead = 1; G.shake = Math.max(G.shake, .18); burst(o.x, GY - 10, '#fb923c', 16, 300); beep(110, .25, 'sawtooth', .05, 50);
            const sp = (140 + G.lv * 16) * DS[diff]; G.it.push({ t: 'f', x: o.x, y: GY - 14, r: 15, vx: sp, life: 3.2, a: 0 }); if (G.lv > 1) G.it.push({ t: 'f', x: o.x, y: GY - 14, r: 15, vx: -sp, life: 3.2, a: 0 })
        }
        else if (o.t !== 'f' && o.y > GY + 20) { o.dead = 1; if (o.t === 's' || o.t === 'g') G.ct = Math.min(G.ct, .2) }
        if (o.t === 'f' && (o.life <= 0 || o.x < -30 || o.x > W + 30)) o.dead = 1
    }
    G.it = G.it.filter(o => !o.dead);
    if (G.got >= G.goal) lvlUp()
}
function rr(x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r) }
function drawBg(l, t) {
    const h = (230 + l * 32) % 360, gr = g.createLinearGradient(0, 0, 0, GY); gr.addColorStop(0, `hsl(${h},55%,9%)`); gr.addColorStop(1, `hsl(${h + 30},60%,27%)`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (const s of bgStars) { g.globalAlpha = .35 + .65 * Math.abs(Math.sin(t * s.z * 2 + s.p)); g.fillStyle = '#fff'; g.fillRect((s.x - t * s.z * 6 + W * 99) % W, s.y, s.s, s.s) } g.globalAlpha = 1;
    const mg = g.createRadialGradient(740, 95, 10, 740, 95, 110); mg.addColorStop(0, `hsla(${h + 40},90%,92%,1)`); mg.addColorStop(.3, `hsla(${h + 40},90%,85%,.9)`); mg.addColorStop(1, 'transparent'); g.fillStyle = mg; g.fillRect(600, 0, 300, 230);
    for (let k = 0; k < 2; k++) { g.fillStyle = `hsl(${h + 10 * k},45%,${14 + k * 6}%)`; g.beginPath(); g.moveTo(0, GY); for (let x = 0; x <= W; x += 15)g.lineTo(x, GY - 50 - k * 10 - 34 * Math.sin(x * (.008 + k * .006) + k * 2) - 18 * Math.sin(x * .021 + k)); g.lineTo(W, GY); g.fill() }
    const gg = g.createLinearGradient(0, GY, 0, H); gg.addColorStop(0, `hsl(${h},40%,16%)`); gg.addColorStop(1, `hsl(${h},45%,6%)`); g.fillStyle = gg; g.fillRect(0, GY, W, H - GY); g.fillStyle = `hsl(${h + 60},70%,60%)`; g.fillRect(0, GY, W, 3)
}
function starPath(x, y, r, a) { g.beginPath(); for (let i = 0; i < 10; i++) { const rad = i % 2 ? r * .45 : r, an = a + i * Math.PI / 5; g.lineTo(x + Math.cos(an) * rad, y + Math.sin(an) * rad) } g.closePath() }
function drawIt(o) {
    g.save();
    if (o.t === 'm') {
        const k = cl(o.y / GY, 0, 1); g.fillStyle = `rgba(239,68,68,${.15 + .5 * k})`; g.beginPath(); g.ellipse(o.x, GY + 8, o.r * (1 + k), 5, 0, 0, 7); g.fill();
        const tr = g.createLinearGradient(o.x, o.y - 90, o.x, o.y); tr.addColorStop(0, 'transparent'); tr.addColorStop(1, '#fb923c'); g.fillStyle = tr; g.fillRect(o.x - o.r * .7, o.y - 90, o.r * 1.4, 90);
        g.shadowColor = '#f97316'; g.shadowBlur = 18; g.fillStyle = '#78350f'; g.beginPath(); g.arc(o.x, o.y, o.r, 0, 7); g.fill(); g.shadowBlur = 0; g.fillStyle = '#451a03'; g.beginPath(); g.arc(o.x - o.r * .3, o.y - o.r * .2, o.r * .28, 0, 7); g.arc(o.x + o.r * .35, o.y + o.r * .3, o.r * .2, 0, 7); g.fill()
    }
    else if (o.t === 'f') { const f = 1 + .2 * Math.sin(G.tm * 30 + o.x); g.shadowColor = '#f97316'; g.shadowBlur = 22; g.fillStyle = '#ea580c'; g.beginPath(); g.ellipse(o.x, o.y, o.r * f, o.r * 1.2, 0, 0, 7); g.fill(); g.fillStyle = '#fbbf24'; g.beginPath(); g.ellipse(o.x, o.y + 3, o.r * .6, o.r * .7, 0, 0, 7); g.fill() }
    else if (o.t === 's') { g.shadowColor = '#fbbf24'; g.shadowBlur = 20; g.fillStyle = '#fde047'; starPath(o.x, o.y, o.r + 2, o.a); g.fill() }
    else if (o.t === 'g') { g.shadowColor = '#22d3ee'; g.shadowBlur = 22; g.translate(o.x, o.y); g.scale(Math.cos(o.a), 1); g.fillStyle = '#67e8f9'; g.beginPath(); g.moveTo(0, -16); g.lineTo(13, 0); g.lineTo(0, 16); g.lineTo(-13, 0); g.fill(); g.fillStyle = '#fff8'; g.beginPath(); g.moveTo(0, -16); g.lineTo(6, 0); g.lineTo(-6, 0); g.fill() }
    else { g.shadowColor = '#fff'; g.shadowBlur = 14; g.font = '28px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText({ h: '❤️', c: '⏱️', b: '🛡️', i: '🧲', z: '❄️' }[o.t], o.x, o.y + Math.sin(o.a) * 3) }
    g.restore()
}
function drawP(p) {
    const t = G.tm; g.fillStyle = '#0006'; g.beginPath(); g.ellipse(p.x, GY + 5, 16 * (1 - (GY - p.y - p.h) / 500), 4, 0, 0, 7); g.fill();
    if (p.inv > 0 && Math.floor(t * 18) % 2) return;
    const run = Math.abs(p.vx) > 40 && p.vy === 0 ? Math.sin(t * 22) * 4 : 0; g.save(); g.translate(p.x, p.y + p.h); g.scale(1 + p.sq * .7 + (p.vy < -100 ? -.08 : 0), 1 - p.sq * .7 + (Math.abs(p.vy) > 200 ? .08 : 0));
    g.fillStyle = '#4c1d95'; rr(-11, -8, 9, 8 + run, 4); g.fill(); rr(2, -8, 9, 8 - run, 4); g.fill();
    g.fillStyle = SK[skin][2]; g.beginPath(); g.moveTo(-p.f * 12, -34); g.quadraticCurveTo(-p.f * (26 + Math.abs(p.vx) / 25), -24, -p.f * 20, -8); g.lineTo(-p.f * 8, -12); g.fill();
    const bg = g.createLinearGradient(0, -44, 0, 0); bg.addColorStop(0, SK[skin][0]); bg.addColorStop(1, SK[skin][1]); g.fillStyle = bg; rr(-15, -42, 30, 36, 13); g.fill();
    g.fillStyle = '#fde68a'; rr(-10, -36, 20, 16, 8); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(-4, -28, 3.6, 0, 7); g.arc(5, -28, 3.6, 0, 7); g.fill(); g.fillStyle = '#1e1b4b'; g.beginPath(); g.arc(-4 + p.f * 1.3, -28, 1.8, 0, 7); g.arc(5 + p.f * 1.3, -28, 1.8, 0, 7); g.fill();
    g.fillStyle = '#fbbf24'; starPath(0, -48, 6, -Math.PI / 2); g.fill();
    if (p.sh) { g.strokeStyle = `rgba(103,232,249,${.6 + .3 * Math.sin(t * 8)})`; g.lineWidth = 3; g.fillStyle = '#22d3ee22'; g.beginPath(); g.arc(0, -24, 34, 0, 7); g.fill(); g.stroke() } if (G.mag > 0) { g.strokeStyle = '#f472b6aa'; g.lineWidth = 2; g.setLineDash([6, 6]); g.lineDashOffset = -G.tm * 40; g.beginPath(); g.arc(0, -24, 46, 0, 7); g.stroke() }
    g.restore()
}
function draw() {
    const t = G ? G.tm : tm; g.save(); if (G && G.shake > 0) g.translate((R() - .5) * 14 * G.shake * 2, (R() - .5) * 14 * G.shake * 2);
    drawBg(G ? G.lv : 1, t);
    if (G) {
        for (const o of G.it) drawIt(o); drawP(G.p);
        for (const q of G.pt) { g.globalAlpha = cl(q.l / q.m * 1.4, 0, 1); if (q.t) { g.fillStyle = q.c; g.font = '700 20px Fredoka,sans-serif'; g.textAlign = 'center'; g.fillText(q.t, q.x, q.y) } else { g.fillStyle = q.c; g.fillRect(q.x, q.y, q.s, q.s) } } g.globalAlpha = 1;
        if (G.flash > 0) { g.fillStyle = `rgba(239,68,68,${G.flash})`; g.fillRect(0, 0, W, H) }
        if (G.frost > 0) { g.fillStyle = 'rgba(147,197,253,.13)'; g.fillRect(0, 0, W, H) }
        if (G.warn > 0) { const a = .5 + .5 * Math.sin(G.tm * 14); g.fillStyle = `rgba(239,68,68,${.14 * a})`; g.fillRect(0, 0, W, H); g.fillStyle = '#fecaca'; g.textAlign = 'center'; g.font = '700 46px Fredoka,sans-serif'; g.fillText('¡Lluvia de meteoritos!', W / 2, 150) }
        if (G.bn > 0 && state === 'play') { const k = cl(G.bn / 2, 0, 1), a = k > .85 ? (1 - k) / .15 : k < .2 ? k / .2 : 1; g.globalAlpha = a; g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '700 84px Fredoka,sans-serif'; g.shadowColor = '#ec4899'; g.shadowBlur = 30; g.fillText('Nivel ' + G.lv, W / 2, 230); g.font = '500 28px Fredoka,sans-serif'; g.shadowBlur = 0; g.fillText('Consigue ' + G.goal + ' estrellas en ' + timeFor(G.lv) + ' segundos', W / 2, 280); g.globalAlpha = 1 }
    }
    g.restore()
}
let cache = {}; const set = (id, v) => { if (cache[id] !== v) { cache[id] = v; $('#' + id).textContent = v } };
function hud() {
    const l = G.lives; set('hearts', '❤️'.repeat(l) + '🤍'.repeat(Math.max(0, 5 - l))); set('lv', G.lv); set('sc', G.sc); set('tm', Math.max(0, Math.ceil(G.time)));
    $('#gb').style.width = cl(G.got / G.goal * 100, 0, 100) + '%'; $('#tb').style.width = cl(G.time / timeFor(G.lv) * 100, 0, 100) + '%'; $('#tbw').classList.toggle('low', G.time < 8); set('cb', G.combo > 1 ? 'Combo x' + G.combo : ''); set('fx', (G.mag > 0 ? '🧲' + Math.ceil(G.mag) + ' ' : '') + (G.frost > 0 ? '❄️' + Math.ceil(G.frost) + ' ' : '') + (G.p.sh ? '🛡️' : ''))
}
function loop(t) { const dt = Math.min(.033, (t - last) / 1000 || 0); last = t; tm += dt; if (state === 'play') upd(dt); draw(); if (G && (state === 'play' || state === 'pause')) hud(); requestAnimationFrame(loop) }
requestAnimationFrame(loop);
document.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a; b.blur();
    if (a === 'play') start(); else if (a === 'menu') menu(); else if (a === 'help') show('help'); else if (a === 'pause' || a === 'resume') pause();
    else if (a === 'snd') snd = !snd; else if (a === 'mus') mus = !mus; else if (a === 'diff') diff = (diff + 1) % 3; else if (a === 'skin') skin = (skin + 1) % SK.length; else if (a === 'rec') rec(); else if (a === 'fs') { document.fullscreenElement ? document.exitFullscreen() : $('#app').requestFullscreen && $('#app').requestFullscreen() }
    lab(); save()
});
addEventListener('keydown', e => {
    keys[e.key] = true; if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); if (!e.repeat) jump() }
    if (['p', 'P', 'Escape'].includes(e.key)) pause(); if (e.key === 'Enter' && (state === 'menu' || state === 'over')) start(); if (e.key.startsWith('Arrow')) e.preventDefault()
});
addEventListener('keyup', e => delete keys[e.key]);
addEventListener('blur', () => { keys = {}; if (state === 'play') pause() });
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'play') pause() });
[['tl', 'ArrowLeft'], ['tr', 'ArrowRight']].forEach(([id, k]) => { const b = $('#' + id); b.addEventListener('pointerdown', e => { e.preventDefault(); keys[k] = true });['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => delete keys[k])) });
$('#tj').addEventListener('pointerdown', e => { e.preventDefault(); jump() });
lab();
