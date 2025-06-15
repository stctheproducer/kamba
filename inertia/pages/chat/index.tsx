import { ChatIndex } from "@/types/chat";
import { Head } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function Chat() {
  const page = usePage<ChatIndex>()


  return (
    <>
      <Head title="New Chat" />
      <div>Chat</div>
      <pre>{JSON.stringify(page.props.user, null, 2)}</pre>
    </>
  )
}