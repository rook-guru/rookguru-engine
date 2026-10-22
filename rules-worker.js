// Rules worker for rook.guru mini-games. GPL-3.0-or-later, see LICENSE.
//
// Runs ffish (Fairy-Stockfish rules, https://github.com/fairy-stockfish/fairy-stockfish.wasm) in its own
// module worker and answers plain JSON messages, so the page never links against ffish.
// Expects ffish.js, ffish.wasm and variants.ini next to this file.
//
// Request:  { id, type: "state", variant, fen?, moves: ["e2e4", ...] }
// Response: { id, ok: true, fen, legalMoves: [...], check, over, result }   result: "1-0" | "0-1" | "1/2-1/2" | "*"
// Error:    { id, ok: false, error }

const base = new URL(".", import.meta.url);

const ready = (async () => {
  const { default: create } = await import(new URL("ffish.js", base).href);
  const ffish = await create({ locateFile: (file) => new URL(file, base).href });
  const ini = await fetch(new URL("variants.ini", base)).then((r) => r.text());
  ffish.loadVariantConfig(ini);
  return ffish;
})();

function state(ffish, { variant, fen, moves = [] }) {
  const board = fen ? new ffish.Board(variant, fen) : new ffish.Board(variant);
  try {
    for (const move of moves) {
      if (!board.push(move)) throw new Error(`illegal move ${move}`);
    }
    const legal = board.legalMoves();
    return {
      fen: board.fen(),
      legalMoves: legal ? legal.split(" ") : [],
      check: board.isCheck(),
      over: board.isGameOver(),
      result: board.result(),
    };
  } finally {
    board.delete();
  }
}

self.onmessage = async ({ data }) => {
  const { id } = data;
  try {
    const ffish = await ready;
    if (data.type !== "state") throw new Error(`unknown request ${data.type}`);
    self.postMessage({ id, ok: true, ...state(ffish, data) });
  } catch (e) {
    self.postMessage({ id, ok: false, error: String(e && e.message ? e.message : e) });
  }
};
