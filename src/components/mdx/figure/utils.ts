import { toPng } from "html-to-image";

const TOOLBAR_SELECTOR = '[data-figure-toolbar="true"]';

export async function getRenderablePngBlob(root: HTMLElement): Promise<Blob> {
  const target = root.firstElementChild as HTMLElement | null;
  if (!target) throw new Error("No renderable content found.");

  const computed = window.getComputedStyle(target);
  const backgroundColor = computed.backgroundColor;
  const width = `${target.scrollWidth}px`;
  const height = `${target.scrollHeight}px`;

  const clone = target.cloneNode(true) as HTMLElement;
  const style = clone.style as CSSStyleDeclaration & {
    scrollbarWidth?: string;
    msOverflowStyle?: string;
  };

  style.setProperty("backgroundColor", backgroundColor);
  style.setProperty("border", "0");
  style.setProperty("borderRadius", "0");
  style.setProperty("borderColor", "transparent");
  style.setProperty("borderStyle", "none");
  style.setProperty("borderWidth", "0");
  style.setProperty("boxShadow", "none");
  style.setProperty("padding", "0");
  style.setProperty("margin", "0");
  style.setProperty("overflow", "visible");
  style.setProperty("outline", "none");
  style.setProperty("width", width);
  style.setProperty("height", height);
  if (style.setProperty) {
    style.setProperty("scrollbarWidth", "none");
    style.setProperty("msOverflowStyle", "none");
  }

  const sandbox = document.createElement("div");
  sandbox.style.position = "fixed";
  sandbox.style.left = "-10000px";
  sandbox.style.top = "0";
  sandbox.style.zIndex = "-1";
  sandbox.style.opacity = "0";
  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  try {
    const dataUrl = await toPng(clone, {
      cacheBust: true,
      pixelRatio: window.devicePixelRatio || 1,
      filter: (node) => {
        if (!(node instanceof HTMLElement)) return true;
        return !node.closest(TOOLBAR_SELECTOR);
      },
    });

    const response = await fetch(dataUrl);
    return await response.blob();
  } finally {
    sandbox.remove();
  }
}
