import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ReactNode } from 'react'

interface WithTooltipProps {
  hidden?: boolean
  children: ReactNode
  text: string
}

const WithTooltip = ({ hidden = false, children, text }: WithTooltipProps) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-pointer">{children}</span>
      </TooltipTrigger>
      <TooltipContent hidden={hidden}>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default WithTooltip
