// Nusantara in Numbers — hand-in program (Node 22, standard library only).
//
// The site itself lives in app/ as plain static files (HTML, CSS and classic
// scripts, no build step) and its screenshots in screenshots/. This program
// is the courier: it copies both folders into the output directory and asks
// the vendored make.fun library to write dossier.json, the summary the
// judges read. vendor/makefun-frontend.ts stays byte for byte the kit's
// copy, because the scorer rebuilds the dossier with its own copy and
// compares the two.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The scorer's caps, mirrored so a bad hand-in fails here with a clear word
// instead of failing silently there.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function repoRoot(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
}

function requireFolder(root: string, name: string): string {
  const path = join(root, name);
  if (!existsSync(path)) throw new Error(`missing ${name}/ beside main.ts`);
  return path;
}

function copyFolder(from: string, to: string): void {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

function countShots(folder: string): number {
  return readdirSync(folder).filter((name) => !name.startsWith('.')).length;
}

function handIn(): void {
  const root = repoRoot();
  const out = outputDir();
  const app = requireFolder(root, 'app');
  const shots = requireFolder(root, 'screenshots');
  if (countShots(shots) < 3) throw new Error('screenshots/ needs at least 3 shots');

  mkdirSync(out, { recursive: true });
  copyFolder(app, join(out, 'app'));
  copyFolder(shots, join(out, 'screenshots'));
  writeFileSync(join(out, 'dossier.json'), buildDossier(out, DOSSIER_CAPS));
  console.log(`handed in: app/ + ${countShots(shots)} screenshots -> ${out}`);
}

handIn();
