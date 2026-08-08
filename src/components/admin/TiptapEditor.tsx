'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

interface TiptapEditorProps {
  /** Current HTML string value */
  value: string;
  /** Called with the new HTML string on every content change */
  onChange: (html: string) => void;
  /** Optional min-height for the editable area (CSS value, default '180px') */
  minHeight?: string;
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // keep editor focused
        if (!disabled) onClick();
      }}
      disabled={disabled}
      title={title}
      className={[
        'inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold transition-colors border-none cursor-pointer select-none',
        active ? 'bg-[#004B39] text-white' : 'bg-transparent text-slate-600 hover:bg-slate-100',
        disabled ? 'opacity-30 cursor-not-allowed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="w-px h-5 bg-slate-200 mx-1 self-center shrink-0" />;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * If the stored value contains HTML-entity-encoded tags (e.g. the user typed
 * raw `<h2>` into a plain textarea before Tiptap was active), unescape them
 * so Tiptap receives real markup instead of literal `&lt;h2&gt;` text nodes.
 *
 * This runs only in the browser, which is fine because TiptapEditor is
 * 'use client' and never SSR-rendered.
 */
function unescapeHtml(raw: string): string {
  if (!raw || typeof document === 'undefined') return raw;
  // Fast-path: if no entities present, skip the DOM round-trip
  if (!raw.includes('&lt;') && !raw.includes('&amp;') && !raw.includes('&gt;')) return raw;
  const el = document.createElement('div');
  el.innerHTML = raw;
  return el.textContent || el.innerText || raw;
}

/**
 * Normalise a value coming from the DB / props into clean HTML for Tiptap.
 * - If the string already looks like HTML (starts with `<`), return as-is.
 * - If it's entity-escaped HTML (first real char after unescaping is `<`),
 *   unescape it first.
 */
function toTiptapContent(value: string): string {
  if (!value) return '<p></p>';
  const trimmed = value.trim();
  // Already valid HTML
  if (trimmed.startsWith('<')) return trimmed;
  // Entity-encoded HTML stored as text — unescape first
  const unescaped = unescapeHtml(trimmed);
  if (unescaped.trim().startsWith('<')) return unescaped.trim();
  // Plain text — wrap in a paragraph
  return `<p>${trimmed}</p>`;
}

export default function TiptapEditor({
  value,
  onChange,
  minHeight = '180px',
}: TiptapEditorProps) {
  // Track whether the editor has been initialised so we don't re-set content
  // on the very first render (it was already provided via `content:`).
  const isMounted = useRef(false);

  const [sourceMode, setSourceMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    // Pass the initial HTML value directly — Tiptap parses it as markup
    content: toTiptapContent(value),
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none outline-none px-3 py-2.5 text-slate-800 text-sm leading-relaxed ' +
          '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#004B39] ' +
          '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#004B39] ' +
          '[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#004B39] ' +
          '[&_a]:text-[#004B39] [&_a]:underline ' +
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 ' +
          '[&_blockquote]:border-l-4 [&_blockquote]:border-[#DB9E30] [&_blockquote]:pl-4 [&_blockquote]:text-slate-600 ' +
          '[&_pre]:bg-slate-900 [&_pre]:text-white [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto ' +
          '[&_pre_code]:bg-transparent [&_pre_code]:text-inherit',
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate({ editor: ed }) {
      onChange(ed.isEmpty ? '' : ed.getHTML());
    },
    // Avoid SSR/hydration mismatch in Next.js
    immediatelyRender: false,
  });

  // Sync when the `value` prop changes externally (e.g. DB load after mount).
  // Skip the first run — content was already set via `content:` above.
  useEffect(() => {
    if (!editor) return;

    if (!isMounted.current) {
      isMounted.current = true;
      return; // skip — initial value already applied by useEditor
    }

    const incoming = toTiptapContent(value);
    const current = editor.isEmpty ? '' : editor.getHTML();

    // Only call setContent when the value genuinely differs to avoid
    // resetting cursor position on every keystroke.
    if (incoming !== current) {
      // `true` as second arg emits the update event so onChange fires once
      editor.commands.setContent(incoming || '<p></p>', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const activeHeading = editor.isActive('heading', { level: 1 })
    ? '1'
    : editor.isActive('heading', { level: 2 })
      ? '2'
      : editor.isActive('heading', { level: 3 })
        ? '3'
        : '0';

  const applyHeading = (level: string) => {
    if (level === '0') {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: Number(level) as 1 | 2 | 3 })
        .run();
    }
  };

  const handleLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', prev ?? 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
    }
  };

  // ADD IT HERE
  const toggleSourceMode = () => {
    if (!sourceMode) {
      // Visual editor -> HTML source
      setHtmlSource(editor.getHTML());
      setSourceMode(true);
    } else {
      // HTML source -> Visual editor
      editor.commands.setContent(htmlSource || '<p></p>');

      onChange(editor.isEmpty ? '' : editor.getHTML());

      setSourceMode(false);
    }
  };

  return (
    <div
  className="flex flex-col rounded-xl border border-slate-300 overflow-hidden bg-white focus-within:border-[#004B39] transition-colors" style={{
    height: "700px",
  }}>
      {/* ── Toolbar ── */}
      <div className="shrink-0 flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200">
        {/* Paragraph / Heading picker */}
        <select
          value={activeHeading}
          onChange={(e) => applyHeading(e.target.value)}
          onMouseDown={(e) => e.preventDefault()}
          className="text-[11px] font-semibold border border-slate-200 rounded-md px-1.5 py-1 bg-white text-slate-700 outline-none cursor-pointer mr-1"
          title="Text style"
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <Sep />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <em className="not-italic font-bold" style={{ fontStyle: 'italic' }}>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <span style={{ textDecoration: 'underline' }}>U</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </ToolbarButton>

        <Sep />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="2" cy="4" r="1.5" /><rect x="5" y="3" width="10" height="2" rx="1" />
            <circle cx="2" cy="8" r="1.5" /><rect x="5" y="7" width="10" height="2" rx="1" />
            <circle cx="2" cy="12" r="1.5" /><rect x="5" y="11" width="10" height="2" rx="1" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered list"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <text x="0" y="5" fontSize="5" fontWeight="bold">1.</text>
            <rect x="5" y="3" width="10" height="2" rx="1" />
            <text x="0" y="9" fontSize="5" fontWeight="bold">2.</text>
            <rect x="5" y="7" width="10" height="2" rx="1" />
            <text x="0" y="13" fontSize="5" fontWeight="bold">3.</text>
            <rect x="5" y="11" width="10" height="2" rx="1" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <rect x="0" y="2" width="2" height="12" rx="1" />
            <rect x="4" y="4" width="11" height="2" rx="1" />
            <rect x="4" y="8" width="9" height="2" rx="1" />
          </svg>
        </ToolbarButton>

        <Sep />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align left"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <rect x="0" y="1" width="16" height="2" rx="1" /><rect x="0" y="5" width="11" height="2" rx="1" />
            <rect x="0" y="9" width="16" height="2" rx="1" /><rect x="0" y="13" width="9" height="2" rx="1" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align center"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <rect x="0" y="1" width="16" height="2" rx="1" /><rect x="2.5" y="5" width="11" height="2" rx="1" />
            <rect x="0" y="9" width="16" height="2" rx="1" /><rect x="3.5" y="13" width="9" height="2" rx="1" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align right"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <rect x="0" y="1" width="16" height="2" rx="1" /><rect x="5" y="5" width="11" height="2" rx="1" />
            <rect x="0" y="9" width="16" height="2" rx="1" /><rect x="7" y="13" width="9" height="2" rx="1" />
          </svg>
        </ToolbarButton>

        <Sep />

        <ToolbarButton
          onClick={handleLink}
          active={editor.isActive('link')}
          title="Insert / edit link"
        >
          🔗
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
          disabled={!editor.isActive('link')}
          title="Remove link"
        >
          ✂️
        </ToolbarButton>

        <Sep />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          —
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleSourceMode}
          active={sourceMode}
          title={sourceMode ? 'Visual editor' : 'Edit HTML source'}
        >
          <code className="text-[10px]">{'</>'}</code>
        </ToolbarButton>
      </div>

      {/* ── Editable content area ── */}
      {sourceMode ? (
        <textarea
          value={htmlSource}
          onChange={(e) => {
            setHtmlSource(e.target.value);
            onChange(e.target.value);
          }}
          spellCheck={false}
          className="flex-1 min-h-0 w-full resize-none overflow-y-auto outline-none border-none bg-slate-950 text-slate-100 font-mono text-sm leading-relaxed p-4"
        />
      ) : (
        <EditorContent
          editor={editor}
          className="flex-1 min-h-0 overflow-y-auto"
        />
      )}
    </div>
  );
}
