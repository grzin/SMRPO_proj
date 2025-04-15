'use client'

import { Project } from '@/payload-types'
import { FC, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { updateDocumentationAction } from '@/actions/project-action'
import ReactMarkdown from 'react-markdown'
import 'easymde/dist/easymde.min.css'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

export const Documentation: FC<{
  project: Project
}> = ({ project }) => {
  const [isEditing, setIsEditing] = useState(false)
  const editorRef = useRef<string | null>(null)
  const [editor, setEditor] = useState(editorRef.current || null)
  const simpleMDERef = useRef<any>(null) // Ref for the SimpleMDE editor instance

  const exportToMarkdown = () => {
    const blob = new Blob([project.documentation || ''], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.name}-documentation.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const insertTextAtCursor = (text: string) => {
    if (simpleMDERef.current) {
      const cm = simpleMDERef.current.codemirror // Access the CodeMirror instance
      const cursor = cm.getCursor() // Get the current cursor position
      cm.replaceRange(text, cursor) // Insert the text at the cursor position
    }
  }

  const handleImportDocumentation = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (isEditing) {
        editorRef.current = content // Replace the entire content
        setEditor(content)
      } else {
        editorRef.current = content
        setIsEditing(true)
        setEditor(content)
      }
    }
    reader.readAsText(file)
  }

  const handleInsertDocumentation = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (isEditing) {
        insertTextAtCursor(content) // Insert the imported text at the cursor
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <Card
        className="col-span-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files?.[0]
          if (file) {
            handleImportDocumentation(file)
          }
        }}
      >
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>Project documentation</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {isEditing ? (
            <SimpleMDE
              value={editorRef.current || ''}
              onChange={(value) => (editorRef.current = value)}
              options={{
                spellChecker: false,
                placeholder: 'Write your project documentation here...',
              }}
              getMdeInstance={(instance) => (simpleMDERef.current = instance)} // Store the SimpleMDE instance
            />
          ) : (
            <div className="prose max-w-none">
              <ReactMarkdown>{project.documentation || ''}</ReactMarkdown>
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="default"
              onClick={() => {
                if (isEditing) {
                  project.documentation = editorRef.current || ''
                  updateDocumentationAction(project.id, project.documentation)
                } else {
                  editorRef.current = project.documentation || ''
                }
                setIsEditing(!isEditing)
              }}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
            {isEditing ? (
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            ) : (
              <></>
            )}
            <input
              type="file"
              accept=".md"
              id="import-documentation"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImportDocumentation(file) // Replace the entire content
                }
              }}
            />
            <input
              type="file"
              accept=".md"
              id="insert-documentation"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleInsertDocumentation(file) // Insert at cursor
                }
              }}
            />
            <Button
              variant="default"
              onClick={() => document.getElementById('import-documentation')?.click()}
            >
              Import Documentation
            </Button>
            {isEditing && (
              <Button
                variant="default"
                onClick={() => document.getElementById('insert-documentation')?.click()}
              >
                Insert Documentation
              </Button>
            )}
            {!isEditing && (
              <>
                <Button variant="default" onClick={exportToMarkdown}>
                  Export Documentation
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
