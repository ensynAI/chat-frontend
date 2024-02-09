import { Message, UserData, Conversation, Role } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect } from "react";
import axios from "axios";

const conversationHistoryURL = "http://localhost:8000" + "/message/initialize";
const generateMessageURL = "http://localhost:8000" + "/message/generate";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
}

interface ConversationHistoryResponse {
  status: number;
  data: ConversationData;
}

interface GenerationResponse {
  status: number;
  data: ServerGeneration;
}

interface ConversationData {
  conversation: Conversation;
}

interface ServerGeneration {
  message: Message; // TODO: Change to BotMessage
}

// export interface ServerGeneration {
//   generatedMessage: Message; // TODO: Change to BotMessage
//   feedbackMessage: Message; // TODO: Change to FeedbackMessage
// }

export function Chat({ selectedUser, isMobile }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>([]);
  useEffect(() => {
    getConversationHistory();
  }, []);

  const sendMessage = (newMessage: Message) => {
    const updatedMessages = [...messagesState, newMessage];
    setMessages(updatedMessages);

    console.log("updatedMessages:", updatedMessages);
    // TODO: Send request to backend
    generateMessage(updatedMessages);
    // generateMessageAndFeedback(updatedMessages);
    // const generatedMessage: BotMessage = ;
    // const feedbackMessage: FeedbackMessagem = ;

    // setMessages([...messagesState, generatedMessage, feedbackMessage]);
  };

  function getConversationHistory() {
    axios
      .get(conversationHistoryURL)
      .then((response) => {
        if (validateConversationHistory(response)) {
          const messages: Message[] = response.data.conversation.messages;
          setMessages(messages);
        } else {
          setMessages([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function generateMessage(messages: Message[]) {
    const params = {
      messages: messages,
    };

    axios
      .post(generateMessageURL, params)
      .then((response) => {
        if (validateGeneratedMessage(response)) {
          const generateMessage: Message = response.data.message;
          setMessages([...messages, generateMessage]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function validateConversationHistory(response: ConversationHistoryResponse) {
    if (response.status === 200) {
      return true;
    } else {
      console.log(
        `An error occurred while processing the request. Status code: ${response.status}`
      );
      return false;
    }
  }

  function validateGeneratedMessage(response: GenerationResponse) {
    if (
      response.status === 200 &&
      response.data.message.role === Role.Assistant
    ) {
      return true;
    } else {
      console.log(
        `An error occurred while processing the request. Status code: ${response.status}`
      );
      return false;
    }
  }

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
