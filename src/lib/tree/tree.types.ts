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
	 * if a node is expanded in the node snippet
	 */
	expanded?: boolean;
	children?: Record<string, Node<T>>;
	/*
	 * Any other properties you want to add to the node
	 */
	[key: string | number]: unknown;
};

/**
 * The complete accordion tree. This is a record of nodes with children
 */
export type Tree<T extends object = object> = Record<string, Node<T>>;
