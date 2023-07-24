export const TOAST_MSG = [
  "Consistency is the key! ",
  "Soon enough your baby will be sleeping peacefully through the night!",
  "You're doing a great job helping your baby to learn and grow!",
  "Almost there! Stay strong and trust your baby!",
  "Keep in mind that this temporary discomfort leads to long-term benefits for both of you and your baby!",
  "You are not alone! Stay consistent and stick with the plan!",
  "Remember that every baby is different, and progress may come at different speeds - stay patient and trust the process.",
  "Believe in yourself and your baby - you are both capable of achieving healthy sleep habits.",
  "It's essential to take breaks and practice self-care during this process -- a well-rested caregiver leads to a well-rested baby!",
  "Celebrate even the smallest victories along the way - each step forward is progress.",
  "A good night's sleep is important for your baby's growth and development!",
];

export const TOAST_MSG_LENGTH = TOAST_MSG.length;
export const FERBER_DEFAULT_PLAN_SECONDS = [
  [3 * 60, 5 * 60, 10 * 60],
  [5 * 60, 10 * 60, 12 * 60],
  [10 * 60, 12 * 60, 15 * 60],
  [12 * 60, 15 * 60, 17 * 60],
  [15 * 60, 17 * 60, 20 * 60],
  [17 * 60, 20 * 60, 25 * 60],
  [20 * 60, 25 * 60, 30 * 60],
];

export const FERBER_DEFAULT_CHECK_IN_SECONDS = 60;

export const enum State {
  Initial,
  RoundInitial,
  Started,
  Paused,
  CheckInInitial,
  CheckInStarted,
  Victory,
}
