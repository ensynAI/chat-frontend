import { Message, UserMessage, UserData, Conversation, Role } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect } from "react";
import axios from "axios";

const conversationHistoryURL = "http://localhost:8000" + "/message/initialize";
const generateMessageURL = "http://localhost:8000" + "/message/generate";
const generateMessageAndFeedbackURL =
  "http://localhost:8000" + "/message/generate_with_feedback";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
}

interface Response {
  status: number;
  data: any;
}

interface GenerationResponse extends Response {
  data: ServerGeneration;
}

interface ServerGeneration {
  message: Message; // TODO: Change to BotMessage
  feedback: Message; // TODO: Change to FeedbackMessage
}

export function Chat({ selectedUser, isMobile }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>([]);
  useEffect(() => {
    getConversationHistory();
  }, []);

  const sendMessage = (newMessage: UserMessage) => {
    const updatedMessages = [...messagesState, newMessage];
    setMessages(updatedMessages);

    // generateMessage(updatedMessages);
    generateMessageAndFeedback(updatedMessages);
  };

  function getConversationHistory() {
    axios
      .get(conversationHistoryURL)
      .then((response) => {
        if (validateResponse(response)) {
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

  function generateMessageAndFeedback(messages: Message[]) {
    const params = {
      messages: messages,
    };

    axios
      .post(generateMessageAndFeedbackURL, params)
      .then((response) => {
        if (validateGenerationResponse(response)) {
          const generateMessage: Message = response.data.message;
          const feedbackMessage: Message = response.data.feedback;

          if (messages.length > 0) {
            (messages.at(-1)! as UserMessage).feedback =
              feedbackMessage.content;
          }

          setMessages([...messages, generateMessage]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function validateResponse(response: Response) {
    if (response.status === 200) {
      return true;
    } else {
      console.log(
        `An error occurred while processing the request. Status code: ${response.status}`
      );
      return false;
    }
  }

  function validateGenerationResponse(response: GenerationResponse) {
    if (
      response.status === 200 &&
      response.data.message.role === Role.Assistant &&
      response.data.feedback.role === Role.Assistant
    ) {
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
