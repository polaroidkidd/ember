---
'@dle.dev/ember': major
---

# Remove actions from node snippet

Remove CRUD helper actions from being spread onto the node-snippet and supply them via simple imports. Because of the the tree component's children only have access to their own tree and it's children, updating a parent node from a child node is not possible. The only way to handle this in a clean fashion is to provide the CRUD functions directly.
