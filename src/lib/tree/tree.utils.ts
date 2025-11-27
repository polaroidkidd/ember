/**
 * Finds the path to the current id in a generic tree
 */

import type { NodeWithChildren, TreeData } from '../types';

/**
 * Find path from root to node with given id.
 * Non-mutating: does not modify `tree` or the provided `path`.
 * Returns an array of ids from root -> ... -> id or [] when not found.
 */
export function getPathToNodeById<T extends object = object>({
	id,
	tree
}: {
	id: string;
	tree: TreeData<T>;
}): string[] {
	if (!id) return [];

	// Iterative DFS using an explicit stack to avoid recursion for deep trees.
	// Each stack entry: [nodeMap, iteratorKeys[], currentIndex, pathSoFar]
	const stack: Array<{
		map: Record<string, NodeWithChildren<T>>;
		keys: string[];
		idx: number;
		path: string[];
	}> = [];

	const rootKeys = Object.keys(tree);
	stack.push({ map: tree, keys: rootKeys, idx: 0, path: [] });

	while (stack.length) {
		const top = stack[stack.length - 1];
		if (top.idx >= top.keys.length) {
			stack.pop();
			continue;
		}

		const key = top.keys[top.idx++];
		const node = top.map[key];
		const currentPath = [...top.path, node.id];

		if (node.id === id) return currentPath;

		if (node.children && Object.keys(node.children).length > 0) {
			stack.push({
				map: node.children,
				keys: Object.keys(node.children),
				idx: 0,
				path: currentPath
			});
		}
	}

	return [];
}

export function getNodeByPath<T extends object = object>({
	path,
	tree
}: {
	path: string[];
	tree: TreeData<T>;
}): NodeWithChildren<T> {
	// Keep the original non-optional return type. If the path is invalid
	// return a reasonable fallback (first root node) to preserve previous API.
	if (!path || path.length === 0)
		return Object.values(tree)[0] as NodeWithChildren<T>;
	let node = tree[path[0]];
	if (!node) return Object.values(tree)[0] as NodeWithChildren<T>;

	for (let i = 1; i < path.length; i++) {
		if (!node.children) return Object.values(tree)[0] as NodeWithChildren<T>;
		node = node.children[path[i]];
		if (!node) return Object.values(tree)[0] as NodeWithChildren<T>;
	}
	return node;
}

export function getChildrenOfNodesByNodeIds<T extends object = object>({
	node,
	ids
}: {
	node: NodeWithChildren<T>;
	ids: string[];
}): string[] {
	// Iterative traversal (stack) to avoid recursion and reduce allocations from repeatedly
	// building Object.values arrays in very large trees.
	const stack: NodeWithChildren<T>[] = [node];

	while (stack.length) {
		const n = stack.pop()!;
		ids.push(n.id);
		if (n.children) {
			// push children keys to stack without creating an intermediate array of values
			for (const k in n.children) {
				if (Object.prototype.hasOwnProperty.call(n.children, k)) {
					stack.push(n.children[k]);
				}
			}
		}
	}

	return ids;
}

export function deleteNodeByPath<T extends object = object>({
	tree,
	path
}: {
	path: string[];
	tree: TreeData<T>;
}): TreeData<T> {
	if (!path || path.length === 0) return { ...tree };

	// Helper recursive function that clones along the path and removes the target.
	const removeAt = (
		map: Record<string, NodeWithChildren<T>>,
		depth: number
	): Record<string, NodeWithChildren<T>> => {
		const key = path[depth];
		if (!map[key]) return map; // nothing to delete

		const cloned = { ...map };

		if (depth === path.length - 1) {
			// delete the target node
			delete cloned[key];
			return cloned;
		}

		const child = cloned[key];
		const childChildren = child.children ?? {};
		const newChildren = removeAt(childChildren, depth + 1);
		// if children didn't change, return original map to avoid unnecessary allocations
		if (newChildren === childChildren) return map;

		cloned[key] = { ...child, children: newChildren };
		return cloned;
	};

	return removeAt(tree, 0);
}

export function insertNode<T extends object = object>({
	node,
	tree,
	parent
}: {
	node: NodeWithChildren<T>;
	parent: NodeWithChildren<T>;
	tree: TreeData<T>;
}): TreeData<T> {
	const path = getPathToNodeById({ id: parent.id, tree });
	return insertNodeByPath({ tree, path, node });
}

export function insertNodeByPath<T extends object = object>({
	tree,
	path,
	node
}: {
	node: NodeWithChildren<T>;
	path: string[];
	tree: TreeData<T>;
}): TreeData<T> {
	if (!path || path.length === 0) {
		// insert at root
		return { ...tree, [node.id]: node };
	}

	// recursive helper that clones along the way
	const insertAt = (
		map: Record<string, NodeWithChildren<T>>,
		depth: number
	): Record<string, NodeWithChildren<T>> => {
		const key = path[depth];
		// if required key doesn't exist at this level and we're not at root of insertion,
		// create an empty node so we can continue. This mirrors previous behavior but
		// avoids throwing.
		const nodeAtKey = map[key];
		const cloned = { ...map };

		if (depth === path.length - 1) {
			// insert into this node's children
			const existing = nodeAtKey ?? ({ id: key } as NodeWithChildren<T>);
			const children = { ...existing.children };
			children[node.id] = node;
			cloned[key] = { ...existing, children };
			return cloned;
		}

		// need to descend
		const nextMap = nodeAtKey?.children ?? {};
		const newChildren = insertAt(nextMap, depth + 1);

		cloned[key] = {
			...(nodeAtKey ?? ({ id: key } as NodeWithChildren<T>)),
			children: newChildren
		};
		return cloned;
	};

	return insertAt(tree, 0);
}

export function updateNodeByPath<T extends object = object>({
	tree,
	update,
	path
}: {
	tree: TreeData<T>;
	update: NodeWithChildren<T>;
	path: string[];
}): TreeData<T> {
	if (!path || path.length === 0) return { ...tree };

	const updateAt = (
		map: Record<string, NodeWithChildren<T>>,
		depth: number
	): Record<string, NodeWithChildren<T>> => {
		const key = path[depth];
		if (!map[key]) return map; // nothing to update at this branch

		const cloned = { ...map };

		if (depth === path.length - 1) {
			cloned[key] = update;
			return cloned;
		}

		const child = cloned[key];
		const childChildren = child.children ?? {};
		const newChildren = updateAt(childChildren, depth + 1);
		if (newChildren === childChildren) return map;

		cloned[key] = { ...child, children: newChildren };
		return cloned;
	};

	return updateAt(tree, 0);
}

export function updateNode<T extends object = object>({
	node,
	tree
}: {
	tree: TreeData<T>;
	node: NodeWithChildren<T>;
}): TreeData<T> {
	const path = getPathToNodeById({ id: node.id, tree });
	if (!path || path.length === 0) return tree;
	return updateNodeByPath({ tree, update: node, path });
}

export function deleteNode<T extends object = object>({
	node,
	tree
}: {
	tree: TreeData<T>;
	node: NodeWithChildren<T>;
}): TreeData<T> {
	const path = getPathToNodeById({ tree, id: node.id });
	if (!path || path.length === 0) return tree;
	return deleteNodeByPath({ tree, path });
}
