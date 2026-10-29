// Learner-facing labels for content status (R027) and fixed disclaimers.
export const STATUS_LABEL = {
  draft: { short: 'Draft', kind: 'bad', long: 'Draft: not checked. Draft items are never shown to learners.' },
  auto_checked: { short: 'Auto-checked', kind: 'info', long: 'Passed automated checks only. Not reviewed by a native speaker.' },
  human_reviewed: { short: 'Reviewed', kind: 'ok', long: 'Reviewed by a named human reviewer.' },
  to_be_authored: { short: 'Not released', kind: 'warn', long: 'This unit has not been written yet.' },
};
export const MOCK_DISCLAIMER = 'Original practice exam. Not an official JLPT paper.';
export const RESULT_LABEL = 'Practice estimate — not a JLPT score';
export const NOT_JLPT = 'Not a JLPT score';
export const LEVEL_LABEL = 'Instructional level (unofficial)';
