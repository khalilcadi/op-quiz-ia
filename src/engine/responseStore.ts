import type { SessionData, UserResponse } from '../types';

const STORAGE_KEY = 'op-quiz-sessions';

export function getSessions(): SessionData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: SessionData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function createSession(eventId: string, variant: 'A' | 'B'): SessionData {
  const session: SessionData = {
    sessionId: crypto.randomUUID(),
    variant,
    eventId,
    responses: [],
    startedAt: Date.now(),
    language: 'fr',
  };
  const sessions = getSessions();
  sessions.push(session);
  saveSessions(sessions);
  return session;
}

export function saveResponse(sessionId: string, response: UserResponse): void {
  const sessions = getSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (!session) return;
  // Replace if same dataKey already exists, otherwise append
  const existingIdx = session.responses.findIndex((r) => r.dataKey === response.dataKey);
  if (existingIdx >= 0) {
    session.responses[existingIdx] = response;
  } else {
    session.responses.push(response);
  }
  saveSessions(sessions);
}

export function completeSession(sessionId: string): void {
  const sessions = getSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (!session) return;
  session.completedAt = Date.now();
  saveSessions(sessions);
}

export function clearSessions(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// --- Export functions ---

export function exportJSON(sessions: SessionData[]): string {
  return JSON.stringify(sessions, null, 2);
}

export function exportCSV(sessions: SessionData[]): string {
  if (sessions.length === 0) return '';

  // Collect all unique dataKeys across all sessions
  const allKeys = new Set<string>();
  sessions.forEach((s) => {
    s.responses.forEach((r) => allKeys.add(r.dataKey));
  });
  const dataKeys = Array.from(allKeys).sort();

  const headers = ['session_id', 'variant', 'event_id', 'started_at', 'completed_at', ...dataKeys];

  const rows = sessions.map((s) => {
    const base = [
      s.sessionId,
      s.variant,
      s.eventId,
      new Date(s.startedAt).toISOString(),
      s.completedAt ? new Date(s.completedAt).toISOString() : '',
    ];
    const values = dataKeys.map((key) => {
      const entry = s.responses.find((r) => r.dataKey === key);
      if (!entry) return '';
      if (Array.isArray(entry.value)) return entry.value.join('; ');
      return entry.value;
    });
    return [...base, ...values].map(escapeCsv).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
