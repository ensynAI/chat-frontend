import { Message, UserData, Conversation } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect } from "react";
import axios from "axios";

const conversationHistoryURL = "http://localhost:8000" + "/message/initialize";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
}

interface ServerResponse {
  status: number;
  data: ConversationData;
}

interface ConversationData {
  conversation: Conversation;
}

export function Chat({ selectedUser, isMobile }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>([]);
  useEffect(() => {
    getConversationHistory();
  }, []);

  function getConversationHistory() {
    axios
      .get(conversationHistoryURL)
      .then((response) => validateConversationHistory(response))
      .catch((err) => {
        console.log(err);
      });
  }

  function validateConversationHistory(response: ServerResponse) {
    if (response.status === 200) {
      const messages: Message[] = response.data.conversation.messages;
      setMessages(messages);
    } else {
      setMessages([]);
    }
  }

  const sendMessage = (newMessage: Message) => {
    setMessages([...messagesState, newMessage]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
