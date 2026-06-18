import React, { useEffect, useRef } from 'react'
import { EditorView, keymap, drawSelection, highlightActiveLine, dropCursor,
         rectangularSelection, highlightSpecialChars, crosshairCursor } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap, indentUnit } from '@codemirror/language'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'

const DEFAULT_PYTHON = `# Write your Python code here
# Press Ctrl+Enter (Cmd+Enter on Mac) to run

def solve():
    pass
`

const editableCompartment = new Compartment()

export default function PythonEditor({ value, onChange, onRun, disabled }) {
  const editorRef = useRef(null)
  const viewRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const onRunRef = useRef(onRun)

  useEffect(() => {
    onChangeRef.current = onChange
    onRunRef.current = onRun
  }, [onChange, onRun])

  useEffect(() => {
    if (!editorRef.current) return

    const startState = EditorState.create({
      doc: value ?? DEFAULT_PYTHON,
      extensions: [
        oneDark,
        python(),
        indentUnit.of("    "),
        history(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSpecialChars(),
        editableCompartment.of(EditorView.editable.of(!disabled)),
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              onRunRef.current?.()
              return true
            }
          },
          ...defaultKeymap,
          ...historyKeymap,
          ...foldKeymap,
          indentWithTab,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current?.(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': { height: '100%', fontSize: '14px' },
          '.cm-scroller': { overflow: 'auto', fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" },
          '.cm-gutters': { backgroundColor: '#161616', color: '#525252', border: 'none' },
        })
      ]
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [])

  // Sync value from props to editor if it changes externally
  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value ?? '' }
      })
    }
  }, [value])

  // Handle disabled state
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: editableCompartment.reconfigure(EditorView.editable.of(!disabled))
      })
    }
  }, [disabled])

  return (
    <div 
      className={`python-editor-wrap ${disabled ? 'disabled' : ''}`} 
      ref={editorRef}
      style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}
    />
  )
}
