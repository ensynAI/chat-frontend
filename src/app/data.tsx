export const userDataNew = {
  conversation: {
    // senderAvatar?
    // receipentAvatar?
    messages: [
      {
        id: 1,
        role: "assistant",
        content: "Hi, the microwave I bought last week stopped working.",
      },
    ],
  },
};

export const userData = [
  {
    id: 1,
    avatar: "/User1.png",
    messages: [],
    name: "Jane Doe",
  },
  {
    id: 2,
    avatar: "/User2.png",
    name: "John Doe",
  },
  {
    id: 3,
    avatar: "/User3.png",
    name: "Elizabeth Smith",
  },
  {
    id: 4,
    avatar: "/User4.png",
    name: "John Smith",
  },
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
  id: 5,
  avatar: "/LoggedInUser.jpg",
  name: "Jakob Hoeg",
};

export type LoggedInUserData = typeof loggedInUserData;

export interface User {
  id: number;
  avatar: string;
  messages: Message[];
  name: string;
}

export interface Conversation {
  messages: Message[];
}

export interface Message {
  id?: number;
  role: string;
  content: string;
  name?: string;
  avatar?: string;
}

export interface UserMessage extends Message {
  role: Role.User;
  feedback?: string;
}

export interface BotMessage extends Message {
  role: Role.Assistant;
}

export interface FeedbackMessage extends Message {
  role: Role.Assistant;
}

export enum Role {
  User = "user",
  Assistant = "assistant",
}

export enum UserThumbnail {
  botImage = "/User1.png",
  userImage = "/LoggedInUser.jpg",
}
