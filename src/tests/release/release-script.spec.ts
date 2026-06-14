import { execFileSync } from 'child_process';
import { describe, expect, test } from 'vitest';

describe('release script', () => {
	test('emits the Changesets tag signal after publish', () => {
		const output = execFileSync(
			'node',
			['./.github/scripts/release.mts', '--dry-run'],
			{
				encoding: 'utf8',
				env: { ...process.env, DRY_RUN: '1' }
			}
		);

		expect(output).toContain('New tag: v3.2.4');
	});
});
