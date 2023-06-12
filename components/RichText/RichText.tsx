import Blocks from 'editorjs-blocks-react-renderer'
import React from 'react'

import { parseEditorJSData } from '@/utils/text'

export interface RichTextProps {
  jsonStringData?: string
}

export function RichText({ jsonStringData }: RichTextProps) {
  const data = parseEditorJSData(jsonStringData)
  if (!data) {
    return null
  }

  return (
    <article className="prose-slate prose-ul:list-disc">
      <Blocks data={data} />
    </article>
  )
}

export default RichText
