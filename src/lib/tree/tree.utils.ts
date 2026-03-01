import type { Node, TreeData } from './tree.types';

export function insertNode<T extends object = object>({
	node,
	tree,
	parent
}: {
	node: Node<T>;
	parent: Node<T>;
	tree: TreeData<T>;
}) {
	const stack: {
		map: Record<string, Node<T>>;
		keys: string[];
		idx: number;
	}[] = [];
	const rootKeys = Object.keys(tree);
	// Push root keys onto stack
	stack.push({ map: tree, keys: rootKeys, idx: 0 });

	while (stack.length) {
		// Get the top of the stack
		const top = stack[stack.length - 1];
		// If we've processed all keys at this level, pop the stack
		if (top.idx >= top.keys.length) {
			stack.pop();
			continue;
		}
		// Get the next key and node
		const key = top.keys[top.idx++];

		// If this is the target node, perform the operation
		if (key === parent.id) {
			top.map[key].children = {
				...top.map[key].children,
				[node.id]: node
			};
			return;
		}
		// If the node has children, push them onto the stack for further processing
		if (
			top.map[key].children &&
			Object.keys(top.map[key].children).length > 0
		) {
			stack.push({
				map: top.map[key].children,
				keys: Object.keys(top.map[key].children),
				idx: 0
			});
		}
	}
}

export function deleteNode<T extends object = object>({
	node,
	tree
}: {
	tree: TreeData<T>;
	node: Node<T>;
}) {
	const stack: {
		map: Record<string, Node<T>>;
		keys: string[];
		idx: number;
	}[] = [];
	const rootKeys = Object.keys(tree);
	// Push root keys onto stack
	stack.push({ map: tree, keys: rootKeys, idx: 0 });

	while (stack.length) {
		// Get the top of the stack
		const top = stack[stack.length - 1];
		// If we've processed all keys at this level, pop the stack
		if (top.idx >= top.keys.length) {
			stack.pop();
			continue;
		}
		// Get the next key and node
		const key = top.keys[top.idx++];

		// If this is the target node, perform the operation
		if (key === node.id) {
			delete top.map[key];
			return;
		}
		// If the node has children, push them onto the stack for further processing
		if (
			top.map[key].children &&
			Object.keys(top.map[key].children).length > 0
		) {
			stack.push({
				map: top.map[key].children,
				keys: Object.keys(top.map[key].children),
				idx: 0
			});
		}
	}
}

export function updateNode<T extends object = object>({
	node,
	tree
}: {
	node: Node<T>;
	tree: TreeData<T>;
}) {
	const stack: {
		map: Record<string, Node<T>>;
		keys: string[];
		idx: number;
	}[] = [];
	const rootKeys = Object.keys(tree);
	// Push root keys onto stack
	stack.push({ map: tree, keys: rootKeys, idx: 0 });

	while (stack.length) {
		// Get the top of the stack
		const top = stack[stack.length - 1];
		// If we've processed all keys at this level, pop the stack
		if (top.idx >= top.keys.length) {
			stack.pop();
			continue;
		}
		// Get the next key and node
		const key = top.keys[top.idx++];

		// If this is the target node, perform the operation
		if (key === node.id) {
			const current = top.map[key];
			// Merge updates onto the existing node so callers can pass partial updates
			// (eg. selection state) without blowing away children/expanded state.
			top.map[key] = {
				...current,
				...node,
				children: Object.hasOwn(node, 'children')
					? node.children
					: current.children
			};

			return;
		}
		// If the node has children, push them onto the stack for further processing
		if (
			top.map[key].children &&
			Object.keys(top.map[key].children).length > 0
		) {
			stack.push({
				map: top.map[key].children,
				keys: Object.keys(top.map[key].children),
				idx: 0
			});
		}
	}
}
