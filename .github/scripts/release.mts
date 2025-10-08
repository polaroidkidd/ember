/**
 * release.mts
 *
 * Simple release helper that:
 *  - reads the current version from package.json
 *  - runs `pnpm publish -r`
 *  - creates an annotated git tag `v<version>` (if not present)
 *  - pushes the tag to `origin`
 *
 * Usage:
 *  node release.mts            # perform publish, tag, and push
 *  DRY_RUN=1 node release.mts  # print commands without running them
 *  node release.mts --dry-run  # same as DRY_RUN
 */

import { execSync } from 'child_process';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(root, 'package.json');

const dryRun =
	process.env.DRY_RUN === '1' || process.argv.includes('--dry-run');

function run(cmd: string, opts: Record<string, unknown> = {}): unknown {
	if (dryRun) {
		console.log(`[dry-run] ${cmd}`);
		return;
	}
	console.log(`> ${cmd}`);
	return execSync(cmd, { stdio: 'inherit', ...opts });
}

try {
	const raw = await readFile(pkgPath, 'utf8');
	const pkg = JSON.parse(raw);
	const version = pkg && pkg.version;
	if (!version) {
		console.error('package.json does not contain a version field');
		process.exit(1);
	}

	const tag = `v${version}`;

	console.log(`Releasing version ${version}`);

	// Publish packages
	console.log('Running: pnpm publish -r');
	run('pnpm publish -r');

	// Check whether the tag already exists
	let tagExists = false;
	if (!dryRun) {
		try {
			execSync(`git rev-parse -q --verify refs/tags/${tag}`, {
				stdio: 'ignore'
			});
			tagExists = true;
		} catch {
			tagExists = false;
		}
	}

	if (tagExists) {
		console.log(`Tag ${tag} already exists locally; skipping tag creation.`);
	} else {
		console.log(`Creating git tag ${tag}`);
		run(`git tag -a ${tag} -m "${tag}"`);
	}

	console.log(`Pushing tag ${tag} to origin`);
	run(`git push origin ${tag}`);

	console.log('Release script finished.');
} catch (err) {
	console.error('Release failed:');
	console.error(err);
	process.exit(1);
}
