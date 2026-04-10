import { useEffect, useRef } from 'react';
import type { Questionnaire, EventConfig } from '../types';
import { useChat } from '../engine/chatEngine';
import ChatBubble from './ChatBubble';
import ButtonGroup from './ButtonGroup';
import TextInput from './TextInput';
import ProgressBar from './ProgressBar';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  questionnaire: Questionnaire;
  eventConfig: EventConfig;
  variant: 'A' | 'B';
  onComplete: () => void;
}

export default function ChatWindow({
  questionnaire,
  eventConfig,
  variant,
  onComplete,
}: ChatWindowProps) {
  const {
    messages,
    currentInput,
    sendResponse,
    isTyping,
    progress,
    isComplete,
  } = useChat(questionnaire, eventConfig, variant);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages, typing, or input change
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping, currentInput, isComplete]);

  return (
    <div className="flex flex-col h-dvh max-w-[480px] mx-auto bg-bg">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-center justify-center py-3.5 border-b border-[#1a1a2e]">
          <span className="text-[15px] font-semibold text-white tracking-wide">OnParty</span>
        </div>
        <ProgressBar current={progress} total={100} />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} text={msg.text} sender={msg.sender} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input area */}
      {currentInput && (
        <div className="shrink-0 px-4 pb-5 pt-3 border-t border-[#1a1a2e]">
          {currentInput.type === 'buttons' && currentInput.options && (
            <ButtonGroup
              key={currentInput.options.map(o => o.value).join(',')}
              options={currentInput.options}
              mode="single"
              onSubmit={sendResponse}
            />
          )}
          {currentInput.type === 'multi_select' && currentInput.options && (
            <ButtonGroup
              key={`multi-${currentInput.options.map(o => o.value).join(',')}`}
              options={currentInput.options}
              mode="multi"
              maxSelections={currentInput.maxSelections}
              onSubmit={sendResponse}
            />
          )}
          {currentInput.type === 'text' && (
            <TextInput
              key={`text-${currentInput.minTextLength}-${currentInput.relanceMessage}-${currentInput.inputMode}`}
              minLength={currentInput.minTextLength}
              relanceMessage={currentInput.relanceMessage}
              inputMode={currentInput.inputMode}
              onSubmit={(text) => sendResponse(text)}
            />
          )}
        </div>
      )}

      {/* Completion — back button after linger delay */}
      {isComplete && (
        <div className="shrink-0 px-4 pb-5 pt-3 border-t border-[#1a1a2e] animate-fade-in">
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-[20px] text-[14px] font-medium border border-accent text-white
              hover:bg-[#8b5cf633] hover:shadow-[0_0_15px_#8b5cf64d] transition-all duration-200 cursor-pointer"
          >
            Retour à l'accueil
          </button>
        </div>
      )}
    </div>
  );
}
