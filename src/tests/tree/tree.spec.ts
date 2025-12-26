import { cloneDeep } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { deleteNode, insertNode, updateNode } from '$lib/tree/tree.utils';
import type { NodeWithChildren, TreeData } from '$lib/types';

describe('tree-utils', () => {
	const mockTree: TreeData = {
		a: {
			id: 'a',
			children: {
				b: {
					id: 'b',
					children: {
						c: { id: 'c' }
					}
				},
				d: { id: 'd' }
			}
		},
		e: { id: 'e' }
	};

	const createTree = (): TreeData => cloneDeep(mockTree);

	it('should remove the root node', () => {
		const tree = createTree();
		deleteNode({ tree: tree, node: tree.e });
		expect(tree.e).toBeUndefined();
		expect(tree.a).toBeDefined();
	});

	it('should remove a nested node', () => {
		const tree = createTree();
		deleteNode({ tree: tree, node: tree.a.children!.b });
		expect(tree.a.children!.b).toBeUndefined();
		expect(tree.a.children!.d).toBeDefined();
	});

	it('should add a node as a child of a given parent', () => {
		const tree = createTree();
		const node: NodeWithChildren = { id: 'x' };
		insertNode({
			tree,
			parent: tree.a.children!.d,
			node
		});
		expect(tree.a.children!.d.children!.x.id).toBe('x');
	});

	it('should update a node', () => {
		const tree = createTree();

		const updated: NodeWithChildren = { id: 'b', foo: 123 };
		updateNode({
			tree,
			node: updated
		});

		expect(tree.a.children!.b.foo).toBe(123);
		expect(tree.a.children!.b.children!.c).toBeDefined();
	});
});
