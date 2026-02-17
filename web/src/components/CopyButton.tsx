import { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui'

interface CopyButtonProps {
  text: string
  className?: string
  /** When provided, the parent controls the copied state and handles the copy action. */
  copied?: boolean
  onCopy?: () => void
}

const CopyButton = ({ text, className, copied: externalCopied, onCopy }: CopyButtonProps) => {
  const [, copy] = useCopyToClipboard()
  const [internalCopied, setInternalCopied] = useState(false)

  const copied = externalCopied ?? internalCopied

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onCopy) {
      onCopy()
    } else {
      const success = await copy(text)
      if (success) {
        setInternalCopied(true)
        setTimeout(() => setInternalCopied(false), 2000)
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={className}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}

export default CopyButton
