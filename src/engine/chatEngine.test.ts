import { describe, it, expect } from 'vitest';
import { getNodeById, countShortestPath } from './chatEngine';
import questionnaireA from '../data/questionnaireA';
import questionnaireB from '../data/questionnaireB';
import type { UserResponse } from '../types';

// Helper to build a UserResponse
function makeResponse(nodeId: string, dataKey: string, value: string | string[]): UserResponse {
  return { questionId: nodeId, dataKey, value, timestamp: Date.now() };
}

// ---------------------------------------------------------------------------
// 1. All messages display in correct order
// ---------------------------------------------------------------------------

describe('Questionnaire A — node structure', () => {
  it('has all expected node IDs', () => {
    const ids = questionnaireA.map((n) => n.id);
    expect(ids).toEqual(['A0', 'A1', 'A2', 'A3', 'A4a', 'A4b', 'A5', 'A6', 'A6b', 'A7', 'A7b', 'A8']);
  });

  it('every node has at least one message', () => {
    for (const node of questionnaireA) {
      const msgs = typeof node.messages === 'function' ? node.messages([]) : node.messages;
      expect(msgs.length).toBeGreaterThan(0);
    }
  });

  it('every node with buttons/multi_select has options', () => {
    for (const node of questionnaireA) {
      if (node.inputType === 'buttons' || node.inputType === 'multi_select') {
        expect(node.options).toBeDefined();
        expect(node.options!.length).toBeGreaterThan(0);
      }
    }
  });

  it('A0 has 3 messages (accroche)', () => {
    const node = getNodeById(questionnaireA, 'A0')!;
    const msgs = typeof node.messages === 'function' ? node.messages([]) : node.messages;
    expect(msgs).toHaveLength(3);
  });

  it('A8 has 4 messages (clôture)', () => {
    const node = getNodeById(questionnaireA, 'A8')!;
    const msgs = typeof node.messages === 'function' ? node.messages([]) : node.messages;
    expect(msgs).toHaveLength(4);
  });
});

describe('Questionnaire B — node structure', () => {
  it('has all expected node IDs', () => {
    const ids = questionnaireB.map((n) => n.id);
    expect(ids).toEqual(['B0', 'B1a', 'B1b', 'B2', 'B3', 'B4', 'B5a', 'B5b', 'B6']);
  });
});

// ---------------------------------------------------------------------------
// 2. Branching
// ---------------------------------------------------------------------------

describe('A6 branching — rencontres', () => {
  const node = getNodeById(questionnaireA, 'A6')!;

  it('branches to A6b when "Oui clairement"', () => {
    const resp = makeResponse('A6', 'interet_rencontres', 'oui_clairement');
    const next = typeof node.next === 'function' ? node.next(resp) : node.next;
    expect(next).toBe('A6b');
  });

  it('branches to A6b when "Des fois"', () => {
    const resp = makeResponse('A6', 'interet_rencontres', 'des_fois');
    const next = typeof node.next === 'function' ? node.next(resp) : node.next;
    expect(next).toBe('A6b');
  });

  it('skips to A7 when "Pas vraiment"', () => {
    const resp = makeResponse('A6', 'interet_rencontres', 'pas_vraiment');
    const next = typeof node.next === 'function' ? node.next(resp) : node.next;
    expect(next).toBe('A7');
  });

  it('skips to A7 when "C\'est pas mon délire"', () => {
    const resp = makeResponse('A6', 'interet_rencontres', 'pas_mon_delire');
    const next = typeof node.next === 'function' ? node.next(resp) : node.next;
    expect(next).toBe('A7');
  });
});

describe('B3 dynamic messages', () => {
  const node = getNodeById(questionnaireB, 'B3')!;

  it('adapts message for recos_perso as top 1', () => {
    const responses = [makeResponse('B2', 'top_features', ['recos_perso', 'guest_list'])];
    const msgs = typeof node.messages === 'function' ? node.messages(responses) : node.messages;
    expect(msgs[0]).toContain('LA soirée parfaite');
  });

  it('adapts message for guest_list as top 1', () => {
    const responses = [makeResponse('B2', 'top_features', ['guest_list', 'recos_perso'])];
    const msgs = typeof node.messages === 'function' ? node.messages(responses) : node.messages;
    expect(msgs[0]).toContain('guest list');
  });

  it('adapts message for crew_planning as top 1', () => {
    const responses = [makeResponse('B2', 'top_features', ['crew_planning', 'reviews'])];
    const msgs = typeof node.messages === 'function' ? node.messages(responses) : node.messages;
    expect(msgs[0]).toContain('coordination');
  });

  it('adapts message for social_realtime as top 1', () => {
    const responses = [makeResponse('B2', 'top_features', ['social_realtime', 'dress_code_vibe'])];
    const msgs = typeof node.messages === 'function' ? node.messages(responses) : node.messages;
    expect(msgs[0]).toContain('en temps réel');
  });

  it('adapts message for reviews as top 1', () => {
    const responses = [makeResponse('B2', 'top_features', ['reviews', 'social_realtime'])];
    const msgs = typeof node.messages === 'function' ? node.messages(responses) : node.messages;
    expect(msgs[0]).toContain('retours fiables');
  });

  it('adapts message for dress_code_vibe as top 1', () => {
    const responses = [makeResponse('B2', 'top_features', ['dress_code_vibe', 'reviews'])];
    const msgs = typeof node.messages === 'function' ? node.messages(responses) : node.messages;
    expect(msgs[0]).toContain('dress code');
  });

  it('falls back to recos_perso if no top_features response', () => {
    const msgs = typeof node.messages === 'function' ? node.messages([]) : node.messages;
    expect(msgs[0]).toContain('LA soirée parfaite');
  });
});

// ---------------------------------------------------------------------------
// 3. minTextLength validation
// ---------------------------------------------------------------------------

describe('Text input validation', () => {
  it('A2 requires minTextLength 10', () => {
    const node = getNodeById(questionnaireA, 'A2')!;
    expect(node.inputType).toBe('text');
    expect(node.minTextLength).toBe(10);
    expect(node.relanceMessage).toBeDefined();
  });

  it('A5 requires minTextLength 15', () => {
    const node = getNodeById(questionnaireA, 'A5')!;
    expect(node.inputType).toBe('text');
    expect(node.minTextLength).toBe(15);
  });

  it('every text node has a relanceMessage', () => {
    const textNodes = [...questionnaireA, ...questionnaireB].filter(
      (n) => n.inputType === 'text',
    );
    for (const node of textNodes) {
      expect(node.relanceMessage).toBeDefined();
      expect(node.relanceMessage!.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// 4. Multi-select maxSelections
// ---------------------------------------------------------------------------

describe('Multi-select constraints', () => {
  it('B2 has maxSelections = 2', () => {
    const node = getNodeById(questionnaireB, 'B2')!;
    expect(node.inputType).toBe('multi_select');
    expect(node.maxSelections).toBe(2);
    expect(node.options).toHaveLength(6);
  });

  it('B1b has no maxSelections (unlimited)', () => {
    const node = getNodeById(questionnaireB, 'B1b')!;
    expect(node.inputType).toBe('multi_select');
    expect(node.maxSelections).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 5. Progression — shortest path
// ---------------------------------------------------------------------------

describe('Progress calculation', () => {
  it('questionnaire A shortest path has 10 answerable nodes (skips A6b)', () => {
    // Shortest path: A0 A1 A2 A3 A4a A4b A5 A6 A7 A7b = 10
    // (A8 is inputType 'none', A6b is skipped)
    // We test by walking the tree with an option that skips A6b
    let count = 0;
    let currentId: string | null = 'A0';
    const visited = new Set<string>();

    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const node = getNodeById(questionnaireA, currentId);
      if (!node) break;

      if (node.inputType !== 'none') count++;

      if (typeof node.next === 'string') {
        currentId = node.next || null;
      } else {
        // Use "pas_vraiment" to skip A6b
        currentId = node.next(makeResponse(node.id, node.dataKey, 'pas_vraiment'));
      }
    }

    expect(count).toBe(10);
  });

  it('questionnaire A longest path has 11 answerable nodes (includes A6b)', () => {
    let count = 0;
    let currentId: string | null = 'A0';
    const visited = new Set<string>();

    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const node = getNodeById(questionnaireA, currentId);
      if (!node) break;

      if (node.inputType !== 'none') count++;

      if (typeof node.next === 'string') {
        currentId = node.next || null;
      } else {
        // Use "oui_clairement" to include A6b
        currentId = node.next(makeResponse(node.id, node.dataKey, 'oui_clairement'));
      }
    }

    expect(count).toBe(11);
  });

  it('countShortestPath returns 10 for questionnaire A (skips A6b)', () => {
    expect(countShortestPath(questionnaireA)).toBe(10);
  });

  it('countShortestPath returns 8 for questionnaire B (no branches)', () => {
    expect(countShortestPath(questionnaireB)).toBe(8);
  });

  it('questionnaire B has 8 answerable nodes', () => {
    // B0(buttons) B1a(buttons) B1b(multi) B2(multi) B3(buttons) B4(buttons) B5a(buttons) B5b(buttons) = 8
    // B6 = none
    let count = 0;
    for (const node of questionnaireB) {
      if (node.inputType !== 'none') count++;
    }
    expect(count).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// 6. Placeholder resolution
// ---------------------------------------------------------------------------

describe('Placeholder resolution', () => {
  it('A0 messages contain {{EVENT_NAME}} and {{EVENT_DATE}} placeholders', () => {
    const node = getNodeById(questionnaireA, 'A0')!;
    const msgs = typeof node.messages === 'function' ? node.messages([]) : node.messages;
    expect(msgs[0]).toContain('{{EVENT_NAME}}');
    expect(msgs[0]).toContain('{{EVENT_DATE}}');
  });

  it('A8 messages contain {{EVENT_NAME}} and {{DRAW_DATE}} placeholders', () => {
    const node = getNodeById(questionnaireA, 'A8')!;
    const msgs = typeof node.messages === 'function' ? node.messages([]) : node.messages;
    expect(msgs[0]).toContain('{{EVENT_NAME}}');
    expect(msgs[1]).toContain('{{DRAW_DATE}}');
  });

  it('B6 messages contain {{EVENT_NAME}} and {{DRAW_DATE}} placeholders', () => {
    const node = getNodeById(questionnaireB, 'B6')!;
    const msgs = typeof node.messages === 'function' ? node.messages([]) : node.messages;
    expect(msgs[0]).toContain('{{EVENT_NAME}}');
    expect(msgs[1]).toContain('{{DRAW_DATE}}');
  });
});

// ---------------------------------------------------------------------------
// 7. dataKey uniqueness
// ---------------------------------------------------------------------------

describe('dataKey integrity', () => {
  it('questionnaire A has unique dataKeys', () => {
    const keys = questionnaireA.map((n) => n.dataKey);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  it('questionnaire B has unique dataKeys', () => {
    const keys = questionnaireB.map((n) => n.dataKey);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });
});

// ---------------------------------------------------------------------------
// 8. Full walk-through — every node is reachable
// ---------------------------------------------------------------------------

describe('Full walk-through reachability', () => {
  it('questionnaire A — all nodes reachable via some path', () => {
    const reachable = new Set<string>();

    function walk(nodeId: string | null, visited: Set<string>) {
      if (!nodeId || visited.has(nodeId)) return;
      visited.add(nodeId);
      reachable.add(nodeId);

      const node = getNodeById(questionnaireA, nodeId);
      if (!node) return;

      if (typeof node.next === 'string') {
        walk(node.next || null, new Set(visited));
      } else {
        // Try all options
        for (const opt of node.options ?? []) {
          const nextId = node.next(makeResponse(node.id, node.dataKey, opt.value));
          walk(nextId, new Set(visited));
        }
      }
    }

    walk('A0', new Set());
    const allIds = questionnaireA.map((n) => n.id);
    for (const id of allIds) {
      expect(reachable.has(id)).toBe(true);
    }
  });

  it('questionnaire B — all nodes reachable', () => {
    const reachable = new Set<string>();
    let currentId: string | null = 'B0';

    while (currentId) {
      if (reachable.has(currentId)) break;
      reachable.add(currentId);
      const node = getNodeById(questionnaireB, currentId);
      if (!node) break;
      if (typeof node.next === 'string') {
        currentId = node.next || null;
      } else {
        const first = node.options?.[0];
        currentId = node.next(makeResponse(node.id, node.dataKey, first?.value ?? ''));
      }
    }

    const allIds = questionnaireB.map((n) => n.id);
    for (const id of allIds) {
      expect(reachable.has(id)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 9. ButtonOption value/label consistency
// ---------------------------------------------------------------------------

describe('ButtonOption consistency', () => {
  it('every option has non-empty label and value', () => {
    const allNodes = [...questionnaireA, ...questionnaireB];
    for (const node of allNodes) {
      if (node.options) {
        for (const opt of node.options) {
          expect(opt.label.length).toBeGreaterThan(0);
          expect(opt.value.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('option values are unique within each node', () => {
    const allNodes = [...questionnaireA, ...questionnaireB];
    for (const node of allNodes) {
      if (node.options) {
        const values = node.options.map((o) => o.value);
        const unique = new Set(values);
        expect(unique.size).toBe(values.length);
      }
    }
  });
});
