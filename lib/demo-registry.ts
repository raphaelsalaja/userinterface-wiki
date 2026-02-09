// Auto-generated. Run `pnpm generate demos` to regenerate.

import type { ComponentType } from "react";
import dynamic from "next/dynamic";

export const demoRegistry: Record<string, ComponentType> = {
  "12-principles-of-animation/1-squash-and-stretch": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/1-squash-and-stretch").then((m) => m.SquashStretch),
  ),
  "12-principles-of-animation/10-exaggeration": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/10-exaggeration").then((m) => m.Exaggeration),
  ),
  "12-principles-of-animation/11-solid-drawing": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/11-solid-drawing").then((m) => m.SolidDrawing),
  ),
  "12-principles-of-animation/12-appeal": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/12-appeal").then((m) => m.Appeal),
  ),
  "12-principles-of-animation/2-anticipation": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/2-anticipation").then((m) => m.Anticipation),
  ),
  "12-principles-of-animation/3-staging": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/3-staging").then((m) => m.Staging),
  ),
  "12-principles-of-animation/4-straight-ahead-action-and-pose-to-pose": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/4-straight-ahead-action-and-pose-to-pose").then((m) => m.StraightAheadActionAndPoseToPose),
  ),
  "12-principles-of-animation/5-follow-through-and-overlapping-action": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/5-follow-through-and-overlapping-action").then((m) => m.FollowThroughAndOverlappingAction),
  ),
  "12-principles-of-animation/6-slow-in-and-slow-out": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/6-slow-in-and-slow-out").then((m) => m.SlowInSlowOut),
  ),
  "12-principles-of-animation/7-arcs": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/7-arcs").then((m) => m.Arcs),
  ),
  "12-principles-of-animation/8-secondary-action": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/8-secondary-action").then((m) => m.SecondaryAction),
  ),
  "12-principles-of-animation/9-timing": dynamic(() =>
    import("@/content/12-principles-of-animation/demos/9-timing").then((m) => m.Timing),
  ),
  "animating-bounds/00-comparison": dynamic(() =>
    import("@/content/animating-bounds/demos/00-comparison").then((m) => m.Comparison),
  ),
  "animating-bounds/01-animated-width": dynamic(() =>
    import("@/content/animating-bounds/demos/01-animated-width").then((m) => m.AnimatedWidth),
  ),
  "animating-bounds/02-animated-height": dynamic(() =>
    import("@/content/animating-bounds/demos/02-animated-height").then((m) => m.AnimatedHeight),
  ),
  "generating-sounds-with-ai/audio-concepts-demo": dynamic(() =>
    import("@/content/generating-sounds-with-ai/demos/audio-concepts-demo").then((m) => m.AudioConceptsDemo),
  ),
  "generating-sounds-with-ai/sound-lab-demo": dynamic(() =>
    import("@/content/generating-sounds-with-ai/demos/sound-lab-demo").then((m) => m.SoundLabDemo),
  ),
  "mastering-animate-presence/01-presence-state": dynamic(() =>
    import("@/content/mastering-animate-presence/demos/01-presence-state").then((m) => m.PresenceState),
  ),
  "mastering-animate-presence/02-manual-exit": dynamic(() =>
    import("@/content/mastering-animate-presence/demos/02-manual-exit").then((m) => m.ManualExitDemo),
  ),
  "mastering-animate-presence/03-nested-exits": dynamic(() =>
    import("@/content/mastering-animate-presence/demos/03-nested-exits").then((m) => m.NestedExitsDemo),
  ),
  "mastering-animate-presence/04-modes-demo": dynamic(() =>
    import("@/content/mastering-animate-presence/demos/04-modes-demo").then((m) => m.ModesDemo),
  ),
  "morphing-icons/morphing-icon-demo": dynamic(() =>
    import("@/content/morphing-icons/demos/morphing-icon-demo").then((m) => m.MorphingIconDemo),
  ),
  "sounds-on-the-web/action-feedback-demo": dynamic(() =>
    import("@/content/sounds-on-the-web/demos/action-feedback-demo").then((m) => m.ActionFeedbackDemo),
  ),
  "sounds-on-the-web/button-sound-demo": dynamic(() =>
    import("@/content/sounds-on-the-web/demos/button-sound-demo").then((m) => m.ButtonSoundDemo),
  ),
  "taking-advantage-of-pseudo-elements/before-and-after-demo": dynamic(() =>
    import("@/content/taking-advantage-of-pseudo-elements/demos/before-and-after-demo").then((m) => m.BeforeAndAfterDemo),
  ),
  "taking-advantage-of-pseudo-elements/view-transition-demo": dynamic(() =>
    import("@/content/taking-advantage-of-pseudo-elements/demos/view-transition-demo").then((m) => m.ViewTransitionDemo),
  ),
  "to-spring-or-not-to-spring/decision-flow": dynamic(() =>
    import("@/content/to-spring-or-not-to-spring/demos/decision-flow").then((m) => m.DecisionFlow),
  ),
  "to-spring-or-not-to-spring/ease-vs-spring": dynamic(() =>
    import("@/content/to-spring-or-not-to-spring/demos/ease-vs-spring").then((m) => m.EaseVsSpring),
  ),
  "to-spring-or-not-to-spring/easing-demo": dynamic(() =>
    import("@/content/to-spring-or-not-to-spring/demos/easing-demo").then((m) => m.EasingDemo),
  ),
  "to-spring-or-not-to-spring/linear-demo": dynamic(() =>
    import("@/content/to-spring-or-not-to-spring/demos/linear-demo").then((m) => m.LinearDemo),
  ),
  "to-spring-or-not-to-spring/spring-demo": dynamic(() =>
    import("@/content/to-spring-or-not-to-spring/demos/spring-demo").then((m) => m.SpringDemo),
  ),
};

export function getDemo(key: string): ComponentType | undefined {
  return demoRegistry[key];
}

export function hasDemo(key: string): boolean {
  return key in demoRegistry;
}

export function getDemoKeys(): string[] {
  return Object.keys(demoRegistry);
}
