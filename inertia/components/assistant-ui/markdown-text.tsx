import "@assistant-ui/react-markdown/styles/dot.css";

import {
  type CodeHeaderProps,
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { type FC, memo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { cn } from "@/lib/utils";

const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      className="aui-md"
      components={defaultComponents}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100">
      <span className="lowercase [&>span]:text-xs">{language}</span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const defaultComponents = memoizeMarkdownComponents({
  h1: ({ className, ...props }) => (
    <h1 className={cn("mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("mb-4 mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mb-4 mt-6 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0", className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("mb-4 mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0", className)} {...props} />
  ),
  h5: ({ className, ...props }) => (
    <h5 className={cn("my-4 text-lg font-semibold first:mt-0 last:mb-0", className)} {...props} />
  ),
  h6: ({ className, ...props }) => (
    <h6 className={cn("my-4 font-semibold first:mt-0 last:mb-0", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("mb-5 mt-5 leading-7 first:mt-0 last:mb-0", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a className={cn("text-primary hover:text-primary/80 font-medium underline underline-offset-4", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote className={cn("border-l-2 border-zinc-600 pl-6 italic text-zinc-300", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)} {...props} />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-5 border-b border-zinc-700", className)} {...props} />
  ),
  table: ({ className, ...props }) => (
    <table className={cn("my-5 w-full border-separate border-spacing-0 overflow-y-auto", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th className={cn("bg-zinc-800 px-4 py-2 text-left font-bold text-zinc-100 first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right", className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("border-b border-l border-zinc-700 px-4 py-2 text-left text-zinc-200 last:border-r [&[align=center]]:text-center [&[align=right]]:text-right", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("m-0 border-b border-zinc-700 p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg", className)} {...props} />
  ),
  sup: ({ className, ...props }) => (
    <sup className={cn("[&>a]:text-xs [&>a]:no-underline", className)} {...props} />
  ),
  pre: ({ className, ...props }) => (
    <pre className={cn("overflow-x-auto rounded-b-lg bg-zinc-950 p-4 text-zinc-100", className)} {...props} />
  ),
  code: function Code({ className, ...props }) {
    const isCodeBlock = useIsMarkdownCodeBlock();
    return (
      <code
        className={cn(!isCodeBlock && "bg-zinc-800 text-zinc-100 rounded border border-zinc-700 px-1 py-0.5 font-semibold", className)}
        {...props}
      />
    );
  },
  CodeHeader,
});
