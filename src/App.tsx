import React, { useRef, useState, useEffect } from "react";
import { Tree } from "./Tree";
import { TreeNodeReference, FlatTreeNode } from "./TreeNode";
import { ContextMenu } from "./ContextMenu";
import { ChevronIcon } from "./ChevronIcon";
import "./styles.css";

type TreeNodeState = FlatTreeNode & {
  mode: "read" | "write";
  isError?: boolean;
  isCollapse?: boolean;
};

type TreeState = Record<string, TreeNodeState>;

const tree = new Tree();
const root = tree.insert("My Storage", null, "dir");
tree.insert("Document", root, "dir");
tree.insert("Archive", root, "dir");

function getModifiedTreeData() {
  const state: TreeState = {};
  const treeData = tree.getFlat();

  for (let property in treeData) {
    state[property] = {
      ...treeData[property],
      mode: "read",
      isError: false
    };
  }

  return state;
}

const initialTree = getModifiedTreeData();

export default function App() {
  const [treeNodes, setTreeNodes] = useState(initialTree);
  const [activeTreeNode, setActiveTreeNode] = useState("");
  const [filenameInput, setFilenameInput] = useState("");
  const refContextMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (refContextMenu && refContextMenu.current) {
        refContextMenu.current.style.display = "none";
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function createTreeNode(type: "dir" | "file") {
    const selectedNode = tree.getNodeById(activeTreeNode);
    const newTreeNode = tree.insert("", selectedNode, type);
    const treeData = tree.getFlat();
    const newTreeNodes: TreeState = {};

    for (let property in treeData) {
      newTreeNodes[property] = {
        ...treeData[property],
        mode: property === newTreeNode.id ? "write" : "read",
        isError: false
      };
    }

    setTreeNodes(newTreeNodes);
    setActiveTreeNode(newTreeNode.id);
  }

  function createFolderNode() {
    createTreeNode("dir");
  }

  function createFileNode() {
    createTreeNode("file");
  }

  function removeTreeNode() {
    tree.remove(activeTreeNode);
    setTreeNodes(getModifiedTreeData());
  }

  function updateTreeNodeModeToWrite() {
    const treeData = tree.getFlat();
    setFilenameInput(treeData[activeTreeNode].name);
    setTreeNodes((prevTreeNodes) => ({
      ...prevTreeNodes,
      [activeTreeNode]: {
        ...prevTreeNodes[activeTreeNode],
        mode: "write"
      }
    }));
  }

  function handleUpdateFilenameInput(e: React.ChangeEvent<HTMLInputElement>) {
    setFilenameInput(e.target.value);
  }

  function handleRenameTreeNode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      tree.rename(activeTreeNode, filenameInput);
      setTreeNodes(getModifiedTreeData());
    } catch (err) {
      setTreeNodes((prevTreeNodes) => ({
        ...prevTreeNodes,
        [activeTreeNode]: {
          ...prevTreeNodes[activeTreeNode],
          isError: true
        }
      }));
    }
    setFilenameInput("");
  }

  function handleTreeNodeContextMenu(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    treeNodeId: string
  ) {
    e.preventDefault();
    setActiveTreeNode(treeNodeId);

    if (refContextMenu.current) {
      refContextMenu.current.style.display = "block";
      refContextMenu.current.style.top = e.clientY.toString() + "px";
      refContextMenu.current.style.left = e.clientX.toString() + "px";
    }
  }

  function handleSelectTreeNode(treeNodeId: string) {
    setTreeNodes((prevTreeNodes) => ({
      ...prevTreeNodes,
      [treeNodeId]: {
        ...prevTreeNodes[treeNodeId],
        isCollapse: !prevTreeNodes[treeNodeId].isCollapse
      }
    }));
  }

  function renderTreeNodeAsWritable(treeNode: TreeNodeState) {
    return (
      <form onSubmit={handleRenameTreeNode}>
        <input
          value={filenameInput}
          onChange={handleUpdateFilenameInput}
          className={`tree-node-filename-input ${
            treeNode.isError ? "error" : null
          }`}
          required
        />
      </form>
    );
  }
  function renderTreeNodeAsReadonly(treeNode: TreeNodeState) {
    return (
      <button
        className="tree-node-selectable"
        onContextMenu={(e) => handleTreeNodeContextMenu(e, treeNode.id)}
        onClick={() => handleSelectTreeNode(treeNode.id)}
      >
        {treeNode.type === "dir" ? (
          <span
            className={`tree-node-icon ${
              treeNode.isCollapse ? "collapse" : null
            }`}
          >
            <ChevronIcon />
          </span>
        ) : null}

        <span>{treeNode.name}</span>
      </button>
    );
  }

  function renderNodeItem(treeNode: TreeNodeState) {
    return treeNode.mode === "write"
      ? renderTreeNodeAsWritable(treeNode)
      : renderTreeNodeAsReadonly(treeNode);
  }

  function renderChildNodes(childNodes: TreeNodeReference[]) {
    return (
      <ul>
        {childNodes
          .map((childNode) => treeNodes[childNode.id])
          .map((childNode) =>
            childNode ? (
              <li key={childNode.id}>
                {renderNodeItem(childNode)}
                {childNode.isCollapse
                  ? null
                  : renderChildNodes(childNode.children)}
              </li>
            ) : null
          )}
      </ul>
    );
  }

  function renderTree() {
    const rootNode = treeNodes["tree-node-1"];
    if (!rootNode) {
      return <div>Tree is empty</div>;
    }

    return (
      <ul>
        <li>{renderNodeItem(rootNode)}</li>
        {rootNode.isCollapse ? null : renderChildNodes(rootNode.children)}
      </ul>
    );
  }

  return (
    <div>
      <div>{renderTree()}</div>
      <ContextMenu
        ref={refContextMenu}
        onCreateFile={createFileNode}
        onCreateFolder={createFolderNode}
        onMarkForRename={updateTreeNodeModeToWrite}
        onRemoveNode={removeTreeNode}
      />
    </div>
  );
}
