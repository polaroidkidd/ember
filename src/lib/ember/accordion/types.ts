/**
 * A node in the tree. Can have any extra properties
 */
export type Node<T extends object = object> = T & {
	/*
	 * A unique identifier for the node. This is
	 * required to perform actions on the tree. If it
	 * is not unique, actions will not work as expected.
	 * Most implementations use arrays here and loop over everything
	 * to find the right node, but this implementation
	 * uses a record for O(1) access.
	 */
	id: string;
	/*
	 * This property gets tacked on to the tree
	 * which is passed in and lets you determine
	 * if a node is expanded in the item snippet
	 */
	expanded?: boolean;
	/*
	 * Any other properties you want to add to the node
	 */
	[key: string | number]: unknown;
};

/**
 * A node which can have children
 */
export type NodeWithChildren<T extends object = object> = Node<T> & {
	children?: Record<string, NodeWithChildren<T>>;
};

/**
 * The complete accordion tree. This is a record of nodes with children
 */
export type Tree<T extends object = object> = Record<
	string,
	NodeWithChildren<T>
>;

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
