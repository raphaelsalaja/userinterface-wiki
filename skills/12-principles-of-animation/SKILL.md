---
name: 12-principles-of-animation
description: Apply Disney's 12 animation principles to web interfaces. Use when implementing motion, reviewing animation quality, designing micro-interactions, or making UI feel alive. Triggers on tasks involving CSS animations, transitions, motion libraries, easing curves, springs, or UX feedback.
license: MIT
metadata:
  author: raphael-salaja
  version: "1.1.0"
  source: /content/12-principles-of-animation/index.mdx
---

# 12 Principles of Animation

Disney animators codified these principles in the 1930s to make drawings feel real. We use them to make pixels feel human. The problems are surprisingly similar.

## When to Apply

Reference these guidelines when:
- Adding motion to UI components
- Reviewing animation quality and feel
- Designing micro-interactions and feedback
- Making interfaces feel more alive and responsive
- Deciding what should (and shouldn't) animate

## Principles Overview

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
Digital objects don't have physics, so we fake it. Subtle deformation conveys weight—but don't overdo it or professional software becomes a cartoon.

### 2. Anticipation
Give cues before major actions. Pull-to-refresh hints, buttons that compress before sending. Reserve for moments that matter—too many wind-ups make apps feel sluggish.

### 3. Staging
Guide the eye through sequential animation. Dim backgrounds, focus on important elements. Direct attention like a film.

### 4. Straight Ahead & Pose to Pose
Focus on key poses: start state, end state, maybe a midpoint. Context menus animate on exit only—entrance animation compounds into irritation.

### 5. Follow Through & Overlapping
Nothing moves as a single rigid unit. Springs add organic overshoot-and-settle that easing curves can't replicate. But too much stagger makes interfaces feel slow.

### 6. Slow In & Slow Out
- `ease-out`: Entrances (arrive fast, settle gently)
- `ease-in`: Exits (build momentum before departure)
- `ease-in-out`: Deliberate movements

### 7. Arcs
Curved paths feel inevitable, like water finding its level. Best for hero moments and playful interactions. Utilitarian interfaces work fine with straight lines.

### 8. Secondary Action
Flourishes supporting the main action—sparkles after success, sound effects on impact. Think games: they combine sound and visual effects for impact.

### 9. Timing
Keep interactions under 300ms. Be consistent—if one button animates at 200ms, all buttons should. Define timing scales early, reuse everywhere.

### 10. Exaggeration
Push past physical accuracy to make points land harder. Use sparingly for onboarding, empty states, confirmations, or errors.

### 11. Solid Drawing
Shadows suggest depth. Layering implies hierarchy. CSS `perspective` gives 3D transforms actual depth.

### 12. Appeal
The difference between software you tolerate and software you love. Not one technique—the sum of all techniques applied with care and taste.

## Key Guidelines

- **Balance**: Too much animation turns professional software into a cartoon
- **Consistency**: Define timing scales early, reuse everywhere
- **Purpose**: Great animation is invisible—users think "this feels good"
- **Restraint**: Not everything needs to be animated

## References

- [The Illusion of Life: Disney Animation](https://www.amazon.com/Illusion-Life-Disney-Animation/dp/0786860707)
- [Apple WWDC23: Animate with Springs](https://developer.apple.com/videos/play/wwdc2023/10158)
- [easing.dev](https://easing.dev) - Easing function playground
- [Rauno's Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design)
