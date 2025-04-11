'use client'

import { FragmentInterpreter } from './fragment-interpreter'
import { FragmentWeb } from './fragment-web'

export function FragmentPreview({ result,onClose }) {
  if (result.template === 'code-interpreter-v1') {
    return <FragmentInterpreter result={result} />
  }

  return <FragmentWeb result={result}  onClose={onClose}/>
}
