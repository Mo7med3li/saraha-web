import {
  Tooltip as RootTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export interface TooltipProps {
  title: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
  delayDuration?: number;
  disabled?: boolean;
}
export const Tooltip = ({
  title,
  children,
  placement = "top",
  className,
  delayDuration = 300,
  disabled = false,
}: TooltipProps) => {
  if (disabled || !title) return <>{children}</>;

  return (
    <TooltipProvider delay={delayDuration}>
      <RootTooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent side={placement} className={className}>
          {title}
        </TooltipContent>
      </RootTooltip>
    </TooltipProvider>
  );
};
