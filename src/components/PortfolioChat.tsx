'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { site, about, skills, experience, socials, stats, education } from '@/lib/data';
import { playAlienBlip, playDigitalChime } from '../lib/audio';

// =========================================================================
//  AI Portfolio Chatbot — RAG-style knowledge base from data.ts
// =========================================================================

interface Message {
  role: 'user' | 'bot';
  text: string;
}

// Knowledge base built from data.ts
function buildKnowledgeBase(): { patterns: RegExp[]; answer: string }[] {
  const kb: { patterns: RegExp[]; answer: string }[] = [];

  // Name/role
  kb.push({
    patterns: [/who (is|are)/i, /what (is|are) (your|sahil)/i, /tell me about (sahil|yourself)/i, /introduce/i],
    answer: `${site.name} is a ${site.role} based in ${site.location}. ${site.tagline}`,
  });
  kb.push({
    patterns: [/name/i, /sahil/i],
    answer: `My name is ${site.name}, a ${site.role} from ${site.location}.`,
  });

  // Location
  kb.push({
    patterns: [/where (are you|is sahil|do you|based)/i, /location/i, /city/i, /mohali/i],
    answer: `${site.name} is based in ${site.location}.`,
  });

  // Email / Contact
  kb.push({
    patterns: [/email/i, /contact/i, /mail/i, /reach/i, /message/i],
    answer: `You can reach ${site.name} at ${site.email} or call ${site.phone}.`,
  });
  kb.push({
    patterns: [/phone/i, /call/i, /whatsapp/i, /number/i],
    answer: `Phone: ${site.phone}`,
  });

  // Socials
  kb.push({
    patterns: [/linkedin/i, /github/i, /social/i, /profile/i, /links/i],
    answer: socials.map(s => `${s.label}: ${s.href}`).join('\n'),
  });

  // Skills
  kb.push({
    patterns: [/skill/i, /tech/i, /technology/i, /tool/i, /stack/i, /frontend/i, /backend/i, /language/i, /framework/i],
    answer: skills.map(g => `${g.group}: ${g.items.join(', ')}`).join('\n'),
  });

  // Experience
  kb.push({
    patterns: [/experience/i, /work/i, /job/i, /career/i, /employed/i, /company/i, /worked/i, /delhivery/i, /business websoft/i, /softwiz/i, /cs soft/i],
    answer: experience.map(e => `${e.role} at ${e.company} (${e.period}): ${e.points.join(' ')}`).join('\n\n'),
  });

  // Projects
  kb.push({
    patterns: [/project/i, /portfolio/i, /build/i, /made/i, /created/i, /product/i],
    answer: 'Check out the Projects section below! I have built several applications including real estate platforms, purchase order management systems, and interactive portfolios.',
  });

  // Resume
  kb.push({
    patterns: [/resume/i, /cv/i, /curriculum/i],
    answer: `Download resume: ${site.resumeUrl}`,
  });

  // Education
  kb.push({
    patterns: [/education/i, /study/i, /college/i, /university/i, /degree/i, /ba/i, /kurukshetra/i, /kuk/i],
    answer: `${site.name} holds a ${education.length > 0 ? education[0].degree : 'degree'} from ${education.length > 0 ? education[0].school : 'university'}.`,
  });

  // Stats
  kb.push({
    patterns: [/stats/i, /statistic/i, /years/i, /experience years/i, /how long/i],
    answer: stats.map(s => `${s.value} ${s.label}`).join(' · '),
  });

  // Role-specific
  kb.push({
    patterns: [/full.?stack/i, /\developer\b/i, /angular/i, /\.net/i, /c#/i, /csharp/i, /dotnet/i],
    answer: `${site.name} is a Full-Stack Developer specializing in Angular, TypeScript, .NET/C#, CQRS, and clean architecture. Currently at Business WebSoft Pvt Ltd.`,
  });

  // Bio/background
  kb.push({
    patterns: [/background/i, /bio/i, /journey/i, /logistics/i, /story/i, /path/i, /operations/i, /delhivery experience/i],
    answer: about.body.join(' '),
  });

  // About
  kb.push({
    patterns: [/about/i, /introduction/i, /profile/i, /summary/i],
    answer: about.body.join(' '),
  });

  // General greeting
  kb.push({
    patterns: [/^(hi|hello|hey|howdy|namaste|sup|yo)/i, /^good (morning|afternoon|evening)/i],
    answer: `Hi there! 👋 I'm the AI assistant for ${site.name}'s portfolio. Ask me about skills, experience, projects, or any question you have!`,
  });

  // Help
  kb.push({
    patterns: [/help/i, /what can you/i, /ask/i, /question/i, /commands/i],
    answer: `I can answer questions about:\n• ${site.name}'s skills & technologies\n• Work experience & background\n• Projects & portfolio\n• Contact info & social links\n• Education & resume\n\nTry asking: "What tech does Sahil use?" or "Tell me about the experience."`,
  });

  // Thanks
  kb.push({
    patterns: [/thank/i, /thanks/i, /thx/i, /appreciate/i],
    answer: `You're welcome! 😊 Feel free to ask anything else about ${site.name}'s work. If you'd like to get in touch, just say "contact"!`,
  });

  // Fashion / hobbies (creative)
  kb.push({
    patterns: [/hobby/i, /interest/i, /passion/i],
    answer: `${site.name} is passionate about building scalable software, clean architecture, and turning operational complexity into streamlined code. Outside work, loves exploring new tech, gaming, and music.`,
  });

  return kb;
}

const knowledgeBase = buildKnowledgeBase();

function findAnswer(query: string): string | null {
  for (const entry of knowledgeBase) {
    for (const pattern of entry.patterns) {
      if (pattern.test(query)) return entry.answer;
    }
  }
  return null;
}

// Quick questions
const quickQuestions = [
  'What tech does Sahil use?',
  'Where is Sahil based?',
  'Tell me about the experience',
  'Contact info',
];

export default function PortfolioChat() {
  const { soundEnabled } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: `👋 Hi! I'm the AI assistant for ${site.name}. Ask me anything!` },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback((text: string) => {
    const query = text.trim();
    if (!query) return;

    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');
    setIsTyping(true);

    if (soundEnabled) playAlienBlip();

    // Simulate typing delay
    setTimeout(() => {
      const answer = findAnswer(query);
      const response = answer || `🤔 I'm not sure about that. Try asking about skills, experience, projects, location, or contact info!`;
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
      if (soundEnabled) playDigitalChime(0.02);
    }, 600 + Math.random() * 400);
  }, [soundEnabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => {
          if (soundEnabled) playDigitalChime(0.02);
          setOpen(o => !o);
        }}
        aria-label="Open portfolio chat"
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-accent-cyan/30 bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 text-xl shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(34,211,238,0.3)]"
      >
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          💬
        </motion.span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-base-raised/95 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div>
                  <h3 className="text-sm font-bold text-ink">Ask Sahil</h3>
                  <p className="text-[10px] text-ink-faint">Powered by Portfolio AI</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="h-[320px] overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent-cyan/15 text-ink rounded-tr-md border border-accent-cyan/20'
                        : 'bg-white/5 text-ink-muted rounded-tl-md border border-white/10'
                    }`}
                  >
                    <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="rounded-2xl rounded-tl-md bg-white/5 border border-white/10 px-3.5 py-2.5">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60 animate-bounce" style={{ animationDelay: '200ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60 animate-bounce" style={{ animationDelay: '400ms' }} />
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            <div className="flex gap-1.5 overflow-x-auto px-3 py-2 border-t border-white/5 scrollbar-thin">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-ink-faint hover:bg-white/10 hover:text-ink-muted transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-white/10 p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3.5 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent-cyan/40 transition-colors"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="rounded-xl bg-accent-cyan/15 p-2.5 text-accent-cyan hover:bg-accent-cyan/25 disabled:opacity-30 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
