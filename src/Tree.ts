import { TreeNode, FlatTreeNode, TreeNodeKind } from "./TreeNode";

export type FlatTree = Record<string, FlatTreeNode>;

export class Tree {
  root: TreeNode | null;
  flat: FlatTree;
  counter: number;

  constructor() {
    this.flat = {};
    this.counter = 0;
    this.root = null;
  }

  private searchChildNode(
    treeNode: TreeNode,
    treeNodeId: string
  ): TreeNode | null {
    if (treeNode.id === treeNodeId) {
      return treeNode;
    }

    if (treeNode.children) {
      for (const child of treeNode.children) {
        const foundTreeNode = this.searchChildNode(child, treeNodeId);
        if (foundTreeNode) {
          return foundTreeNode;
        }
      }
    }
    return null;
  }

  private createNewId() {
    this.counter += 1;
    return `tree-node-${this.counter}`;
  }

  private removeChildNode(treeNode: TreeNode, treeNodeId: string) {
    for (const child of treeNode.children) {
      if (child.id === treeNodeId) {
        treeNode.children = treeNode.children.filter(
          (childNode) => childNode.id !== treeNodeId
        );
        return true;
      }
      if (this.removeChildNode(child, treeNodeId)) {
        return true;
      }
    }
    return false;
  }

  private treeNodeToFlat(treeNode: TreeNode, parentNode?: TreeNode | null) {
    const modifiedChildren = [];

    this.flat[treeNode.id] = {
      ...treeNode,
      parent: parentNode
        ? { id: parentNode.id, name: parentNode.name, type: parentNode.type }
        : null
    };

    for (const child of treeNode.children) {
      modifiedChildren.push({
        id: child.id,
        name: child.name,
        type: child.type
      });

      this.treeNodeToFlat(child, treeNode);
    }

    this.flat[treeNode.id].children = modifiedChildren;
  }

  flattenedRoot() {
    if (this.root) {
      this.flat = {};
      this.treeNodeToFlat(this.root);
    }
  }

  insert(name: string, parent: TreeNode | null = null, type: TreeNodeKind) {
    const treeNodeId = this.createNewId();
    const newTreeNode = new TreeNode(treeNodeId, name, type);
    if (!this.root) {
      this.root = newTreeNode;
    } else {
      const parentNode = parent || this.root;
      parentNode.children.push(newTreeNode);
    }

    this.flattenedRoot();
    return newTreeNode;
  }

  remove(treeNodeId: string) {
    if (this.root) {
      if (this.root.id === treeNodeId) {
        this.root = null;
        this.flat = {};
      } else {
        if (this.removeChildNode(this.root, treeNodeId)) {
          this.flattenedRoot();
        }
      }
    }
  }

  rename(treeNodeId: string, name: string) {
    if (!name) {
      throw new Error("Name cannot be empty");
    }

    const treeNode = this.getNodeById(treeNodeId);
    const parent = this.flat[treeNodeId].parent;

    if (parent) {
      const parentNode = this.flat[parent.id];
      const parentNodeChildren = parentNode.children;
      const sameNameExists = parentNodeChildren.some(
        (parentNodeChild) => parentNodeChild.name === name
      );

      if (sameNameExists) {
        throw new Error(
          `'${name}' is already exists inside '${parentNode.name}' folder`
        );
      }
    }

    if (treeNode) {
      treeNode.name = name;
    }

    this.flattenedRoot();
  }

  getFlat() {
    return this.flat;
  }

  getRoot() {
    return this.root;
  }

  getNodeById(treeNodeId: string) {
    if (!this.root) {
      return null;
    }
    return this.searchChildNode(this.root, treeNodeId);
  }

  getFlatNodeById(treeNodeId: string) {
    return this.flat[treeNodeId];
  }
}
