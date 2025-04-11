import { CodeView } from '../CodeView';
import styles from './index.module.scss';
import { Download, FileText, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/basicComp/Toast';
import classNames from 'classnames';

export function FragmentCode({ files }) {
  const [currentFile, setCurrentFile] = useState(files[0].name);
  const [activeTab, setActiveTab] = useState('input'); // 'input' or 'output'
  const currentFileContent = files.find(
    (file) => file.name === currentFile,
  )?.content;

  function download(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentFileContent);
      toast.success('Code copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  window.handleCopyCode = () => handleCopyCode()
  window.download = () => download(currentFile, currentFileContent || '')

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 overflow-x-auto">
        <CodeView
          code={currentFileContent || ''}
          lang={currentFile.split('.').pop() || ''}
        />
      </div>

    </div>
  );
}
