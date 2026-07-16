'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// =========================================================================
//  CodeRainReveal — typing code snippets + matrix rain background
// =========================================================================

interface CodeSnippet {
  code: string;
  language: 'tsx' | 'js' | 'css' | 'bash' | 'csharp' | 'json' | 'typescript';
}

interface CodeRainRevealProps {
  snippets?: CodeSnippet[];
  children?: React.ReactNode;
  className?: string;
}

// Default code snippets showcasing Sahil's skills
const defaultSnippets: CodeSnippet[] = [
  {
    language: 'tsx',
    code: `// 👨‍💻 Sahil Chauhan — Full-Stack Developer
const expertise = {
  frontend: ['Angular', 'TypeScript', 'React', 'RxJS'],
  backend:  ['.NET / C#', 'CQRS', 'REST APIs'],
  passion:  'Clean Architecture & Scalable Systems',
};

console.log('Built with ❤️ using Astro + Three.js');`,
  },
  {
    language: 'bash',
    code: `$ whoami
> sahilchauhan — Full-Stack Developer

$ pwd
> Mohali, Punjab, India

$ skills --list
> Angular  .NET  TypeScript  React  Three.js  CQRS

$ echo "Let's build something great!"
> Let's build something great!`,
  },
  {
    language: 'csharp',
    code: `// Clean Architecture in action
public class UserService : IUserService
{
  private readonly IUserRepository _repo;
  
  public async Task<UserDto> GetByIdAsync(Guid id)
  {
    var user = await _repo.GetByIdAsync(id);
    return UserMapper.ToDto(user);
  }
}`,
  },
];

// Matrix rain characters
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

export default function CodeRainReveal({
  snippets = defaultSnippets,
  children,
  className = '',
}: CodeRainRevealProps) {
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const typingRef = useRef<number>(0);
  const charIndexRef = useRef(0);

  // Matrix rain effect on canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isInView) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const columns = Math.floor(canvas.width / 14);
    const drops: number[] = Array(columns).fill(0);
    const fontSize = 14;

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 6, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * 14;
        const y = drops[i] * 14;

        // Gradient from bright to dim
        const brightness = Math.random();
        ctx.fillStyle = brightness > 0.9
          ? 'rgba(34, 211, 238, 0.6)'
          : 'rgba(34, 211, 238, 0.15)';
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isInView]);

  // Typing animation
  useEffect(() => {
    if (!isInView) return;
    if (isTypingDone) return;

    const currentSnippet = snippets[activeSnippetIndex]?.code || '';
    charIndexRef.current = 0;
    setDisplayedText('');
    setIsTypingDone(false);

    const typeNextChar = () => {
      if (charIndexRef.current < currentSnippet.length) {
        setDisplayedText(currentSnippet.slice(0, charIndexRef.current + 1));
        charIndexRef.current++;
        // Variable speed: slightly slower at line breaks
        const char = currentSnippet[charIndexRef.current - 1];
        const delay = char === '\n' ? 40 : Math.random() * 15 + 8;
        typingRef.current = window.setTimeout(typeNextChar, delay);
      } else {
        setIsTypingDone(true);
      }
    };

    typeNextChar();

    return () => clearTimeout(typingRef.current);
  }, [isInView, activeSnippetIndex, snippets, isTypingDone]);

  // Blinking cursor
  useEffect(() => {
    if (!isTypingDone) return;
    const interval = setInterval(() => {
      setShowCursor(c => !c);
    }, 530);
    return () => clearInterval(interval);
  }, [isTypingDone]);

  // Rotate through snippets when typing is done
  useEffect(() => {
    if (!isTypingDone) return;
    const timeout = setTimeout(() => {
      if (activeSnippetIndex < snippets.length - 1) {
        setActiveSnippetIndex(i => i + 1);
        setIsTypingDone(false);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isTypingDone, activeSnippetIndex, snippets.length]);

  // Language badge color
  const langColor = (lang: string) => {
    const colors: Record<string, string> = {
      tsx: '#3178c6',
      js: '#f7df1e',
      css: '#1572b6',
      bash: '#4eaa25',
      csharp: '#239120',
      json: '#292929',
      typescript: '#3178c6',
    };
    return colors[lang] || '#22d3ee';
  };

  return (
    <div ref={sectionRef} className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Matrix rain background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content overlay */}
      <div className="relative z-10 glass p-5 sm:p-7">
        {/* Language badge */}
        {snippets[activeSnippetIndex] && (
          <div className="mb-3 flex items-center gap-2">
            <span
              className="inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: langColor(snippets[activeSnippetIndex].language) }}
            >
              {snippets[activeSnippetIndex].language}
            </span>
            <span className="text-[10px] text-ink-faint">
              {isTypingDone ? '✅ Ready' : '⏳ Typing...'}
            </span>
          </div>
        )}

        {/* Code block */}
        <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
          <code>
            {displayedText.split('\n').map((line, i, arr) => {
              // Syntax highlighting: comments -> ink-faint, strings -> accent-cyan, keywords -> accent-violet
              const highlightedLine = line
                .replace(/\/\/.*/g, (match) => `<span class="text-ink-faint italic">${match}</span>`)
                .replace(/(['"`].*?['"`])/g, (match) => `<span class="text-accent-cyan">${match}</span>`)
                .replace(/\b(const|let|var|function|return|if|else|for|async|await|public|private|class|new|import|from|export|default|console|typeof)\b/g, (match) => `<span class="text-accent-violet font-semibold">${match}</span>`);

              const isLast = i === arr.length - 1;

              return (
                <span key={i} className="block">
                  <span dangerouslySetInnerHTML={{ __html: highlightedLine || ' ' }} />
                  {isLast && (
                    <span
                      className="inline-block w-2 h-4 ml-0.5 bg-accent-cyan transition-opacity duration-75 align-middle"
                      style={{ opacity: (isTypingDone && !showCursor) ? 0 : 1 }}
                    />
                  )}
                </span>
              );
            })}
          </code>
        </pre>

        {/* Child content (if any) shown below code */}
        {children && (
          <div className="mt-5 pt-5 border-t border-white/10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
