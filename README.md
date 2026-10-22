# rookguru-engine

The free software part of the mini-games on [rook.guru](https://rook.guru): playing chess variants against a bot
right in the browser.

The site serves these files from `/engine/`:

| File | What it is | Source |
|---|---|---|
| `stockfish.js`, `stockfish.wasm`, `stockfish.worker.js` | Fairy-Stockfish, the bot, unmodified | npm [`fairy-stockfish-nnue.wasm@1.1.12`](https://www.npmjs.com/package/fairy-stockfish-nnue.wasm/v/1.1.12), source [fairy-stockfish/fairy-stockfish.wasm](https://github.com/fairy-stockfish/fairy-stockfish.wasm) and [fairy-stockfish/Fairy-Stockfish](https://github.com/fairy-stockfish/Fairy-Stockfish) |
| `ffish.js`, `ffish.wasm` | ffish, Fairy-Stockfish rules as a library, unmodified | npm [`ffish-es6@0.7.10`](https://www.npmjs.com/package/ffish-es6/v/0.7.10), source in the same repositories |
| `rules-worker.js` | worker that answers rules questions (legal moves, check, game over) with JSON messages | this repository |
| `variants.ini` | our variant definitions (pawn war, pawns vs queen) for both the bot and the rules | this repository |

The site talks to the bot with UCI text commands and to the rules worker with JSON messages; neither is linked into
the site's own code.

## Rules worker protocol

```
→ { id, type: "state", variant, fen?, moves: ["e2e4", ...] }
← { id, ok: true, fen, legalMoves: ["e7e5", ...], check, over, result }
← { id, ok: false, error }
```

`variant` is a Fairy-Stockfish variant name (`antichess`, `3check`, `kingofthehill`) or one from `variants.ini`
(`pawnwar`, `pawnsqueen`). The worker must be started as a module worker with `ffish.js`, `ffish.wasm` and
`variants.ini` next to it.

## License

GPL-3.0-or-later, see [LICENSE](LICENSE). Fairy-Stockfish and ffish are GPL-3.0 by their authors.
