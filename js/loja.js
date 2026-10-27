/* EstrelaGames · Loja: pacotes de skins → desbloqueado → escolher personagem → Home com skin; baralhos; recompensa */
'use strict';
const LOJA = {cat: 'skins'};
const PRICE = 9.9;
const packActive = id => hasSkin() && packOf(ST.crew) === id;
function packCardL(id, mode = 'loja') {
  const p = PACKS[id], act = packActive(id), own = ST.owned[id];
  const tg = act ? tag('Ativo', 'success') : own ? tag('Seu', 'success') : mode === 'page' ? tag('Pacote de skins', 'danger') : tag('Em destaque', 'danger');
  const label = act ? 'Trocar personagem' : own ? 'Escolher personagem' : `Comprar · ${fmt2(PRICE)}`;
  return `<div class="spk L" role="button" tabindex="0" data-pack="${id}" style="background-image:url(${A}art/${p.artL}.webp);background-position:${p.posL}">
    <span class="top">${tg}</span>
    <span class="info"><span class="tx"><b>${p.name}</b><small>${p.caption}</small></span>${btn(label, 'pri', 's', `data-a="packAct:${id}"`)}</span></div>`;
}
function packCardS(id) {
  const p = PACKS[id], act = packActive(id), own = ST.owned[id];
  // Magia do bar e Reis do baralho mostram o Rei e a Rainha lado a lado (como no Figma)
  const bg = p.duo ? `background-image:url(${A}art/${p.artS}.webp),url(${A}art/${p.artL}.webp);background-size:50% auto,50% auto;background-position:left 12%,right 12%;background-repeat:no-repeat` : `background-image:url(${A}art/${p.artS}.webp);background-position:${p.posS}`;
  return `<button class="spk S" data-pack="${id}"><span class="art" style="${bg}">${act ? tag('Ativo', 'success') : own ? tag('Seu', 'success') : tag('Novo', 'danger')}${own ? '' : `<span class="price">${fmt2(PRICE)}</span>`}</span>
    <span class="tx"><b>${p.name}</b><small>${p.skins} skins</small></span></button>`;
}
const soonCard = (n, k) => `<div class="spk S blocked t${k}" aria-label="${n} · em breve"><span class="art">${tag('Em breve')}${ic('lock', 'lock')}</span><span class="tx"><b>Em breve</b><small>Novos personagens</small></span></div>`;
const LOJA_CATS = [['skins', 'user', 'Skins'], ['baralhos', 'truco', 'Baralhos'], ['molduras', 'crown', 'Molduras'], ['efeitos', 'fire', 'Efeitos'], ['ofertas', 'gift', 'Ofertas']];
SCREENS.loja = {cls: 'loja', render: () => {
  const cats = `<div class="hscroll chips">${LOJA_CATS.map(([k, i, l]) => `<button class="chip ${LOJA.cat === k ? 'on' : ''}" data-cat="${k}">${ic(i)}${l}</button>`).join('')}</div>`;
  let body;
  if (LOJA.cat === 'baralhos') {
    body = `<div class="packs">${stitle('Baralhos', 'Ative o verso que quiser · vale em todos os jogos')}
      <div class="decks">${DECKS.map(([k, l]) => `<button class="deckc ${ST.deck === k ? 'on' : ''}" data-deck="${k}"><span class="dk">${deckBack(k, 'L')}</span><b>${l}</b>${ST.deck === k ? tag('Ativo', 'success') : tag('Seu', 'neutral')}</button>`).join('')}</div></div>`;
  } else {
    // ordem: Nobru & Inhui em destaque · Magia do bar · Reis do baralho · Estelar
    body = `${packCardL('nobru')}
      <div class="packs">${stitle('Pacotes de skins', 'Ganhe jogando ou compre')}
        <div class="pgrid">${['magia', 'reis', 'estelar'].map(packCardS).join('')}${['Velho Oeste', 'Neon', 'Piratas'].map((n, k) => soonCard(n, k)).join('')}</div>
        <p class="note">Ao desbloquear, todos os personagens do pacote ficam seus. Você escolhe com qual jogar e pode trocar quando quiser.</p></div>`;
  }
  return `<div class="pg-top">${header()}${ptop('Loja', null, 'home')}</div><div class="scroll"><div class="content">${cats}${body}</div></div>${navbar('loja')}`;
}, click: e => {
  const c = e.target.closest('[data-cat]'); if (c) { if (c.dataset.cat === 'skins' || c.dataset.cat === 'baralhos') { LOJA.cat = c.dataset.cat; rerender(); } else toast(`${c.textContent.trim()} · em breve na Loja`); return; }
  const d = e.target.closest('[data-deck]'); if (d) { ST.deck = d.dataset.deck; rerender(); toast(`Baralho ${DECKS.find(x => x[0] === ST.deck)[1]} ativado`); return; }
  const p = e.target.closest('[data-pack]'); if (p) openPack(p.dataset.pack);
}};
function openPack(id) { ST.pack = id; if (ST.owned[id]) openPicker(id); else go('pacote', {id}); }
ACT.packAct = id => { ST.pack = id; if (ST.owned[id]) openPicker(id); else if (CUR === 'pacote') buyPack(id); else go('pacote', {id}); };

/* ---------- página do pacote (M02 · M09 · M15 · M21) ---------- */
function includedHTML(id) {
  const p = PACKS[id];
  if (id === 'estelar') return `<div class="crew-rows">${['ele', 'ela'].map(g => `<div class="crew-row">${p.roles.map(r => `<div>${av(r, g, 'm')}<small>${crewName(r, g)}</small></div>`).join('')}</div>`).join('')}</div>`;
  const r = p.roles[0];
  return `<div class="crew-row duo">${['ele', 'ela'].map(g => `<div>${av(r, g, 'l')}<small>${crewName(r, g)}</small></div>`).join('')}</div>`;
}
SCREENS.pacote = {cls: 'pack', render: ({id}) => {
  const p = PACKS[id], won = ST.rewardsWon;
  return `<div class="pg-top">${header()}${ptop(p.name)}</div><div class="scroll"><div class="content">
    ${packCardL(id, 'page')}
    <div class="pk-box">${stitle('Personagens incluídos', p.incl)}${includedHTML(id)}</div>
    <div class="pk-box unl">${stitle('Como desbloquear', 'Escolha um dos caminhos')}
      <button class="uopt" data-a="buyPack:${id}">${ic('banknote')}<span class="tx"><b>Comprar agora</b><small>Libera na hora, direto do seu saldo</small></span><span class="pr">${fmt2(PRICE)}</span></button>
      <button class="uopt" data-a="earnPack:${id}">${ic('trophy')}<span class="tx"><b>Ganhar jogando</b><small>Vença 20 partidas em qualquer jogo</small></span><span class="pg"><b>${won}/20</b><span class="tr"><i style="width:${won / 20 * 100}%"></i></span></span></button>
    </div></div></div>${navbar('loja')}`;
}};
function buyPack(id) {
  if (ST.saldo < PRICE) { toast('Saldo insuficiente · deposite pela Carteira'); return; }
  ST.saldo = +(ST.saldo - PRICE).toFixed(2); ST.owned[id] = true; ST.pack = id;
  refreshChrome(); unlockedSheet(id);
}
Object.assign(ACT, {
  buyPack: id => buyPack(id),
  earnPack: () => toast(`Faltam ${20 - ST.rewardsWon} vitórias · ao completar 20 você ganha uma skin`)
});

/* ---------- sheet "Pacote desbloqueado!" (M03 · M10 · M16 · M22) ---------- */
function heroAvatars(id) {
  const p = PACKS[id];
  if (id === 'estelar') return `${'<i class="glw"></i>'}<span class="av m" style="left:12px;top:92px"><img src="${photo('engenheiro', 'ela')}" alt=""></span><span class="av m" style="left:283px;top:92px"><img src="${photo('explorador', 'ele')}" alt=""></span>
    <span class="av l" style="left:48px;top:64px"><img src="${photo('comandante', 'ele')}" alt=""></span><span class="av l" style="left:215px;top:64px"><img src="${photo('piloto', 'ela')}" alt=""></span>
    <span class="av xl" style="left:112px;top:36px"><img src="${photo('navegador', 'ela')}" alt=""></span>`;
  const r = p.roles[0];
  return `<i class="glw"></i><span class="av xl" style="left:56px;top:44px"><img src="${photo(r, 'ele')}" alt=""></span><span class="av xl" style="left:168px;top:44px"><img src="${photo(r, 'ela')}" alt=""></span>`;
}
function unlockedSheet(id) {
  const p = PACKS[id];
  openSheet(`<div class="hero">${heroAvatars(id)}</div><h2>Pacote desbloqueado!</h2>
    <p>${id === 'estelar' ? 'Os 10 personagens do Estelar agora são seus. Escolha com qual você quer jogar.' : `${p.incl} agora são seus. Escolha com qual você quer jogar.`}</p>
    <div class="row">${btn('Agora não', 'sec', 'm m44', 'data-a="unlockLater"')}${btn('Escolher personagem', 'pri', 'm m44', `data-a="unlockChoose:${id}"`)}</div>`, {cls: 'unlock'});
}
Object.assign(ACT, {
  unlockLater: () => { closeSheet(); go('loja', {}, {noHist: true}); },
  unlockChoose: id => { closeSheet(); openPicker(id); }
});

/* ---------- escolher personagem (character-picker · Ele | Ela, Ela rosa; vídeo top-center) ---------- */
const PICK = {pack: 'nobru', c: 'gamer', g: 'ele', back: 'loja'};
function openPicker(id, back) {
  PICK.pack = id; PICK.back = back || CUR;
  if (packActive(id)) { PICK.c = ST.crew; PICK.g = ST.g; }
  else if (ST.reward && ST.reward.pack === id && ST.reward.taken) { PICK.c = ST.reward.c; PICK.g = ST.reward.g; }
  else [PICK.c, PICK.g] = PACKS[id].def;
  go('picker');
}
SCREENS.picker = {cls: 'picker-scr', render: () => {
  const p = PACKS[PICK.pack], estelar = PICK.pack === 'estelar', cc = crewColor(PICK.c, PICK.g);
  const crew = estelar ? p.roles.map(r => [r, PICK.g]) : [[p.roles[0], 'ele'], [p.roles[0], 'ela']];
  return `<div class="pg-top">${header()}${ptop(p.page, null, 'pickBack')}</div>
    <div class="scr picker" style="position:relative;inset:auto;flex:1;min-height:0">
      ${tabs([['ele', 'Ele'], ['ela', 'Ela']], PICK.g, PICK.g === 'ela' ? 'rosa' : '', 'pg')}
      <div class="stg" style="--cc:${cc}"><video src="${stageVid(PICK.c, PICK.g)}" autoplay muted loop playsinline preload="auto" poster="${photo(PICK.c, PICK.g)}"></video>
        <button class="arrow p" data-a="pickStep:-1" aria-label="Anterior">${svg('i-chev-l-light')}</button><button class="arrow n" data-a="pickStep:1" aria-label="Próximo">${svg('i-chev-r-light')}</button>
        <div class="ident"><b>${crewName(PICK.c, PICK.g)}</b><small><i></i>${ROLE_SUB[PICK.c]}</small></div></div>
      <div class="crew">${crew.map(([c, g]) => `<button class="${c === PICK.c && g === PICK.g ? 'on' : ''}" style="--cc:${crewColor(c, g)}" data-pc="${c}|${g}" aria-label="${crewName(c, g)}"><img src="${photo(c, g)}" alt=""></button>`).join('')}</div>
      <div class="acts">${btn('Agora não', 'sec', 'l', 'data-a="pickBack"')}${btn('Embarcar', 'pri', 'l', 'data-a="embark"')}</div>
    </div>`;
}, click: e => {
  const t = e.target.closest('[data-pg],[data-pc]'); if (!t) return;
  if (t.dataset.pg) PICK.g = t.dataset.pg; else [PICK.c, PICK.g] = t.dataset.pc.split('|');
  rerender();
}};
Object.assign(ACT, {
  pickStep: d => { const p = PACKS[PICK.pack]; if (p.roles.length === 1) PICK.g = PICK.g === 'ele' ? 'ela' : 'ele'; else { const i = p.roles.indexOf(PICK.c); PICK.c = p.roles[(i + +d + p.roles.length) % p.roles.length]; } rerender(); },
  pickBack: () => back(),
  embark: () => {
    ST.crew = PICK.c; ST.g = PICK.g; ST.owned[PICK.pack] = true;
    const m = PACKS[PICK.pack].mesa; if (m) { ST.mesaChoice = m; }
    if (ST.reward && ST.reward.pack === PICK.pack) ST.reward = null;
    HIST = []; go('jogos', {}, {noHist: true});
    toast(`Skin ${crewName(ST.crew, ST.g)} ativada · a aba Jogos é sua Home`);
  }
});

/* ---------- "Você ganhou uma skin!" (G01) · recompensa de 20 vitórias ---------- */
function showRewardSheet() {
  const r = ST.reward; if (!r) return;
  const p = PACKS[r.pack];
  closeSheet();
  setTimeout(() => openSheet(`<div class="hero"><i class="glw"></i><span class="av xl" style="left:112px;top:36px"><img src="${photo(r.c, r.g)}" alt=""></span></div>
    ${tag('Recompensa', 'gold')}<h2>Você ganhou uma skin!</h2>
    <p>${crewName(r.c, r.g)} · pacote ${p.name}. Ative agora ou guarde para depois.</p>
    <div class="row">${btn('Ver depois', 'sec', 'm m44', 'data-a="rewardLater"')}${btn('Ativar agora', 'pri', 'm m44', 'data-a="rewardNow"')}</div>`, {cls: 'unlock'}), 200);
}
Object.assign(ACT, {
  rewardNow: () => { const r = ST.reward; closeSheet(); ST.owned[r.pack] = true; r.taken = true; $('#overlay').innerHTML = ''; endAllGames(); openPicker(r.pack, 'jogos'); },
  rewardLater: () => { const r = ST.reward; closeSheet(); ST.owned[r.pack] = true; r.taken = true; r.later = true; toast('Recompensa guardada · toque no seu perfil para ativar'); }
});
