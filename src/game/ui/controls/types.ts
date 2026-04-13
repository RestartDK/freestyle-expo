export type ControlTemplateId = 'A';

export type Vec2 = { x: number; y: number };

/**
 * Callbacks for generated games. Vectors are normalized to roughly [-1, 1] per axis.
 * Wire only what your template uses; unused callbacks stay optional.
 */
export type ControlTemplateProps = {
  template: ControlTemplateId;
  /** Primary move / locomotion (left stick or equivalent). */
  onMove?: (v: Vec2) => void;
  /** Primary action (e.g. fire); true while the control is held. */
  onPrimaryAction?: (pressed: boolean) => void;
};
