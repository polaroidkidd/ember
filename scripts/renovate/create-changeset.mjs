import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const packageName = '@dle.dev/ember';

function slugifyBranch(branchName) {
	return branchName
		.replace(/^renovate\//, '')
		.replace(/[^a-z0-9]+/gi, '-')
		.toLowerCase()
		.replace(/^-|-$/g, '');
}

export function createChangeset({ dataFile, workspace = process.cwd() }) {
	if (!dataFile) {
		throw new Error('Missing RENOVATE_POST_UPGRADE_COMMAND_DATA_FILE');
	}

	const data = JSON.parse(readFileSync(dataFile, 'utf8'));
	const slug = slugifyBranch(data.branchName ?? 'dependency-update');
	const title = data.title ?? 'Maintenance: Update dependencies';
	const changesetDirectory = join(workspace, '.changeset');
	const changesetPath = join(changesetDirectory, `renovate-${slug}.md`);

	mkdirSync(changesetDirectory, { recursive: true });
	writeFileSync(
		changesetPath,
		`---
"${packageName}": patch
---

${title}
`
	);
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	createChangeset({
		dataFile: process.env.RENOVATE_POST_UPGRADE_COMMAND_DATA_FILE
	});
}
