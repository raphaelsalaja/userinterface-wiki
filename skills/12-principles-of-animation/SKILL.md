---
name: 12-principles-of-animation
description: Guidelines for applying Disney's 12 principles of animation to web interfaces. Use when implementing motion, reviewing animation quality, or designing micro-interactions. Triggers on tasks involving CSS animations, transitions, motion libraries, or UX feedback.
license: MIT
metadata:
  author: raphael-salaja
  version: "1.0.0"
  source: /content/12-principles-of-animation/index.mdx
---

# 12 Principles of Animation

A guide to the foundational principles of animation and how they apply to web interfaces. These principles, originally codified by Disney animators in the 1930s, help create motion that feels intentional, human, and delightful.

## When to Apply

Reference these guidelines when:
- Adding motion to UI components
- Reviewing animation quality and feel
- Designing micro-interactions and feedback
- Choosing between animation techniques
- Making interfaces feel more alive and responsive

## Principles

| # | Principle | Web Application |
|---|-----------|-----------------|
| 1 | Squash and Stretch | Convey weight and elasticity in morphing elements |
| 2 | Anticipation | Prepare users for what comes next (wind-up before action) |
| 3 | Staging | Direct attention through sequential animation |
| 4 | Straight Ahead & Pose to Pose | Define keyframes, let browser interpolate |
| 5 | Follow Through & Overlapping | Use springs for organic overshoot-and-settle |
| 6 | Slow In & Slow Out | Apply easing curves for natural acceleration |
| 7 | Arcs | Add curved paths for organic movement |
| 8 | Secondary Action | Reinforce primary actions with subtle flourishes |
| 9 | Timing | Keep interactions under 300ms, be consistent |
| 10 | Exaggeration | Amplify motion for emphasis (sparingly) |
| 11 | Solid Drawing | Use perspective, shadows, and depth |
| 12 | Appeal | The sum of all techniques applied with care |

## Quick Reference

### 1. Squash and Stretch
Objects deform based on their mass and energy. Digital objects don't have physics, so we fake it. Use subtle deformation to convey weight—but don't overdo it or professional software becomes a cartoon.

### 2. Anticipation
Give cues before major actions occur. A pull-to-refresh that reveals a hint, a button that compresses before sending. Reserve for moments that matter—if everything has a wind-up, the app feels sluggish.

### 3. Staging
When a complex panel opens, guide the eye through sequential animation. Manipulate attention like directing a film—dim backgrounds, focus on important elements.

### 4. Straight Ahead & Pose to Pose
Focus on key poses: start state, end state, maybe a midpoint. Not every moment needs motion. Context menus animate on exit, not entry—entrance animation compounds into irritation.

### 5. Follow Through & Overlapping
Nothing moves as a single rigid unit. Use springs for that organic overshoot-and-settle that easing curves can't replicate. But too much stagger makes interfaces feel slow.

### 6. Slow In & Slow Out
Use easing curves. `ease-out` for entrances (arrive fast, settle gently), `ease-in` for exits (build momentum before departure), `ease-in-out` for deliberate movements.

### 7. Arcs
Curved paths feel inevitable, like water finding its level. Most useful for hero moments and playful interactions. For utilitarian interfaces, straight lines are fine.

### 8. Secondary Action
Little flourishes that support the main action—a checkmark that sparkles after success. Sound can also be secondary action. Think games: impact uses sound and visual effects together.

### 9. Timing
Keep interactions under 300ms. Anything longer needs a good reason. Be consistent—if buttons animate at 200ms, all buttons should animate at 200ms.

### 10. Exaggeration
Push past physical accuracy to make a point land harder. Use sparingly for onboarding, empty states, confirmations, or errors where you want users to feel something strongly.

### 11. Solid Drawing
Shadows suggest depth. Layering implies hierarchy. CSS `perspective` defines how far an object sits from the viewer, giving 3D transforms actual depth.

### 12. Appeal
The difference between software you tolerate and software you love. Not one technique—the sum of all techniques applied with care and taste.

## Key Guidelines

- Balance: Too much animation turns professional software into a cartoon
- Consistency: Define timing scales early, reuse everywhere
- Purpose: Great animation is invisible—users think "this feels good," not "nice ease-out curve"
- Restraint: Not everything needs to be animated

## References

- [The Illusion of Life: Disney Animation](https://www.amazon.com/Illusion-Life-Disney-Animation/dp/0786860707)
- [Apple WWDC23: Animate with Springs](https://developer.apple.com/videos/play/wwdc2023/10158)
- [easing.dev](https://easing.dev) - Easing function playground
- [Rauno's Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design)
