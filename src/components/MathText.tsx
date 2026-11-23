import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  content: string;
  className?: string;
}

type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'inline-math'; value: string }
  | { kind: 'display-math'; value: string };

/**
 * Splits mixed Polish prose + $$display$$ + $inline$ + **bold** safely
 * into typed segments without using raw HTML on prose text.
 */
function parseSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  const tokenRegex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\*\*[^*]+?\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: 'text', value: input.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith('$$') && token.endsWith('$$')) {
      segments.push({ kind: 'display-math', value: token.slice(2, -2).trim() });
    } else if (token.startsWith('$') && token.endsWith('$')) {
      segments.push({ kind: 'inline-math', value: token.slice(1, -1).trim() });
    } else if (token.startsWith('**') && token.endsWith('**')) {
      segments.push({ kind: 'bold', value: token.slice(2, -2) });
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({ kind: 'text', value: input.slice(lastIndex) });
  }

  return segments;
}

function renderLatexHtml(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: false,
    output: 'htmlAndMathml',
  });
}

export const MathText: React.FC<MathTextProps> = ({ content, className = '' }) => {
  const segments = useMemo(() => parseSegments(content), [content]);

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.kind === 'text') {
          return <React.Fragment key={idx}>{seg.value}</React.Fragment>;
        }
        if (seg.kind === 'bold') {
          return (
            <strong key={idx} className="font-semibold text-slate-900 dark:text-slate-50">
              <MathText content={seg.value} />
            </strong>
          );
        }
        if (seg.kind === 'display-math') {
          const html = renderLatexHtml(seg.value, true);
          return (
            <span
              key={idx}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        const html = renderLatexHtml(seg.value, false);
        return (
          <span
            key={idx}
            className="inline-block align-baseline mx-[0.12em]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
};
