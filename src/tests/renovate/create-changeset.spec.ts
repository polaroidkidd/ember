import { mkdtempSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { describe, expect, test } from 'vitest';

describe('renovate changeset script', () => {
	test('writes a patch changeset for a Renovate branch', async () => {
		const workspace = mkdtempSync(join(tmpdir(), 'ember-renovate-'));
		const dataFile = join(workspace, 'renovate-data.json');
		const scriptUrl = pathToFileURL(
			resolve('scripts/renovate/create-changeset.mjs')
		).href;

		writeFileSync(
			dataFile,
			JSON.stringify({
				branchName: 'renovate/globals-17.x',
				title: 'Maintenance: Update dependency globals to v17',
				upgrades: [
					{
						depName: 'globals',
						depType: 'devDependencies',
						newVersion: '17.6.0',
						updateType: 'major'
					}
				]
			})
		);

		const { createChangeset } = await import(scriptUrl);

		createChangeset({
			dataFile,
			workspace
		});

		const changeset = readFileSync(
			join(workspace, '.changeset', 'renovate-globals-17-x.md'),
			'utf8'
		);

		expect(changeset).toBe(`---
"@dle.dev/ember": patch
---

Maintenance: Update dependency globals to v17
`);
	});
});
