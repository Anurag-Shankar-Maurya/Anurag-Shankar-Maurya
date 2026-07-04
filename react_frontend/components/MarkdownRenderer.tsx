import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="relative border border-[#E5E5E5] rounded-[1.5rem] overflow-hidden my-6 bg-[#2d3139] shadow-sm">
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#21252b] border-b border-neutral-800 text-xs font-semibold text-neutral-400 font-mono select-none">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors focus:outline-none"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="text-sm overflow-x-auto">
        <SyntaxHighlighter
          style={oneDark as any}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-renderer prose prose-lg max-w-none text-[#4c4546] leading-[1.6] prose-code:before:content-none prose-code:after:content-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          pre({ children, ...props } : any) {
            const codeEl = React.Children.toArray(children)[0] as any;
            if (codeEl && codeEl.type === 'code') {
              const className = codeEl.props.className || '';
              const match = /language-(\w+)/.exec(className);
              const language = match ? match[1] : 'code';
              let value = String(codeEl.props.children).replace(/\n$/, '');
              
              // Strip single backticks wrapping the content if they exist
              if (value.startsWith('`') && value.endsWith('`')) {
                value = value.slice(1, -1);
              }
              
              return <CodeBlock language={language} value={value} />;
            }
            return <pre {...props}>{children}</pre>;
          },
          table({ children, ...props } : any) {
            return (
              <div className="w-full overflow-x-auto my-6 border border-[#E5E5E5] rounded-[1.5rem] shadow-none bg-white">
                <table className="min-w-[600px] md:min-w-full text-sm border-collapse" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-[#F9F9F9]">{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-[#E5E5E5] select-none">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-6 py-4 text-sm text-[#4c4546] align-top border-b border-[#E5E5E5] leading-[1.6]">
                {children}
              </td>
            );
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-[#FCFCFC] transition-colors last:children:border-b-0">
                {children}
              </tr>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
