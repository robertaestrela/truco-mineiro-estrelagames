# EstrelaGames · protótipo navegável

Protótipo mobile do **EstrelaGames** (redesign *Apple Gamer Style*), fiel ao Figma e ao Design System EstrelaGames. Todos os jogos liberados funcionam contra **bots**:

| Jogo | Modos |
| --- | --- |
| Truco | Paulista e Mineiro · 1x1 e 2x2 |
| Cacheta | Pif-Paf e Cacheta · 1x1 (Cachetão em breve) |
| Buraco | Aberto e Fechado · 2x2 |
| Tranca | Clássica · 2x2 |
| Poker | Texas Hold'em Sit & Go · 1x1 e mesa de 6 |
| Sinuca | em breve |

**Fluxo:** o app abre no cadastro (boas-vindas → celular → código → senha → apelido), **sem personagem**. A Loja desbloqueia os pacotes de skins (Nobru & Inhui, Magia do bar, Reis do baralho, Estelar); ao embarcar, a aba **Jogos** vira a Home com o vídeo do personagem e as escolhas (avatar, mesa, baralho) passam para todos os jogos.

**Batalhas:** lobby com busca e filtro por jogo, criação em 5 passos (jogo → modo e formato → rodadas 1/3/5/10 → buy-in → aberta ou fechada com senha), sala de espera que enche com bots e **série de partidas**: vence quem ganhar mais rodadas e leva o prêmio.

Também navegáveis com dados de exemplo: Chat (bônus e mesas no chat), Notificações, Perfil, Histórico, Ranking (geral e por jogo), Ajustes, Limites e Carteira (Pix).

## Rodar

É um site estático. Abra `index.html` por um servidor local (vídeos e fontes precisam de http):

```bash
python3 -m http.server 8000
```

e acesse http://localhost:8000. No celular, use o link do GitHub Pages.

Atalhos de teste na URL: `?home` pula o cadastro · `&skin=gamer_ela` já entra com um personagem · `&go=loja` abre uma tela · `&play=truco:Mineiro:2x2` abre uma partida.

## Estrutura

```
index.html        casca (telas são renderizadas pelos scripts)
css/tokens.css    tokens do DS EstrelaGames (cores, tipografia) resolvidos 1:1
css/ui.css        componentes (header-game, navbar-glass, game-block, tabs, button-glass, stake-pill, table-glass…)
css/screens.css   telas (cadastro, lobby, Home com skin, Loja, Batalhas, Chat, Perfil, Ranking, Carteira…)
css/game.css      tela de jogo (match-top, match-nav, cartas, chamada de truco, resultado)
js/core.js        dados e estado
js/ui.js          componentes em HTML
js/screens.js     navegação, cadastro, lobby, Home, fila e resultado
js/loja.js        Loja, pacotes, escolha de personagem e recompensa
js/social.js      Chat, Notificações, Perfil, Ajustes, Carteira e Ranking
js/battles.js     Batalhas e série de partidas
js/games.js       motores dos jogos e bots
assets/           ícones 3D, fotos e vídeos dos personagens, mesas, artes da Loja
```

**Adicionar um jogo (ex.: Sinuca):** crie `js/sinuca.js` com `GAME_START.sinuca = startSinuca`, inclua o script no `index.html` e tire `soon: true` da Sinuca em `GAMES` (`js/core.js`).
