import { useState, useRef } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface TextInputProps {
  minLength?: number;
  relanceMessage?: string;
  inputMode?: 'text' | 'email';
  onSubmit: (text: string) => void;
}

export default function TextInput({ minLength = 0, relanceMessage, inputMode = 'text', onSubmit }: TextInputProps) {
  const [text, setText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    const trimmed = text.trim();

    // Email validation
    if (inputMode === 'email') {
      if (!EMAIL_REGEX.test(trimmed)) {
        setErrorMsg(relanceMessage ?? 'Entre une adresse email valide 📧');
        triggerShake();
        return;
      }
    }

    // Min length validation
    if (minLength && trimmed.length < minLength) {
      setErrorMsg(relanceMessage ?? `${minLength} caractères minimum`);
      triggerShake();
      return;
    }

    setErrorMsg(null);
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const placeholder = inputMode === 'email' ? 'ton@email.com' : 'Écris ta réponse...';

  return (
    <div className="animate-fade-in">
      {errorMsg && (
        <p className="text-[13px] text-accent mb-2.5 animate-fade-in-up">{errorMsg}</p>
      )}
      <div className={`flex gap-2.5 ${shaking ? 'animate-shake' : ''}`}>
        <input
          ref={inputRef}
          type={inputMode === 'email' ? 'email' : 'text'}
          inputMode={inputMode === 'email' ? 'email' : 'text'}
          autoComplete={inputMode === 'email' ? 'email' : 'off'}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (errorMsg) setErrorMsg(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
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
