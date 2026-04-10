import { useState, useRef } from 'react';

interface TextInputProps {
  minLength?: number;
  relanceMessage?: string;
  onSubmit: (text: string) => void;
}

export default function TextInput({ minLength = 0, relanceMessage, onSubmit }: TextInputProps) {
  const [text, setText] = useState('');
  const [showRelance, setShowRelance] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (minLength && text.trim().length < minLength) {
      setShowRelance(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      inputRef.current?.focus();
      return;
    }
    setShowRelance(false);
    onSubmit(text.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="animate-fade-in">
      {showRelance && relanceMessage && (
        <p className="text-[13px] text-accent mb-2.5 animate-fade-in-up">{relanceMessage}</p>
      )}
      <div className={`flex gap-2.5 ${shaking ? 'animate-shake' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (showRelance) setShowRelance(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Écris ta réponse..."
          autoFocus
          className="flex-1 bg-bg-surface border border-border rounded-[20px] px-5 py-3 text-[15px] text-white
            placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors duration-200"
        />
        <button
          onClick={handleSubmit}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-accent text-white cursor-pointer shrink-0
            shadow-[0_0_15px_#8b5cf64d] hover:shadow-[0_0_25px_#8b5cf666] transition-all duration-200"
          aria-label="Envoyer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
