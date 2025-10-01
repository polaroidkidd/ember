export type Node<T extends object = object> = T & {
	id: string;
	expanded?: boolean;
	[key: string | number]: unknown;
};
export type NodeWithChildren<T extends object = object> = Node<T> & {
	children?: Record<string, NodeWithChildren<T>>;
};
export type Tree<T extends object = object> = Record<string, NodeWithChildren<T>>;

/**
 * Actions that can be performed on a node.
 */

export type NodeActions<N extends object> = {
	/**
	 * Toggles the collapse state of the node.
	 */
	toggle: () => void;
	/**
	 * Inserts a new node as a child of the specified parent node.
	 * @param parentNode
	 * @param newNode
	 */
	insert: (node: Node<N>) => void;
	/**
	 * Deletes the node from the tree.
	 * @param node
	 */
	delete: () => void;
	/**
	 * Updates the node in the tree.
	 * @param node
	 */
	update: (node: NodeWithChildren<N>) => void;
};

export type ItemProps<N extends object> = NodeWithChildren<N> & {
	actions: NodeActions<N>;
};
