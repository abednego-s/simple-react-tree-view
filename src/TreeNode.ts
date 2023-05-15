export type TreeNodeReference = Omit<TreeNode, "children" | "parent">;
export type TreeNodeKind = "dir" | "file";

export class TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
  type: TreeNodeKind;

  constructor(id: string, name: string, type: TreeNodeKind) {
    this.id = id;
    this.name = name;
    this.children = [];
    this.type = type;
  }
}

export class FlatTreeNode {
  id: string;
  name: string;
  parent: TreeNodeReference | null;
  children: TreeNodeReference[];
  type: TreeNodeKind;

  constructor(
    id: string,
    name: string,
    parent: TreeNodeReference | null = null,
    type: TreeNodeKind
  ) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.children = [];
    this.type = type;
  }
}
