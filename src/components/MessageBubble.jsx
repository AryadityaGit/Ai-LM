import { User, Bot } from 'lucide-react';
import { cn } from "@/lib/utils"; // Assuming you have a utility function for classnames

export function MessageBubble({ sender, name, message }) {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-md ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
          }`}
        >
          <div className="font-semibold text-sm mb-1 opacity-75">{name}</div>
          <div className="text-sm leading-relaxed">{message}</div>
        </div>
      </div>
    </div>
  );
}