import React, { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';

interface Message {
  id?: string;
  type?: string;
  senderInfo?: {
    username: string;
  };
  timestamp?: {
    seconds: number;
  };
  payload?: {
    message: string;
  };
}

interface LiveFeedProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const LiveFeed = ({ messages, onSendMessage }: LiveFeedProps) => {
  const [newMessage, setNewMessage] = useState('');
  const feedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <Card className="bg-white p-4 rounded-xl shadow-lg flex-grow flex flex-col overflow-hidden h-full">
      <h3 className="text-lg font-bold mb-2 text-gray-800 border-b pb-1">
        Live Feed
      </h3>
      <div
        ref={feedRef}
        className="flex-grow overflow-y-auto pr-1 space-y-1 mb-2 no-scrollbar"
      >
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`mb-2 p-2.5 text-xs rounded-md border-l-2 shadow-sm ${
              msg.type === 'hazard' ? 'border-orange-500 bg-orange-50' : 'border-purple-500 bg-purple-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-800">{msg.senderInfo?.username || 'Unknown'}</p>
              <p className="text-[10px] text-gray-500 text-xs">
                {msg.timestamp?.seconds 
                  ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <p className="text-gray-700 leading-snug text-xs">{msg.payload?.message}</p>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t flex-shrink-0">
        <TextArea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message to broadcast..."
          className="w-full p-1 border rounded-md h-11 text-xs resize-none mb-2 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
        />
        <Button onClick={handleSend} className="w-full mt-1 bg-purple-600 text-white py-2 rounded-md text-xs font-semibold hover:bg-purple-700 shadow-sm">
          Send
        </Button>
      </div>
    </Card>
  );
};

export default LiveFeed;
