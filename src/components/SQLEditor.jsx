import React, { useEffect, useRef } from 'react'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands'
import { lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view'
import { closeBrackets } from '@codemirror/autocomplete'

const INITIAL_SQL = `-- Write your SQL query here
-- Press Ctrl+Enter (or Cmd+Enter) to run

SELECT `

export default function SQLEditor({ value, onChange, onRun, disabled }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const onRunRef = useRef(onRun)
  const onChangeRef = useRef(onChange)

  useEffect(() => { onRunRef.current = onRun }, [onRun])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    if (!containerRef.current) return

    const runKeymap = keymap.of([
      {
        key: 'Ctrl-Enter',
        mac: 'Cmd-Enter',
        run: () => { onRunRef.current?.(); return true }
      }
    ])

    const startDoc = value ?? INITIAL_SQL

    const state = EditorState.create({
      doc: startDoc,
      extensions: [
        history(),
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        closeBrackets(),
        sql(),
        oneDark,
        runKeymap,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current?.(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            background: '#161616',
          },
          '.cm-content': {
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            padding: '8px 0',
          },
          '.cm-gutters': {
            background: '#1e1e1e',
            border: 'none',
            borderRight: '1px solid #393939',
          },
          '.cm-activeLineGutter': {
            background: '#252525',
          },
          '.cm-activeLine': {
            background: '#1f1f1f',
          },
          '.cm-cursor': {
            borderLeftColor: '#4589ff',
          },
          '.cm-selectionBackground': {
            background: '#264f78 !important',
          },
        }),
        EditorState.readOnly.of(disabled ?? false),
      ],
    })

    const view = new EditorView({ state, parent: containerRef.current })
    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, []) // only on mount

  // Sync value from outside (e.g. Reset)
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (value !== undefined && value !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      })
    }
  }, [value])

  return <div ref={containerRef} className="editor-wrapper" style={{ flex: 1, minHeight: 0 }} />
}
