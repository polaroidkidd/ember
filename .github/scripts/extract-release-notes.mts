import { execSync } from 'child_process';
import { promises as fs } from 'fs';

function escapeRegExp(s: string) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main() {
	const tag = process.argv[2] || process.env.GITHUB_REF_NAME || '';
	const version = tag.startsWith('v') ? tag.slice(1) : tag;

	let body = '';

	try {
		const changelog = await fs.readFile('CHANGELOG.md', 'utf8');

		if (version) {
			const verRe = new RegExp(
				'^##\\s*v?' + escapeRegExp(version) + '(?:$|[\\s-])',
				'm'
			);
			const match = changelog.match(verRe);
			if (match && match.index !== undefined) {
				// find start index at the beginning of the matched line
				const start = changelog.lastIndexOf('\n', match.index) + 1;
				// find next '## ' heading after start
				const after = changelog.slice(start + match[0].length);
				const nextHeading = after.search(/^##\s+/m);
				let section: string;
				if (nextHeading === -1) {
					section = changelog.slice(start);
				} else {
					section = changelog.slice(
						start,
						start + match[0].length + nextHeading
					);
				}

				// trim leading/trailing blank lines
				section = section.replace(/^\s+/, '').replace(/\s+$/, '');

				if (section.trim().length > 0) {
					body = section;
				}
			}
		}
	} catch (err) {
		console.error('Error reading CHANGELOG.md:', err);
		// ignore and fallback below
	}

	if (!body) {
		// fallback to last commit message
		try {
			body = execSync('git log -1 --pretty=format:"%h - %s%n%n%b"', {
				encoding: 'utf8'
			}).toString();
		} catch (err) {
			body = `No changelog entry found for ${version} and unable to read git commit message.`;
			console.error('Error getting git commit message:', err);
		}
	}

	const header = `Automated release for tag ${tag} (workflow: ${process.env.GITHUB_WORKFLOW || ''})\n\n`;
	process.stdout.write(header + body + '\n');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
