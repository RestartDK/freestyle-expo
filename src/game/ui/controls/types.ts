export type ControlTemplateId = 'A' | 'B' | 'C' | 'D';

export type Vec2 = { x: number; y: number };

/**
 * Callbacks for generated games. Vectors are normalized to roughly [-1, 1] per axis.
 * Wire only what your template uses; unused callbacks stay optional.
 */
export type ControlTemplateProps = {
  template: ControlTemplateId;
  /** Primary move / locomotion (left stick or equivalent). */
  onMove?: (v: Vec2) => void;
  /** Aiming / camera (right stick in twin-stick layouts). */
  onMoveSecondary?: (v: Vec2) => void;
  /** Primary action (e.g. fire); true while the control is held. */
  onPrimaryAction?: (pressed: boolean) => void;
  /** Secondary action (e.g. jump / reload). */
  onSecondaryAction?: (pressed: boolean) => void;
  /** Discrete tap (template C secondary region). */
  onTap?: () => void;
  /** Swipe deltas in template D swipe zone (screen-space). */
  onSwipe?: (delta: Vec2) => void;
  /** Lane taps in template D (left / center / right). */
  onLane?: (lane: 0 | 1 | 2) => void;
};
