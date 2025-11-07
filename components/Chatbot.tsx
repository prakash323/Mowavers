
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToBot } from '../services/geminiService';
import Button from './ui/Button';
import { PaperAirplaneIcon, ChatAlt2Icon } from './icons';
import Spinner from './ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { useMockVitals } from '../hooks/useMockVitals';
import { MOCK_PATIENTS } from '../constants';
import { Patient } from '../types';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const patient = user ? (MOCK_PATIENTS[user.id] as Patient) : null;
  const { vitals } = useMockVitals(user?.id || '');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! I'm the MOWAERS AI Assistant. How can I help you? Please note, I cannot provide medical advice." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !patient) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToBot(input, patient, vitals);
      const botMessage: Message = { sender: 'bot', text: botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Gemini API error:', error);
      const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition-transform hover:scale-110 z-40"
        aria-label="Open Chatbot"
      >
        <ChatAlt2Icon className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm h-[600px] bg-brand-dark shadow-2xl rounded-lg flex flex-col z-50">
      <div className="p-4 bg-brand-dark-accent rounded-t-lg flex justify-between items-center">
        <h3 className="text-lg font-bold">AI Assistant</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-dark-accent text-gray-200'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-xl bg-brand-dark-accent text-gray-200">
                <Spinner />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-brand-dark-accent border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading} className="px-4">
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Disclaimer: This is an AI assistant and not a medical professional.</p>
      </div>
    </div>
  );
};

export default Chatbot;
