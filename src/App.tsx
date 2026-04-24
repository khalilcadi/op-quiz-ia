import { useState } from 'react';
import type { Screen, EventConfig, SessionData } from './types';
import ChatWindow from './components/ChatWindow';
import { getSessions, exportJSON, exportCSV, clearSessions } from './engine/responseStore';
import questionnaireA from './data/questionnaireA';
import questionnaireB from './data/questionnaireB';
import questionnaireA_brunch from './data/questionnaireA_brunch';
import questionnaireB_brunch from './data/questionnaireB_brunch';
import type { Questionnaire } from './types';

const events: EventConfig[] = [
  { id: 'cercle-festival', name: 'Cercle Festival', date: '22 mai 2026', drawDate: '18 mai 2026', emoji: '🎪' },
  { id: 'brunch-solomun', name: 'Brunch Électronique × Solomun', date: '13 juin 2026', drawDate: '11 juin 2026', emoji: '🎶' },
];

const questionnairesByEvent: Record<string, { A: Questionnaire; B: Questionnaire }> = {
  'cercle-festival': { A: questionnaireA, B: questionnaireB },
  'brunch-solomun': { A: questionnaireA_brunch, B: questionnaireB_brunch },
};

function getQuestionnaire(eventId: string, variant: 'A' | 'B'): Questionnaire {
  return questionnairesByEvent[eventId]?.[variant] ?? (variant === 'A' ? questionnaireA : questionnaireB);
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeEvent, setActiveEvent] = useState<EventConfig | null>(null);
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  const startQuestionnaire = (event: EventConfig, type: 'A' | 'B') => {
    setActiveEvent(event);
    setVariant(type);
    setScreen('chat');
  };

  if (screen === 'chat' && activeEvent) {
    return (
      <ChatWindow
        key={`${activeEvent.id}-${variant}-${Date.now()}`}
        questionnaire={getQuestionnaire(activeEvent.id, variant)}
        eventConfig={activeEvent}
        variant={variant}
        onComplete={() => setScreen('home')}
      />
    );
  }

  if (screen === 'responses') {
    return <ResponsesScreen onBack={() => setScreen('home')} />;
  }

  return <HomeScreen events={events} onStart={startQuestionnaire} onViewResponses={() => setScreen('responses')} />;
}

// ---------------------------------------------------------------------------
// Home Screen
// ---------------------------------------------------------------------------

function HomeScreen({
  events,
  onStart,
  onViewResponses,
}: {
  events: EventConfig[];
  onStart: (event: EventConfig, type: 'A' | 'B') => void;
  onViewResponses: () => void;
}) {
  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-[480px] w-full">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-white mb-1">OnParty — Test Questionnaires</h1>
        <p className="text-text-muted text-center text-[13px] mb-10">Outil interne — choisis un event puis un questionnaire</p>

        {/* Event cards */}
        <div className="space-y-5">
          {events.map((event) => (
            <div key={event.id} className="bg-bg-surface rounded-2xl p-5 border border-border">
              <div className="flex items-center gap-3 mb-0.5">
                <span className="text-xl">{event.emoji}</span>
                <h2 className="text-[16px] font-semibold text-white">{event.name}</h2>
              </div>
              <p className="text-text-muted text-[13px] mb-4 ml-9">{event.date} — tirage le {event.drawDate}</p>

              <div className="flex gap-3 ml-9">
                <button
                  onClick={() => onStart(event, 'A')}
                  className="flex-1 px-3 py-2.5 rounded-[14px] text-[13px] font-medium border border-accent text-white
                    hover:bg-[#8b5cf633] hover:shadow-[0_0_15px_#8b5cf64d] transition-all duration-200 cursor-pointer"
                >
                  Questionnaire A
                  <span className="block text-[11px] text-text-muted font-normal mt-0.5">Exploratoire</span>
                </button>
                <button
                  onClick={() => onStart(event, 'B')}
                  className="flex-1 px-3 py-2.5 rounded-[14px] text-[13px] font-medium border border-accent-cyan text-white
                    hover:bg-[#22d3ee26] hover:shadow-[0_0_15px_#22d3ee4d] transition-all duration-200 cursor-pointer"
                >
                  Questionnaire B
                  <span className="block text-[11px] text-text-muted font-normal mt-0.5">Validation</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View responses */}
        <button
          onClick={onViewResponses}
          className="mt-10 w-full px-4 py-3 rounded-[14px] text-[13px] font-medium bg-bg-surface border border-border text-text-secondary
            hover:border-text-muted hover:text-white transition-all duration-200 cursor-pointer"
        >
          Voir les réponses collectées
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Responses Screen
// ---------------------------------------------------------------------------

function formatDuration(startedAt: number, completedAt?: number): string {
  if (!completedAt) return 'En cours';
  const seconds = Math.round((completedAt - startedAt) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function eventLabel(eventId: string): string {
  const found = events.find((e) => e.id === eventId);
  return found ? `${found.emoji} ${found.name}` : eventId;
}

function ResponsesScreen({ onBack }: { onBack: () => void }) {
  const [sessions, setSessions] = useState<SessionData[]>(getSessions());

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Supprimer TOUTES les sessions ? Cette action est irréversible.')) {
      clearSessions();
      setSessions([]);
    }
  };

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center px-4 py-8">
      <div className="max-w-[540px] w-full">
        {/* Back */}
        <button
          onClick={onBack}
          className="text-text-muted text-[13px] mb-6 hover:text-white transition-colors cursor-pointer"
        >
          ← Retour à l'accueil
        </button>

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Réponses collectées</h1>
            <p className="text-text-muted text-[13px] mt-1">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => downloadFile(exportJSON(sessions), `onparty-responses-${Date.now()}.json`, 'application/json')}
              disabled={sessions.length === 0}
              className="px-3 py-2 rounded-lg text-[12px] font-medium bg-accent text-white cursor-pointer
                hover:shadow-[0_0_15px_#8b5cf64d] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              JSON
            </button>
            <button
              onClick={() => downloadFile(exportCSV(sessions), `onparty-responses-${Date.now()}.csv`, 'text/csv')}
              disabled={sessions.length === 0}
              className="px-3 py-2 rounded-lg text-[12px] font-medium bg-accent-cyan text-black cursor-pointer
                hover:shadow-[0_0_15px_#22d3ee4d] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              CSV
            </button>
          </div>
        </div>

        {/* Sessions list */}
        {sessions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted text-[14px]">Aucune session pour le moment.</p>
            <p className="text-text-muted text-[12px] mt-1">Lance un questionnaire depuis l'accueil.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...sessions].reverse().map((session) => (
              <div key={session.sessionId} className="bg-bg-surface rounded-xl p-4 border border-border">
                {/* Session header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      session.variant === 'A'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-accent-cyan/20 text-accent-cyan'
                    }`}>
                      Q{session.variant}
                    </span>
                    <span className="text-[13px] text-white font-medium">{eventLabel(session.eventId)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-text-muted block">
                      {new Date(session.startedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-[11px] font-medium ${session.completedAt ? 'text-green-400' : 'text-yellow-400'}`}>
                      {formatDuration(session.startedAt, session.completedAt)}
                    </span>
                  </div>
                </div>

                {/* Responses */}
                {session.responses.length > 0 ? (
                  <div className="bg-[#0d0c15] rounded-lg p-3 space-y-1.5">
                    {session.responses
                      .filter((r) => r.dataKey !== '_end' && r.dataKey !== 'completion')
                      .map((r) => (
                      <div key={r.dataKey} className="flex gap-2 text-[12px]">
                        <span className="text-accent font-mono shrink-0">{r.dataKey}</span>
                        <span className="text-text-muted">→</span>
                        <span className="text-text-secondary break-all">
                          {Array.isArray(r.value) ? r.value.join(', ') : r.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted text-[12px] italic">Aucune réponse enregistrée</p>
                )}

                {/* Session ID */}
                <p className="text-[10px] text-text-muted mt-2 font-mono opacity-50">{session.sessionId}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reset */}
        {sessions.length > 0 && (
          <button
            onClick={handleReset}
            className="mt-8 w-full px-4 py-2.5 rounded-xl text-[13px] text-red-400 border border-red-400/30
              hover:bg-red-400/10 transition-all duration-200 cursor-pointer"
          >
            Reset toutes les données ({sessions.length} session{sessions.length !== 1 ? 's' : ''})
          </button>
        )}
      </div>
    </div>
  );
}
