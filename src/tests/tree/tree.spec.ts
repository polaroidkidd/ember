import { describe, expect, it } from 'vitest';

import {
	deleteNode,
	deleteNodeByPath,
	getChildrenOfNodesByNodeIds,
	getNodeByPath,
	getPathToNodeById,
	insertNode,
	insertNodeByPath,
	updateNode,
	updateNodeByPath
} from '$lib/tree';
import type { NodeWithChildren, TreeData } from '$lib/types';

describe('tree-utils', () => {
	const tree: TreeData = {
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

	const createTree = (): TreeData => JSON.parse(JSON.stringify(tree));

	it('getPathToNodeById finds correct path', () => {
		const path = getPathToNodeById({ id: 'c', tree });
		expect(path).toEqual(['a', 'b', 'c']);
	});

	it('getPathToNodeById returns direct path', () => {
		const path = getPathToNodeById({ id: 'e', tree });
		expect(path).toEqual(['e']);
	});

	it('getNodeByPath returns correct node', () => {
		const path = ['a', 'b', 'c'];
		const node = getNodeByPath({ path, tree });
		expect(node.id).toBe('c');
	});

	it('getChildrenOfNodesByNodeIds returns all descendant ids', () => {
		const ids: string[] = [];
		const result = getChildrenOfNodesByNodeIds({ node: tree.a, ids });
		expect(result.sort()).toEqual(['a', 'b', 'c', 'd'].sort());
	});

	it('removeNode deletes root node', () => {
		const treeCopy = createTree();
		const newTree = deleteNodeByPath({ tree: treeCopy, path: ['e'] });
		expect(newTree.e).toBeUndefined();
		expect(newTree.a).toBeDefined();
	});

	it('removeNode deletes nested node', () => {
		const treeCopy = createTree();
		const newTree = deleteNodeByPath({ tree: treeCopy, path: ['a', 'b'] });
		expect(newTree.a.children!.b).toBeUndefined();
		expect(newTree.a.children!.d).toBeDefined();
	});

	it('insertNode adds node at path', () => {
		const treeCopy = createTree();
		const node: NodeWithChildren = { id: 'x' };
		const newTree = insertNodeByPath({
			tree: treeCopy,
			path: ['a', 'd'],
			node
		});
		expect(newTree.a.children!.d.children!.x.id).toBe('x');
	});

	it('updateNode updates node at path', () => {
		const treeCopy = createTree();
		const updated: NodeWithChildren = { id: 'b', foo: 123 };
		const newTree = updateNodeByPath({
			tree: treeCopy,
			path: ['a', 'b'],
			update: updated
		});
		expect(newTree.a.children!.b.foo).toBe(123);
	});

	it('insertNode attaches node using parent reference', () => {
		const treeCopy = createTree();
		const node: NodeWithChildren = { id: 'x', label: 'child of d' };
		const parent = treeCopy.a.children!.d;
		const newTree = insertNode({ tree: treeCopy, parent, node });
		expect(newTree.a.children!.d.children!.x).toMatchObject({
			id: 'x',
			label: 'child of d'
		});
	});

	it('updateNode updates node using direct reference', () => {
		const treeCopy = createTree();
		const updated: NodeWithChildren = { id: 'd', meta: 'updated' };
		const newTree = updateNode({ tree: treeCopy, node: updated });
		expect(newTree.a.children!.d.meta).toBe('updated');
	});

	it('deleteNode removes node using direct reference', () => {
		const treeCopy = createTree();
		const nodeToDelete = treeCopy.a.children!.b;
		const newTree = deleteNode({ tree: treeCopy, node: nodeToDelete });
		expect(newTree.a.children!.b).toBeUndefined();
		expect(newTree.a.children!.d).toBeDefined();
	});
});
