import { Intent } from "./intent-object-component/intent";

export const BotStateElementType = {
  State: 'State',
  StateBody: 'StateBody',
  IntentBody: 'IntentBody',
  StateFallbackBody: 'StateFallbackBody',
  StateActionNode: 'StateActionNode',
  StateFinalNode: 'StateFinalNode',
  StateForkNode: 'StateForkNode',
  StateForkNodeHorizontal: 'StateForkNodeHorizontal',
  StateInitialNode: 'StateInitialNode',
  StateMergeNode: 'StateMergeNode',
  StateObjectNode: 'StateObjectNode',
  StateCodeBlock: 'StateCodeBlock',
  Intent: 'Intent',
} as const;

export const BotStateRelationshipType = {
  StateTransition: 'StateTransition',
} as const;
