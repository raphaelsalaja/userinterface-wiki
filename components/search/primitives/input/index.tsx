"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  type EditorState,
  KEY_BACKSPACE_COMMAND,
} from "lexical";
import * as React from "react";

import { $isChipNode, ChipNode } from "../../internals/chip-node";
import { useSearchContext } from "../../internals/context";
import { SingleLinePlugin } from "../../internals/plugins";
import type { ChipPayload } from "../../types";
import type { InputProps, InputState } from "./types";

export type { InputProps, InputState };

// ─────────────────────────────────────────────────────────────────────────────
// Input Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A text input for searching. Uses Lexical for rich chip support.
 * Renders a div containing the Lexical editor.
 *
 * @example
 * ```tsx
 * <Search.Input placeholder="Search articles…" />
 * ```
 */
export function Input({
  placeholder = "Search…",
  className,
  style,
  disabled = false,
  onFocus,
  onBlur,
  onKeyDown,
}: InputProps) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "Search",
        onError: (error) => console.error("Lexical error:", error),
        nodes: [ChipNode],
      }}
    >
      <InputInner
        placeholder={placeholder}
        className={className}
        style={style}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </LexicalComposer>
  );
}

function InputInner({
  placeholder,
  className,
  style,
  disabled,
  onFocus,
  onBlur,
  onKeyDown,
}: InputProps) {
  const [editor] = useLexicalComposerContext();
  const { state, actions, editorRef, inputRef } = useSearchContext();

  const inputState: InputState = {
    open: state.open,
    disabled: disabled ?? false,
    hasContent: state.textContent.trim().length > 0 || state.chips.length > 0,
  };

  const resolvedClassName =
    typeof className === "function" ? className(inputState) : className;
  const resolvedStyle = typeof style === "function" ? style(inputState) : style;

  // Store editor ref in context
  React.useEffect(() => {
    (editorRef as React.MutableRefObject<typeof editor>).current = editor;
  }, [editor, editorRef]);

  // Track editor state changes
  const handleEditorChange = React.useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();

        let text = "";
        const chipList: ChipPayload[] = [];

        const traverse = (
          node:
            | ReturnType<typeof $getRoot>
            | ReturnType<typeof root.getChildren>[number],
        ) => {
          if ($isChipNode(node)) {
            chipList.push({
              type: node.getChipType(),
              value: node.getValue(),
              negated: node.isNegated(),
            });
          } else if ($isTextNode(node)) {
            text += node.getTextContent();
          } else if ("getChildren" in node) {
            for (const child of (
              node as ReturnType<typeof $getRoot>
            ).getChildren()) {
              traverse(child);
            }
          }
        };

        traverse(root);
        actions.setTextContent(text);
        actions.setChips(chipList);
      });
    },
    [actions],
  );

  // Register backspace handler for chips
  React.useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return false;
        }

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        if ($isTextNode(anchorNode) && anchor.offset === 0) {
          const prevSibling = anchorNode.getPreviousSibling();
          if ($isChipNode(prevSibling)) {
            event?.preventDefault();
            const chipText = prevSibling.getTextContent();
            prevSibling.remove();
            const textNode = $createTextNode(chipText);
            anchorNode.insertBefore(textNode);
            textNode.select(chipText.length, chipText.length);
            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  const dataAttributes = {
    ...(state.open && { "data-popup-open": "" }),
    ...(disabled && { "data-disabled": "" }),
    ...(inputState.hasContent && { "data-has-content": "" }),
  };

  return (
    <div
      ref={inputRef as React.RefObject<HTMLDivElement>}
      className={resolvedClassName}
      style={resolvedStyle}
      {...dataAttributes}
    >
      <PlainTextPlugin
        contentEditable={
          <ContentEditable
            onFocus={() => {
              actions.setOpen(true);
              onFocus?.();
            }}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            disabled={disabled}
          />
        }
        placeholder={<div data-placeholder="">{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={handleEditorChange} />
      <HistoryPlugin />
      <SingleLinePlugin />
    </div>
  );
}
