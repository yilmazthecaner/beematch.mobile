import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Send, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { useToast } from '../components/ui/use-toast';
import { UploadButton } from '../components/UploadButton';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  media_url?: string;
}

export default function Chat() {
  const { matchId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useStore((state) => state.user);
  const { toast } = useToast();

  useEffect(() => {
    if (!matchId) return;

    // Subscribe to new messages
    const channel = supabase
      .channel(`match:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    // Load existing messages
    loadMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!matchId) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
      return;
    }

    setMessages(data);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!matchId || !user || (!newMessage.trim() && !isUploading)) return;

    try {
      const { error } = await supabase.from('messages').insert({
        match_id: matchId,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage('');
      setShowEmojiPicker(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_id === user?.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {message.media_url && (
                <img
                  src={message.media_url}
                  alt="Shared media"
                  className="rounded-lg mb-2 max-w-full"
                />
              )}
              <p className="break-words">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {format(new Date(message.created_at), 'HH:mm')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="relative flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full rounded-lg border p-2 pr-12 resize-none dark:bg-gray-800 dark:border-gray-700"
              rows={1}
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 bottom-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Smile size={20} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2">
                <EmojiPicker
                  onEmojiClick={(emoji) => {
                    setNewMessage((prev) => prev + emoji.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          <UploadButton
            onUploadComplete={(url) => {
              setIsUploading(false);
              // Handle media message
              supabase.from('messages').insert({
                match_id: matchId,
                sender_id: user?.id,
                content: '',
                media_url: url,
              });
            }}
            onUploadStart={() => setIsUploading(true)}
          />

          <button
            onClick={handleSend}
            disabled={(!newMessage.trim() && !isUploading) || !user}
            className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}