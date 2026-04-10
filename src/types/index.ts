// --- Message types ---

export type MessageType =
  | 'agent_text'
  | 'agent_buttons'
  | 'agent_multi_select'
  | 'user_text_input'
  | 'agent_text_then_input'
  | 'agent_text_then_buttons';

// --- Questionnaire node types ---

export type InputType = 'buttons' | 'multi_select' | 'text' | 'none';

export interface ButtonOption {
  label: string;
  value: string;
  emoji?: string;
}

export interface UserResponse {
  questionId: string;
  dataKey: string;
  value: string | string[];
  timestamp: number;
}

export interface ChatNode {
  id: string;
  messages: string[] | ((responses: UserResponse[]) => string[]);
  inputType: InputType;
  options?: ButtonOption[];
  maxSelections?: number;
  minTextLength?: number;
  relanceMessage?: string;
  inputMode?: 'text' | 'email';
  next: string | ((response: UserResponse) => string);
  dataKey: string;
}

export type Questionnaire = ChatNode[];

// --- Chat message (for rendering) ---

export type MessageSender = 'agent' | 'user';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
}

// --- Session data ---

export interface SessionData {
  sessionId: string;
  variant: 'A' | 'B';
  eventId: string;
  responses: UserResponse[];
  startedAt: number;
  completedAt?: number;
  language: 'fr' | 'en';
}

// --- App routing ---

export type Screen = 'home' | 'chat' | 'responses';

export interface EventConfig {
  id: string;
  name: string;
  date: string;
  drawDate: string;
  emoji: string;
}

export interface CurrentInput {
  type: InputType;
  options?: ButtonOption[];
  maxSelections?: number;
  minTextLength?: number;
  relanceMessage?: string;
  inputMode?: 'text' | 'email';
}
