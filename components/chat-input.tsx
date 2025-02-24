import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ArrowUp, Paperclip, Square, X } from 'lucide-react'
import { SetStateAction, useMemo } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

export function ChatInput({
  retry,
  isErrored,
  isLoading,
  isRateLimited,
  stop,
  input,
  handleInputChange,
  handleSubmit,
  isMultiModal,
  files,
  handleFileChange,
  children,
  toolsMsg,
  isMcpSelected,
  isArtifactsSelected,
  onMcpClick,
  onArtifactsClick,
}: {
  retry: () => void
  isErrored: boolean
  isLoading: boolean
  isRateLimited: boolean
  stop: () => void
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isMultiModal: boolean
  files: File[]
  handleFileChange: (change: SetStateAction<File[]>) => void
  children: React.ReactNode
  toolsMsg?: string
  isMcpSelected?: boolean
  isArtifactsSelected?: boolean
  onMcpClick?: () => void
  onArtifactsClick?: () => void
}) {
  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    handleFileChange((prev) => [...prev, ...Array.from(e.target.files || [])])
  }

  function handleFileRemove(file: File) {
    handleFileChange((prev) => prev.filter((f) => f !== file))
  }

  const filePreview = useMemo(() => {
    if (files.length === 0) return null
    return Array.from(files).map((file) => {
      return (
        <div className="relative" key={file.name}>
          <span
            onClick={() => handleFileRemove(file)}
            className="absolute top-[-8] right-[-8] bg-muted rounded-full p-1"
          >
            <X className="h-3 w-3 cursor-pointer" />
          </span>
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="rounded-xl w-10 h-10 object-cover"
          />
        </div>
      )
    })
  }, [files])

  function onEnter(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      if (e.currentTarget.checkValidity()) {
        handleSubmit(e)
      } else {
        e.currentTarget.reportValidity()
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={onEnter}
      className="mb-2 flex flex-col mt-auto bg-background"
    >
      {
        toolsMsg && <>
         <div className="flex items-center gap-2 px-4 py-2 mb-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex-shrink-0 w-5 h-5 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div className="flex-1 text-sm text-blue-700 dark:text-blue-300 break-words whitespace-pre-wrap overflow-auto max-h-24">
            {toolsMsg}
          </div>
        </div>
      </>
      }
     
      {isErrored && (
        <div
          className={`flex items-center p-1.5 text-sm font-medium mb-2 rounded-xl ${
            isRateLimited
              ? 'bg-orange-400/10 text-orange-400'
              : 'bg-red-400/10 text-red-400'
          }`}
        >
          <span className="flex-1 px-1.5">
            {isRateLimited
              ? 'You have reached your request limit for the day.'
              : 'An unexpected error has occurred.'}
          </span>
          <button
            className={`px-2 py-1 rounded-sm ${
              isRateLimited ? 'bg-orange-400/20' : 'bg-red-400/20'
            }`}
            // onClick={retry}
          >
            Try again
          </button>
        </div>
      )}
      <div className="shadow-md rounded-2xl border">
        <div className="flex items-center px-3 py-2 gap-1">{children}</div>
        <TextareaAutosize
          autoFocus={true}
          minRows={1}
          maxRows={5}
          className="text-normal px-3 resize-none ring-0 bg-inherit w-full m-0 outline-none"
          required={true}
          placeholder="Describe your app..."
          disabled={isErrored}
          value={input}
          onChange={handleInputChange}
        />
        <div className="flex p-3 gap-2 items-center">
          <input
            type="file"
            id="multimodal"
            name="multimodal"
            accept="image/*"
            multiple={true}
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="flex items-center flex-1 gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!isMultiModal || isErrored}
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('multimodal')?.click()
                    }}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add attachments</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              type="button"
              variant={isMcpSelected ? "default" : "outline"}
              size="sm"
              className={`rounded-full w-20 h-7 text-xs font-medium transition-colors ${
                isMcpSelected 
                  ? "bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] hover:bg-[#18181B]/90 dark:hover:bg-white/90 border-[#18181B] dark:border-white" 
                  : "bg-white dark:bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border dark:border-gray-700"
              }`}
              onClick={onMcpClick}
            >
              Mcp
            </Button>

            <Button
              type="button"
              variant={isArtifactsSelected ? "default" : "outline"}
              size="sm"
              className={`rounded-full w-20 h-7 text-xs font-medium transition-colors ${
                isArtifactsSelected 
                  ? "bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] hover:bg-[#18181B]/90 dark:hover:bg-white/90 border-[#18181B] dark:border-white" 
                  : "bg-white dark:bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border dark:border-gray-700"
              }`}
              onClick={onArtifactsClick}
            >
              Artifacts
            </Button>

            {files.length > 0 && filePreview}
          </div>
          <div>
            {!isLoading ? (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isErrored}
                      variant="default"
                      size="icon"
                      type="submit"
                      className="rounded-xl h-10 w-10"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send message</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-xl h-10 w-10"
                      onClick={(e) => {
                        e.preventDefault()
                        stop()
                      }}
                    >
                      <Square className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Stop generation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        {/* Fragments is an open-source project made by{' '}
        <a href="https://e2b.dev" target="_blank" className="text-[#ff8800]">
          ✶ E2B
        </a> */}
      </p>
    </form>
  )
}
