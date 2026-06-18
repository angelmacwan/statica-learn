import { useEffect, useRef, useCallback } from 'react';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { autocompletion } from '@codemirror/autocomplete';

export default function GameCodeEditor({ code, onChange, onRun, disabled }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  const handleRun = useCallback(() => {
    if (!disabled && onRun) onRun();
  }, [disabled, onRun]);

  useEffect(() => {
    if (!editorRef.current) return;

    const runKeymap = keymap.of([
      {
        key: 'Ctrl-Enter',
        run: () => { handleRun(); return true; },
      },
      {
        key: 'Mod-Enter',
        run: () => { handleRun(); return true; },
      },
    ]);

    const state = EditorState.create({
      doc: code || '',
      extensions: [
        lineNumbers(),
        history(),
        python(),
        oneDark,
        autocompletion(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        runKeymap,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': { height: '100%', fontSize: '13px' },
          '.cm-scroller': { fontFamily: "'IBM Plex Mono', 'Fira Code', monospace", overflow: 'auto' },
          '.cm-content': { padding: '8px 0' },
          '&.cm-focused': { outline: 'none' },
          '.cm-line': { padding: '0 8px' },
        }),
      ],
    });

    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update content when code prop changes externally (level switch)
  const prevCodeRef = useRef(code);
  useEffect(() => {
    if (!viewRef.current) return;
    const currentContent = viewRef.current.state.doc.toString();
    if (code !== currentContent && code !== prevCodeRef.current) {
      viewRef.current.dispatch({
        changes: { from: 0, to: currentContent.length, insert: code || '' },
      });
    }
    prevCodeRef.current = code;
  }, [code]);

  return (
    <div
      ref={editorRef}
      style={{
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    />
  );
}
