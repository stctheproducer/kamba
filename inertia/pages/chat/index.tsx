import { ChatIndex } from "@/types/chat";
import { Head } from "@inertiajs/react";
import { Subscription, Transmit } from '@adonisjs/transmit-client';
import { usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Chat() {
  const page = usePage<ChatIndex>();

  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [sseError, setSseError] = useState<string | null>(null);
  const subscription = useRef<Subscription | null>(null);
  const [chats, setChats] = useState([
    { id: "1", title: "Chat 1" },
    { id: "2", title: "Chat 2" },
  ]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    const transmit = new Transmit({
      baseUrl: window.location.origin
    });
    const sub = transmit.subscription(`chats/${page.props.user?.id}`);

    async function init() {
      await sub.create();
      subscription.current = sub;
    }


    async function cleanup() {
      if (subscription.current) {
        await subscription.current.delete();
      }
    }
    init();

    return () => {
      cleanup();
    };
  }, [page.props.user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setSseError(null);
      setStreamingMessage(null);

      subscription.current?.onMessage((data: any) => {
        setStreamingMessage((prev) => (prev ?? "") + data);
      });

      subscription.current?.onError(() => {
        setSseError("Failed to connect to SSE endpoint.");
        subscription.current?.delete();
      });

      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // Fetch messages for the selected chat
  };

  return (
    <div className="flex h-screen">
      <Head title="New Chat" />
      <div className="flex flex-col flex-grow">
        <div className="flex-grow p-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${index % 2 === 0 ? "bg-blue-100" : "bg-gray-100"} rounded-lg p-2`}>
                {message}
              </div>
            ))}
            {streamingMessage && (
              <div className="mb-2">
                {streamingMessage}
              </div>
            )}
            {sseError && (
              <div className="text-red-500">
                {sseError}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="p-4 flex items-center">
          <Input
            type="text"
            placeholder="Enter your message"
            value={newMessage}
            onChange={handleInputChange}
            className="flex-grow mr-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
        <pre>{JSON.stringify(page.props.user, null, 2)}</pre>
      </div>
    </div>
  );
}
