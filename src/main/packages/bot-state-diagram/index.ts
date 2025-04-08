import { BotState } from "./bot-state/bot-state";
import { Intent } from "./intent-object-component/intent";

export const AgentElementType = {
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
  ReplyBody: 'ReplyBody',
  Reply: 'Reply',
  BotState: 'BotState',
  BotStateBody: 'BotStateBody',
  BotStateFallbackBody: 'BotStateFallbackBody',
} as const;

export const AgentRelationshipType = {
  StateTransition: 'StateTransition',
} as const;
