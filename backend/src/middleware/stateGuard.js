import { STATE_TRANSITION_RULES } from '../config/constants.js';

/**
 * Validates whether the given user role is permitted to transition
 * an entity from currentState to targetState.
 */
export function validateStateTransition(currentState, targetState, userRole) {
  const allowedTransitions = STATE_TRANSITION_RULES[currentState];

  if (!allowedTransitions) {
    return {
      allowed: false,
      status: 422,
      reason: `Current state '${currentState}' has no valid outward transitions defined.`
    };
  }

  const rule = allowedTransitions.find((t) => t.target === targetState);
  if (!rule) {
    return {
      allowed: false,
      status: 422,
      reason: `Illegal transition: Cannot transition from '${currentState}' to '${targetState}'. Allowed targets: ${allowedTransitions.map((t) => t.target).join(', ')}`
    };
  }

  // State admin always has emergency override authority
  if (userRole === 'state_admin' || rule.allowedRoles.includes(userRole) || rule.allowedRoles.includes('system')) {
    return {
      allowed: true,
      rule
    };
  }

  return {
    allowed: false,
    status: 403,
    reason: `Forbidden: User role '${userRole}' is not authorized to transition from '${currentState}' to '${targetState}'. Required roles: ${rule.allowedRoles.join(', ')}`
  };
}
