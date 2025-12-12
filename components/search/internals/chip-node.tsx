"use client";
import {
  $applyNodeReplacement,
  DecoratorNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import type * as React from "react";

import type { ChipPayload } from "../types";

export type SerializedChipNode = Spread<
  {
    chipType: ChipPayload["type"];
    value: string;
    negated: boolean;
  },
  SerializedLexicalNode
>;

export class ChipNode extends DecoratorNode<React.ReactNode> {
  __chipType: ChipPayload["type"];
  __value: string;
  __negated: boolean;

  static getType(): string {
    return "chip";
  }

  static clone(node: ChipNode): ChipNode {
    return new ChipNode(
      node.__chipType,
      node.__value,
      node.__negated,
      node.__key,
    );
  }

  constructor(
    chipType: ChipPayload["type"],
    value: string,
    negated: boolean,
    key?: NodeKey,
  ) {
    super(key);
    this.__chipType = chipType;
    this.__value = value;
    this.__negated = negated;
  }

  isInline(): boolean {
    return true;
  }

  isIsolated(): boolean {
    return false;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    span.setAttribute("data-lexical-chip", "true");
    span.setAttribute("data-chip-type", this.__chipType);
    span.setAttribute("data-chip-value", this.__value);
    if (this.__negated) {
      span.setAttribute("data-negated", "");
    }
    return span;
  }

  updateDOM(): boolean {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-chip-type", this.__chipType);
    element.setAttribute("data-chip-value", this.__value);
    element.setAttribute("data-chip-negated", String(this.__negated));
    element.textContent = this.getTextContent();
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return null;
  }

  static importJSON(serializedNode: SerializedChipNode): ChipNode {
    return $createChipNode({
      type: serializedNode.chipType,
      value: serializedNode.value,
      negated: serializedNode.negated,
    });
  }

  exportJSON(): SerializedChipNode {
    return {
      type: "chip",
      version: 1,
      chipType: this.__chipType,
      value: this.__value,
      negated: this.__negated,
    };
  }

  getTextContent(): string {
    const prefix = this.__negated ? "-" : "";
    const value = this.__value.includes(" ")
      ? `"${this.__value}"`
      : this.__value;
    return `${prefix}${this.__chipType}:${value}`;
  }

  getChipType(): ChipPayload["type"] {
    return this.__chipType;
  }

  getValue(): string {
    return this.__value;
  }

  isNegated(): boolean {
    return this.__negated;
  }

  decorate(): React.ReactNode {
    return (
      <>
        {this.__negated && <span data-chip-negated-icon="">-</span>}
        <span data-chip-type-label="">{this.__chipType}:</span>
        <span data-chip-value-label="">{this.__value}</span>
      </>
    );
  }
}

export function $createChipNode(payload: ChipPayload): ChipNode {
  return $applyNodeReplacement(
    new ChipNode(payload.type, payload.value, payload.negated),
  );
}

export function $isChipNode(
  node: LexicalNode | null | undefined,
): node is ChipNode {
  return node instanceof ChipNode;
}
