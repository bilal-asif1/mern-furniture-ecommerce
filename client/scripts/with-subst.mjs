import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error('Usage: node scripts/with-subst.mjs <command> [args...]');
  process.exit(1);
}

const cwd = process.cwd();
const projectRoot = path.resolve(cwd, '..');
const needsAlias = process.platform === 'win32' && projectRoot.includes(' ');

const findFreeDrive = () => {
  for (let code = 90; code >= 67; code -= 1) {
    const drive = `${String.fromCharCode(code)}:`;
    if (!existsSync(`${drive}\\`)) {
      return drive;
    }
  }

  throw new Error('No free drive letter available for a temporary subst mapping.');
};

const run = (runCwd, cleanup) => {
  const child = spawn(command, args, {
    cwd: runCwd,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  child.on('exit', (code) => {
    if (cleanup) cleanup();
    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    if (cleanup) cleanup();
    console.error(error);
    process.exit(1);
  });
};

if (!needsAlias) {
  run(cwd);
} else {
  const drive = findFreeDrive();
  const mapped = spawnSync('cmd.exe', ['/c', 'subst', drive, projectRoot], {
    stdio: 'inherit',
  });

  if (mapped.status !== 0) {
    run(cwd);
  } else {
    const cleanup = () => {
      spawnSync('cmd.exe', ['/c', 'subst', drive, '/d'], {
        stdio: 'ignore',
      });
    };

    run(`${drive}\\client`, cleanup);
  }
}
