import React from 'react';

function splitLines(text) {
  return String(text ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n');
}

function classifyLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return { type: 'empty' };

  const unordered = trimmed.match(/^([-*•])\s+(.*)$/);
  if (unordered) return { type: 'ul', content: unordered[2] };

  const ordered = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
  if (ordered) return { type: 'ol', number: Number(ordered[1]), content: ordered[2] };

  return { type: 'text', content: trimmed };
}

function buildBlocks(lines) {
  const blocks = [];
  let current = null;

  const pushCurrent = () => {
    if (current) blocks.push(current);
    current = null;
  };

  for (const rawLine of lines) {
    const info = classifyLine(rawLine);

    if (info.type === 'empty') {
      pushCurrent();
      continue;
    }

    if (info.type === 'ul' || info.type === 'ol') {
      if (!current || current.type !== info.type) {
        pushCurrent();
        current = { type: info.type, items: [] };
      }
      current.items.push(info.content);
      continue;
    }

    // text
    if (!current || current.type !== 'p') {
      pushCurrent();
      current = { type: 'p', lines: [] };
    }
    current.lines.push(info.content);
  }

  pushCurrent();
  return blocks;
}

export default function FormattedDescription({ text, className = '' }) {
  const raw = String(text ?? '').trim();
  if (!raw) return null;

  const blocks = buildBlocks(splitLines(raw));

  return (
    <div className={className}>
      {blocks.map((b, idx) => {
        if (b.type === 'ul') {
          return (
            <ul key={`ul-${idx}`} className="mb-3 ps-4">
              {b.items.map((item, i) => (
                <li key={`ul-${idx}-${i}`} className="text-muted">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (b.type === 'ol') {
          return (
            <ol key={`ol-${idx}`} className="mb-3 ps-4">
              {b.items.map((item, i) => (
                <li key={`ol-${idx}-${i}`} className="text-muted">
                  {item}
                </li>
              ))}
            </ol>
          );
        }

        // paragraph block
        return (
          <p key={`p-${idx}`} className="text-muted mb-3">
            {b.lines.join(' ')}
          </p>
        );
      })}
    </div>
  );
}

