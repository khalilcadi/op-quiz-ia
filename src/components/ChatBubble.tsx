import type { MessageSender } from '../types';

interface ChatBubbleProps {
  text: string;
  sender: MessageSender;
}

export default function ChatBubble({ text, sender }: ChatBubbleProps) {
  const isAgent = sender === 'agent';

  return (
    <div
      className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-3 animate-fade-in-up`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 text-[15px] leading-[1.5] text-text-primary ${
          isAgent
            ? 'bg-bg-bubble-agent border-l-[3px] border-l-accent rounded-tl-none rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px]'
            : 'bg-bg-bubble-user rounded-tl-[12px] rounded-tr-none rounded-br-[12px] rounded-bl-[12px]'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
