import { forwardRef } from "react";

export type ContextMenuProps = {
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onMarkForRename: () => void;
  onRemoveNode: () => void;
};

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  (props, ref) => {
    const { onCreateFolder, onCreateFile, onMarkForRename, onRemoveNode } =
      props;
    return (
      <div
        ref={ref}
        className="contextmenu"
        style={{
          display: "none",
        }}
      >
        <ul className="contextmenu-options">
          <li>
            <button className="context-menu-item" onClick={onCreateFile}>
              New File
            </button>
          </li>
          <li>
            <button className="context-menu-item" onClick={onCreateFolder}>
              New Folder
            </button>
          </li>
          <li>
            <button className="context-menu-item" onClick={onMarkForRename}>
              Rename
            </button>
          </li>
          <li>
            <button className="context-menu-item" onClick={onRemoveNode}>
              Delete
            </button>
          </li>
        </ul>
      </div>
    );
  }
);
