import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  ChatNode,
  ChatMessage,
  Questionnaire,
  UserResponse,
  SessionData,
  EventConfig,
  CurrentInput,
} from '../types';
import { createSession, saveResponse, completeSession } from './responseStore';

// ---------------------------------------------------------------------------
// Pure helpers (no React)
// ---------------------------------------------------------------------------

export function getNodeById(
  questionnaire: Questionnaire,
  id: string,
): ChatNode | undefined {
  return questionnaire.find((n) => n.id === id);
}

function resolveNextId(
  node: ChatNode,
  userResponse: UserResponse,
): string | null {
  if (typeof node.next === 'function') {
    return node.next(userResponse);
  }
  return node.next || null;
}

/**
 * Resolve messages for a node:
 *  1. Call the messages function if dynamic
 *  2. Replace {{EVENT_NAME}}, {{EVENT_DATE}}, {{DRAW_DATE}} from eventConfig
 *  3. Replace {{dataKey}} from collected responses
 */
function resolveMessages(
  node: ChatNode,
  responses: UserResponse[],
  eventConfig: EventConfig,
): string[] {
  const raw =
    typeof node.messages === 'function'
      ? node.messages(responses)
      : node.messages;

  const eventPlaceholders: Record<string, string> = {
    EVENT_NAME: eventConfig.name,
    EVENT_DATE: eventConfig.date,
    DRAW_DATE: eventConfig.drawDate,
  };

  return raw.map((msg) =>
    msg.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (key in eventPlaceholders) return eventPlaceholders[key];
      const entry = responses.find((r) => r.dataKey === key);
      if (!entry) return key;
      if (Array.isArray(entry.value)) return entry.value.join(', ');
      return entry.value;
    }),
  );
}

/**
 * Count answerable nodes on the SHORTEST path through the questionnaire.
 * At each conditional branch, try ALL options and pick the branch
 * with the fewest remaining answerable nodes.
 */
export function countShortestPath(questionnaire: Questionnaire): number {
  const memo = new Map<string, number>();

  function walk(nodeId: string | null, visited: Set<string>): number {
    if (!nodeId || visited.has(nodeId)) return 0;
    if (memo.has(nodeId)) return memo.get(nodeId)!;

    const node = getNodeById(questionnaire, nodeId);
    if (!node) return 0;

    const nextVisited = new Set(visited);
    nextVisited.add(nodeId);

    const selfCount = node.inputType !== 'none' ? 1 : 0;

    let bestRemaining: number;

    if (typeof node.next === 'string') {
      bestRemaining = walk(node.next || null, nextVisited);
    } else {
      // Try all options, pick the branch with fewest remaining nodes
      const options = node.options ?? [];
      if (options.length === 0) {
        bestRemaining = 0;
      } else {
        let min = Infinity;
        for (const opt of options) {
          const nextId = node.next({
            questionId: node.id,
            dataKey: node.dataKey,
            value: opt.value,
            timestamp: 0,
          });
          const count = walk(nextId, nextVisited);
          if (count < min) min = count;
        }
        bestRemaining = min === Infinity ? 0 : min;
      }
    }

    const total = selfCount + bestRemaining;
    memo.set(nodeId, total);
    return total;
  }

  return walk(questionnaire[0]?.id ?? null, new Set());
}

// ---------------------------------------------------------------------------
// useChat hook
// ---------------------------------------------------------------------------

const TYPING_DELAY = 400;
const COMPLETION_LINGER = 3000; // ms to stay on final screen before showing "back" button

export function useChat(
  questionnaire: Questionnaire,
  eventConfig: EventConfig,
  variant: 'A' | 'B',
) {
  // ---- Session (created once on mount) ----
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const sessionRef = useRef<SessionData | null>(null);
  const initRef = useRef(false); // guard against StrictMode double-mount

  // ---- Chat state ----
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputReady, setInputReady] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const processingRef = useRef(false);
  const totalNodes = useRef(countShortestPath(questionnaire));
  // Track the nodeId that was last processed to avoid re-processing on StrictMode effect re-run
  const lastProcessedNodeRef = useRef<string | null>(null);

  // ---- Create session on mount (guarded) ----
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const session = createSession(eventConfig.id, variant);
    sessionRef.current = session;
    setSessionData(session);
    setCurrentNodeId(questionnaire[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Helpers ----

  const addAgentMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: 'agent',
        text,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: 'user',
        text,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  /**
   * Drip-feed agent messages with typing indicator between each.
   */
  const dripMessages = useCallback(
    (msgs: string[]): Promise<void> => {
      return new Promise((resolve) => {
        if (msgs.length === 0) {
          resolve();
          return;
        }

        let i = 0;

        const showNext = () => {
          if (i >= msgs.length) {
            setIsTyping(false);
            resolve();
            return;
          }

          setIsTyping(true);

          setTimeout(() => {
            addAgentMessage(msgs[i]);
            i++;
            if (i < msgs.length) {
              showNext();
            } else {
              setIsTyping(false);
              resolve();
            }
          }, TYPING_DELAY);
        };

        showNext();
      });
    },
    [addAgentMessage],
  );

  // ---- Enter a node ----

  const enterNode = useCallback(
    async (nodeId: string, currentResponses: UserResponse[]) => {
      const node = getNodeById(questionnaire, nodeId);

      if (!node) {
        if (sessionRef.current) {
          completeSession(sessionRef.current.sessionId);
          setSessionData((s) => (s ? { ...s, completedAt: Date.now() } : s));
        }
        setIsComplete(true);
        return;
      }

      setInputReady(false);

      const resolved = resolveMessages(node, currentResponses, eventConfig);
      await dripMessages(resolved);

      if (node.inputType === 'none') {
        const dummy: UserResponse = {
          questionId: node.id,
          dataKey: node.dataKey,
          value: '',
          timestamp: Date.now(),
        };
        const nextId = resolveNextId(node, dummy);
        if (nextId) {
          setTimeout(() => {
            setCurrentNodeId(nextId);
          }, 300);
        } else {
          // End of questionnaire — complete session, then linger so user reads messages
          if (sessionRef.current) {
            completeSession(sessionRef.current.sessionId);
            setSessionData((s) =>
              s ? { ...s, completedAt: Date.now() } : s,
            );
          }
          setTimeout(() => setIsComplete(true), COMPLETION_LINGER);
        }
      } else {
        setInputReady(true);
      }
    },
    [questionnaire, eventConfig, dripMessages],
  );

  // ---- React to currentNodeId changes ----

  useEffect(() => {
    if (!currentNodeId || !sessionRef.current) return;
    // Prevent double-processing of the same node (StrictMode + processingRef guard)
    if (lastProcessedNodeRef.current === currentNodeId) return;
    if (processingRef.current) return;

    processingRef.current = true;
    lastProcessedNodeRef.current = currentNodeId;

    enterNode(currentNodeId, responses).finally(() => {
      processingRef.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeId]);

  // ---- sendResponse ----

  const sendResponse = useCallback(
    (value: string | string[]) => {
      if (!currentNodeId) return;
      const node = getNodeById(questionnaire, currentNodeId);
      if (!node) return;

      const userResponse: UserResponse = {
        questionId: node.id,
        dataKey: node.dataKey,
        value,
        timestamp: Date.now(),
      };

      // Display label(s) in user bubble, not raw values
      let displayText: string;
      if (Array.isArray(value)) {
        displayText = node.options
          ? node.options
              .filter((o) => value.includes(o.value))
              .map((o) => (o.emoji ? `${o.emoji} ${o.label}` : o.label))
              .join(', ')
          : value.join(', ');
      } else {
        if (node.options) {
          const opt = node.options.find((o) => o.value === value);
          displayText = opt
            ? opt.emoji
              ? `${opt.emoji} ${opt.label}`
              : opt.label
            : value;
        } else {
          displayText = value;
        }
      }

      addUserMessage(displayText);

      // Persist
      const newResponses = [...responses, userResponse];
      setResponses(newResponses);
      if (sessionRef.current) {
        saveResponse(sessionRef.current.sessionId, userResponse);
        setSessionData((s) => {
          if (!s) return s;
          const updated = { ...s };
          const idx = updated.responses.findIndex(
            (r) => r.dataKey === userResponse.dataKey,
          );
          if (idx >= 0) {
            updated.responses[idx] = userResponse;
          } else {
            updated.responses = [...updated.responses, userResponse];
          }
          return updated;
        });
      }

      setInputReady(false);

      const nextId = resolveNextId(node, userResponse);
      if (nextId) {
        setTimeout(() => {
          setCurrentNodeId(nextId);
        }, 200);
      } else {
        if (sessionRef.current) {
          completeSession(sessionRef.current.sessionId);
          setSessionData((s) =>
            s ? { ...s, completedAt: Date.now() } : s,
          );
        }
        setTimeout(() => setIsComplete(true), 300);
      }
    },
    [currentNodeId, questionnaire, responses, addUserMessage],
  );

  // ---- Derived: currentInput ----

  const currentNode = currentNodeId
    ? getNodeById(questionnaire, currentNodeId)
    : null;

  const currentInput: CurrentInput | null =
    inputReady && currentNode && currentNode.inputType !== 'none'
      ? {
          type: currentNode.inputType,
          options: currentNode.options,
          maxSelections: currentNode.maxSelections,
          minTextLength: currentNode.minTextLength,
          relanceMessage: currentNode.relanceMessage,
        }
      : null;

  // ---- Derived: progress (0–100) ----

  const answeredCount = responses.filter((r) => {
    const n = getNodeById(questionnaire, r.questionId);
    return n && n.inputType !== 'none';
  }).length;

  const progress =
    totalNodes.current > 0
      ? Math.min(Math.round((answeredCount / totalNodes.current) * 100), 100)
      : 0;

  return {
    messages,
    currentInput,
    sendResponse,
    isTyping,
    progress,
    isComplete,
    sessionData,
  };
}
