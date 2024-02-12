import {Message, UserData, Role, UserThumbnail, UserMessage} from "@/app/data";
import {cn} from "@/lib/utils";
import React, {useRef, useState} from "react";
import {Avatar, AvatarImage} from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import {AnimatePresence, motion} from "framer-motion";
import Link from "next/link";
import {Button, buttonVariants} from "../ui/button";
import {Sparkles} from "lucide-react";

interface ChatListProps {
    messages?: Message[];
    selectedUser : UserData;
    sendMessage : (newMessage : UserMessage) => void;
    isMobile : boolean;
}

export function ChatList({messages, selectedUser, sendMessage, isMobile} : ChatListProps) {
    const messagesContainerRef = useRef < HTMLDivElement > (null);
    const [visibleMessages,
        setVisibleMessages] = useState < {
        [key : number]: boolean;
    } > ({});

    const toggleAiFeedback = (index : number) => {
        setVisibleMessages((prevVisibleMessages) => ({
            ...prevVisibleMessages,
            [index]: !prevVisibleMessages[index], // Toggle visibility
        }));
    };

    React.useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
            <div
                ref={messagesContainerRef}
                className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
                <AnimatePresence>
                    {messages
                        ?.map((message, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{
                                opacity: 0,
                                scale: 1,
                                y: 50,
                                x: 0
                            }}
                                animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                x: 0
                            }}
                                exit={{
                                opacity: 0,
                                scale: 1,
                                y: 1,
                                x: 0
                            }}
                                transition={{
                                opacity: {
                                    duration: 0.1
                                },
                                layout: {
                                    type: "spring",
                                    bounce: 0.3,
                                    duration: messages.indexOf(message) * 0.05 + 0.2
                                }
                            }}
                                style={{
                                originX: 0.5,
                                originY: 0.5
                            }}
                                className={cn("flex flex-col gap-2 p-4 whitespace-pre-wrap", message.role === Role.User
                                ? "items-end"
                                : "items-start")}>
                                <div className="flex gap-3 items-center">
                                    {message.role === Role.Assistant && (
                                        <Avatar className="flex justify-center items-center">
                                            <AvatarImage src={UserThumbnail.botImage} alt={"Bot"} width={6} height={6}/>
                                        </Avatar>
                                    )}

                                    {/* Toggle AI feedback button */}
                                    {message.role === Role.User && (
                                        <Link
                                            href="#"
                                            className={cn(buttonVariants({variant: "ghost", size: "icon"}), "h-9 w-9", "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-whi" +
                                                "te shrink-0")}
                                            onClick={(e) => toggleAiFeedback(index)}>
                                            <Sparkles size={20} className="text-muted-foreground"/>
                                        </Link>
                                    )}

                                    <div className="flex flex-col">

                                        <span className=" bg-accent p-3 rounded-md max-w-xs pb-2">

                                            {message.content}
                                        </span>

                                        {/* Add feedback only to message on the right side */}
                                        {message.name !== selectedUser.name && ( <> {
                                            visibleMessages[index] && "feedback" in message && (
                                                <span className=" bg-purple-200 p-3 rounded-md max-w-xs mt-2">
                                                    {(message !as UserMessage).feedback}
                                                </span>
                                            )
                                        } </>
                                        )}
                                    </div>

                                    {message.role === Role.User && (
                                        <Avatar className="flex justify-center items-center">
                                            <AvatarImage src={UserThumbnail.userImage} alt={"User"} width={6} height={6}/>
                                        </Avatar>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                </AnimatePresence>
            </div>
            <ChatBottombar sendMessage={sendMessage} isMobile={isMobile}/>
        </div>
    );
}
