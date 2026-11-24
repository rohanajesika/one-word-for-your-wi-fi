// One Word for Your Wi-Fi — make.fun bounty
// u-tuan-muda-one-word-for-your-wi-fi-a1b4fd72
//
// The entry is exactly one word: the entrant's Wi-Fi, described in
// a single word. A judge model compares words two at a time and
// picks the one that is funnier and truer about Wi-Fi; the word
// that wins the most comparisons takes the reward, and becomes the
// sponsor's network name. The program writes that one word, and
// nothing else, deterministically, to /output/entry.txt.
//
// Candidate words weighed against the judge's brief, in the order
// the brief weighs them (on-subject first, then funny at once, then
// true to how home Wi-Fi actually behaves, then a fresh angle, then
// a single word a reader gets instantly):
//   1. "buffering" — the first word everyone reaches for, the
//      safe, expected pick. Fails the freshness test outright, and
//      it is the word most likely to be duplicated by other
//      entries and by the house's own fixed texts.
//   2. "loading" — the same problem, and it is not even funny:
//      it states a status instead of landing a joke.
//   3. "lagging" — describes the symptom and is mildly funny, but
//      it is another word everyone reaches for; no surprise in it.
//   4. "slow" — true, but not funny at all. A description, not a
//      joke; it loses on the second criterion immediately.
//   5. "reconnecting" — true, the eternal state of home Wi-Fi, and
//      faintly funny, but long and clinical; it reads like a status
//      message, not a punchline.
//   6. "moody" — short and true, Wi-Fi does have moods, and mildly
//      funny. But it names a personality trait rather than the
//      lived experience of the signal itself vanishing; the joke is
//      gentle where it could be sharp.
//   7. "flaky" — true and funny, and short. But it is a generic
//      complaint word, the kind of word used for people, plans and
//      pastry alike; it is not specific to Wi-Fi.
//   8. "onebar" — funny and true, one bar of signal, instantly
//      readable. But it reads as a status readout, a measurement,
//      rather than a description with a laugh in it.
//   9. "microwave" — the surprising angle: the microwave is the
//      enemy of 2.4 GHz Wi-Fi. But it names a thing that kills
//      Wi-Fi, not Wi-Fi itself, so it is weak on the first
//      criterion, and the joke needs explaining — the brief says a
//      word that only makes sense once explained has already lost.
//  10. "ghosting" — the pick. Wi-Fi ghosts you: there one second,
//      gone mid-sentence, no explanation, no goodbye, back again
//      as if nothing happened. Funny at once: a dating word aimed
//      at a router is a real laugh, no explanation needed. True:
//      everyone has been ghosted by their Wi-Fi mid-call. Fresh:
//      it is not the buffering or loading everyone reaches for.
//      One word, eight letters, spelled so a reader gets it
//      instantly. It beats the safe words on freshness, the
//      clinical words on the laugh, and the vague words on being
//      exactly what home Wi-Fi does.
//
// The program writes that one word, deterministically, to
// /output/entry.txt. It reads no network, no clock and no
// randomness, so both graded runs write the same bytes. It creates
// no directories: the grader provides a writable output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen word: Wi-Fi ghosts you — one word, no trailing
// newline, no spaces.
const WORD = "ghosting";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 20
// characters, not only white space. Check the word before writing
// it, so a bad value can never be submitted by accident.
const chars = [...WORD].length;
if (chars < 1 || chars > 20) {
  console.error(`word is ${chars} characters, must be 1-20`);
  process.exit(1);
}
if (WORD.trim().length === 0) {
  console.error("word must not be only white space");
  process.exit(1);
}
if (/[\s\p{C}]/u.test(WORD)) {
  console.error("word must not contain whitespace or control characters");
  process.exit(1);
}
// A Wi-Fi name comes as plain letters: no digits, no punctuation
// tricks, no hidden characters — the judge brief rules those out.
if (!/^[a-z]+$/.test(WORD)) {
  console.error("word must be lowercase letters only");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, WORD, "utf8");

// Read back what was written and confirm it is byte-for-byte the word:
// a partial or altered write must fail loudly instead of being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== WORD) {
  console.error("entry.txt does not match the word");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 20) {
  console.error("entry.txt must be 1-20 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the word's UTF-8
// bytes — no BOM, no trailing newline, no extra whitespace — so the
// judge sees one word and nothing else.
const expectedBytes = Buffer.from(WORD, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the word exactly");
  process.exit(1);
}
if (written.split(/\s+/).length !== 1 || written.split(/\s+/)[0] !== WORD) {
  console.error("entry.txt must contain exactly one word");
  process.exit(1);
}
