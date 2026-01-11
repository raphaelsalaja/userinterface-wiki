import type { MDXComponents } from "mdx/types";
import { Callout } from "./components/callout";
import { Caption, Figure } from "./components/figure";
import { Video } from "./components/video";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => <h1 data-prose-type="heading" {...props} />,
    h2: (props) =>
      props.id === "footnote-label" ? (
        <hr />
      ) : (
        <h2 data-prose-type="heading" {...props} />
      ),
    h3: (props) => <h3 data-prose-type="heading" {...props} />,
    h4: (props) => <h4 data-prose-type="heading" {...props} />,
    h5: (props) => <h5 data-prose-type="heading" {...props} />,
    h6: (props) => <h6 data-prose-type="heading" {...props} />,
    p: (props) => <p data-prose-type="text" {...props} />,
    li: (props) => <li data-prose-type="text" {...props} />,
    ul: (props) => <ul data-prose-type="list" {...props} />,
    ol: (props) => <ol data-prose-type="list" {...props} />,
    Figure,
    Caption,
    Callout,
    Video,
  };
}

export const useMDXComponents = getMDXComponents;
