import type { MDXComponents } from "mdx/types";
import {
  Anticipation,
  Appeal,
  Arcs,
  DecisionFlow,
  Exaggeration,
  FollowThroughAndOverlappingAction,
  SecondaryAction,
  SlowInSlowOut,
  SolidDrawing,
  SquashStretch,
  Staging,
  StraightAheadActionAndPoseToPose,
  Timing,
} from "./components/documents";
import { Caption, Figure } from "./components/figure";

const Principles: MDXComponents = {
  SquashStretch,
  Anticipation,
  Staging,
  StraightAheadActionAndPoseToPose,
  FollowThroughAndOverlappingAction,
  SlowInSlowOut,
  Arcs,
  SecondaryAction,
  Timing,
  Exaggeration,
  SolidDrawing,
  Appeal,
};

const EaseVsSpringsComponents: MDXComponents = {
  DecisionFlow,
};

const BaseComponents: MDXComponents = {
  Figure,
  Caption,
};

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
    ...Principles,
    ...EaseVsSpringsComponents,
    ...BaseComponents,
  };
}

export const useMDXComponents = getMDXComponents;
