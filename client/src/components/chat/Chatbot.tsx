'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { MessageCircle, X, Send, Loader2, Sparkles, Trash2, Minimize2, Maximize2 } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api/api-client';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import styles from './Chatbot.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  properties?: any[];
  suggestedQuestions?: string[];
  timestamp: Date;
}

export function Chatbot() {
  const { isSignedIn, getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
 
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load chat history when opened
  useEffect(() => {
    if (isSignedIn && isOpen && !isMinimized) {
      loadChatHistory();
    }
  }, [isSignedIn, isOpen, isMinimized]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping, isMinimized]);

  const loadChatHistory = async () => {
    try {
      const token = await getToken();
      const response: any = await apiClient.get('/api/chat/history', token);
      if (response.history && response.history.length > 0) {
        const loadedMessages: Message[] = [];
        response.history.forEach((h: any) => {
          loadedMessages.push({
            id: `${h.id}_question`,
            role: 'user',
            content: h.question,
            timestamp: new Date(h.createdAt),
          });
          loadedMessages.push({
            id: h.id,
            role: 'assistant',
            content: h.answer,
            timestamp: new Date(h.createdAt),
          });
        });
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      const token = await getToken();
      await apiClient.delete('/api/chat/history', token);
      setMessages([]);
      toast.success('Chat history cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const token = await getToken();
      const response: any = await apiClient.post('/api/chat/ask', { question: inputValue }, token);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        properties: response.properties,
        suggestedQuestions: response.suggestedQuestions,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to get response. Please try again.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setIsMinimized(false);
  };

  if (!isSignedIn) return null;

  return (
    <div className={styles.chatbotContainer}>
      {/* Floating Button */}
      {!isOpen && (
        <button onClick={toggleOpen} className={styles.floatingButton}>
          <MessageCircle className={styles.floatingIcon} />
          <span className={styles.statusDot} />
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className={cn(styles.chatModal, isMinimized && styles.chatModalMinimized)}>
          
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <Sparkles className={styles.headerIcon} />
              <span className={styles.headerTitle}>UrbanKey AI</span>
              <Badge variant="secondary" className={styles.headerBadge}>RAG Powered</Badge>
            </div>
            <div className={styles.headerActions}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={toggleMinimize} className={styles.headerButton}>
                      {isMinimized ? <Maximize2 className={styles.headerButtonIcon} /> : <Minimize2 className={styles.headerButtonIcon} />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{isMinimized ? 'Expand' : 'Minimize'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={clearHistory} className={styles.headerButton}>
                      <Trash2 className={styles.headerButtonIcon} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Clear history</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <button onClick={toggleOpen} className={styles.headerButton}>
                <X className={styles.headerButtonIcon} />
              </button>
            </div>
          </div>

          {/* Messages Area - Hidden when minimized */}
          {!isMinimized && (
            <>
              <div 
                ref={scrollAreaRef} 
                className={styles.messagesArea}
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {messages.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIconWrapper}>
                      <Sparkles className={styles.emptyIcon} />
                    </div>
                    <h3 className={styles.emptyTitle}>Hi there! 👋</h3>
                    <p className={styles.emptyText}>
                      Ask me anything about properties on UrbanKey. I can help you find your perfect home!
                    </p>
                    <p className={styles.suggestionsTitle}>Try asking:</p>
                    <div className={styles.suggestionsGrid}>
                      {['Show me 2BHK apartments', 'Properties under ₹30,000', 'Near metro station'].map((q) => (
                        <button key={q} onClick={() => handleSuggestedQuestion(q)} className={styles.suggestionButton}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div key={message.id} className={cn(styles.messageWrapper, message.role === 'user' ? styles.messageUser : styles.messageAssistant)}>
                        {message.role === 'assistant' && (
                          <Avatar className={styles.messageAvatar}>
                            <AvatarFallback className={styles.avatarFallback}>AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={cn(styles.messageBubble, message.role === 'user' ? styles.messageUserBubble : styles.messageAssistantBubble)}>
                          <div className={styles.messageContent}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>

                          {message.properties && message.properties.length > 0 && (
                            <div className={styles.propertyCardsContainer}>
                              <p className={styles.propertyCardLabel}>Relevant properties:</p>
                              {message.properties.slice(0, 3).map((prop: any) => (
                                <a key={prop.id} href={`/properties/${prop.id}`} target="_blank" rel="noopener noreferrer" className={styles.propertyCardLink}>
                                  <p className={styles.propertyCardTitle}>{prop.title}</p>
                                  <p className={styles.propertyCardPrice}>₹{prop.rent.toLocaleString()}/month</p>
                                </a>
                              ))}
                            </div>
                          )}

                          {message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                            <div className={styles.suggestedQuestionsContainer}>
                              {message.suggestedQuestions.map((q, idx) => (
                                <button key={idx} onClick={() => handleSuggestedQuestion(q)} className={styles.suggestedQuestionButton}>
                                  {q}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <Avatar className={styles.messageAvatar}>
                            <AvatarFallback className={cn(styles.avatarFallback, styles.userAvatarFallback)}>You</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className={cn(styles.messageWrapper, styles.messageAssistant)}>
                        <Avatar className={styles.messageAvatar}>
                          <AvatarFallback className={styles.avatarFallback}>AI</AvatarFallback>
                        </Avatar>
                        <div className={cn(styles.messageBubble, styles.messageAssistantBubble)}>
                          <div className={styles.typingIndicator}>
                            <span className={styles.typingDot} />
                            <span className={styles.typingDot} />
                            <span className={styles.typingDot} />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className={styles.inputArea}>
                <div className={styles.inputContainer}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about properties..."
                    className={styles.input}
                    disabled={isLoading}
                  />
                  <button onClick={sendMessage} disabled={isLoading || !inputValue.trim()} className={styles.sendButton}>
                    {isLoading ? <Loader2 className={styles.sendIconSpinner} /> : <Send className={styles.sendIcon} />}
                  </button>
                </div>
                <p className={styles.inputFooter}>AI-powered responses based on our property database</p>
              </div>
            </>
          )}
          
          {/* Minimized View - Clickable to expand! */}
          {isMinimized && (
            <div className={styles.minimizedContent} onClick={toggleMinimize}>
              <Sparkles className={styles.headerIcon} style={{ display: 'inline', marginRight: '8px', color: '#8b5cf6' }} />
              <span>UrbanKey AI Assistant is ready. <strong>Click to chat</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}