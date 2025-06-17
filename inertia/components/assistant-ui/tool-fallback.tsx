import { ToolCallContentPartComponent } from "@assistant-ui/react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export const ToolFallback: ToolCallContentPartComponent = ({
  toolName,
  argsText,
  result,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div className="mb-4 flex w-full flex-col gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 py-3">
      <div className="flex items-center gap-2 px-4">
        <CheckIcon className="size-4 text-green-400" />
        <p className="text-zinc-100">
          Used tool: <b className="text-white">{toolName}</b>
        </p>
        <div className="flex-grow" />
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="text-zinc-300 hover:text-white">
          {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col gap-2 border-t border-zinc-700 pt-2">
          <div className="px-4">
            <pre className="whitespace-pre-wrap text-zinc-200 text-sm bg-zinc-900 p-2 rounded">{argsText}</pre>
          </div>
          {result !== undefined && (
            <div className="border-t border-dashed border-zinc-600 px-4 pt-2">
              <p className="font-semibold text-zinc-100">Result:</p>
              <pre className="whitespace-pre-wrap text-zinc-200 text-sm bg-zinc-900 p-2 rounded">
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
