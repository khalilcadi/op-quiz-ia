export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3 animate-fade-in">
      <div className="bg-bg-bubble-agent border-l-[3px] border-l-accent rounded-tl-none rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] px-5 py-3.5 flex gap-[5px] items-center">
        <span className="w-[7px] h-[7px] bg-accent rounded-full animate-dot-bounce" />
        <span className="w-[7px] h-[7px] bg-accent rounded-full animate-dot-bounce [animation-delay:0.2s]" />
        <span className="w-[7px] h-[7px] bg-accent rounded-full animate-dot-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
