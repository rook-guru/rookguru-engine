# rookguru-engine

The free software part of the mini-games on [rook.guru](https://rook.guru): playing chess variants against a bot
right in the browser. Repository: <https://github.com/rook-guru/rookguru-engine>.
License: GPL-3.0-or-later, full text — <https://github.com/rook-guru/rookguru-engine/blob/main/LICENSE>.

## What the site serves from `/engine/`

| File | What it is | Exact version | Corresponding source and build instructions |
|---|---|---|---|
| `stockfish.js`, `stockfish.wasm`, `stockfish.worker.js` | Fairy-Stockfish, the bot, unmodified | npm [`fairy-stockfish-nnue.wasm@1.1.12`](https://www.npmjs.com/package/fairy-stockfish-nnue.wasm/v/1.1.12) | [fairy-stockfish/fairy-stockfish.wasm@b2e693e](https://github.com/fairy-stockfish/fairy-stockfish.wasm/tree/b2e693ef1e111233ce3fb40685921708b3276ed6) — build steps in its [README](https://github.com/fairy-stockfish/fairy-stockfish.wasm/blob/b2e693ef1e111233ce3fb40685921708b3276ed6/README.md) |
| `ffish.js`, `ffish.wasm` | ffish, Fairy-Stockfish rules as a library, unmodified | npm [`ffish-es6@0.7.10`](https://www.npmjs.com/package/ffish-es6/v/0.7.10) | [ianfab/Fairy-Stockfish@43b66c8](https://github.com/ianfab/Fairy-Stockfish/tree/43b66c8abfebfcab893a3a4c349aa790d18df148) — build steps in [tests/js/README.md](https://github.com/ianfab/Fairy-Stockfish/blob/43b66c8abfebfcab893a3a4c349aa790d18df148/tests/js/README.md) |
| `rules-worker.js` | worker that answers rules questions (legal moves, check, game over) with JSON messages | this repository, tag [`v0.1.1`](https://github.com/rook-guru/rookguru-engine/tree/v0.1.1) | this repository, no build step |
| `variants.ini` | our variant definitions (pawn war, pawns vs queen) for both the bot and the rules | same | same |
| `Copying.txt` | GPL-3.0 text, shipped with Fairy-Stockfish | — | — |

The commits above are the `gitHead` npm recorded when each package version was published. The site talks to the bot
with UCI text commands and to the rules worker with JSON messages; neither is linked into the site's own code.

## Rules worker protocol

```
→ { id, type: "state", variant, fen?, moves: ["e2e4", ...] }
← { id, ok: true, fen, legalMoves: ["e7e5", ...], check, over, result }
← { id, ok: false, error }
```

`variant` is a Fairy-Stockfish variant name (`antichess`, `3check`, `kingofthehill`) or one from `variants.ini`
(`pawnwar`, `pawnsqueen`). The worker must be started as a module worker with `ffish.js`, `ffish.wasm` and
`variants.ini` next to it.
