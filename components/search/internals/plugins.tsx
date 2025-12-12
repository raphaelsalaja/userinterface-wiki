"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $isParagraphNode,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
  ParagraphNode,
} from "lexical";
import * as React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SingleLinePlugin
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prevents multi-line input in the Lexical editor.
 * Enter key is suppressed to keep the editor on a single line.
 */
export function SingleLinePlugin(): null {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      () => {
        // Prevent default Enter behavior (new line)
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  // Also prevent paste from adding new lines by merging paragraphs
  React.useEffect(() => {
    return editor.registerNodeTransform(ParagraphNode, () => {
      // Get the root and check if there are multiple paragraphs
      const root = $getRoot();
      const children = root.getChildren();

      if (children.length > 1) {
        // Find the first paragraph
        const firstParagraph = children.find((child) =>
          $isParagraphNode(child),
        );
        if (!firstParagraph || !$isParagraphNode(firstParagraph)) return;

        // Merge all other paragraphs into the first one
        for (let i = 1; i < children.length; i++) {
          const child = children[i];
          if ($isParagraphNode(child) && child !== firstParagraph) {
            const grandchildren = child.getChildren();
            for (const gc of grandchildren) {
              firstParagraph.append(gc);
            }
            child.remove();
          }
        }
      }
    });
  }, [editor]);

  return null;
}
