import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../common/Loading";
import { UserContext } from "../ContentRouter";
import { GET, POST } from "../../composables/api";
import urls from "../../composables/urls.json";
function Chat(props: any) {
    const { login } = useContext(UserContext)
    const [loading, setLoading] = useState(true) as any
    const [message, setMessage] = useState("") as any
    const [messages, setMessages] = useState<any[]>([]);

    async function fetchMessages() {
        try {
            const val = await GET(`${urls.url}/api/chat/${props.id}/chat`, login);
            if (val.success) {
                await setMessages(val.chats);
                setLoading(false);
            }
        } catch (e) {
            console.error("Error fetching messages: ", e);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [login, props.id]);

    async function sendMessage(message: string) {
        try {
            const sendData = {
                message: message,
                accident: parseInt(props.id)
            }
            const val = await POST(`${urls.url}/api/chat/${props.id}/chat`, sendData, login);
            setMessage("");
            fetchMessages();
        } catch (e) {
            console.error("Error sending message: ", e);
        }
    }
    return (
        <div className="flex flex-col bg-neutral-200 rounded-xl h-72 relative ovreflow-hidden overscroll-contain shadow-[inset_0px_0px_5px_1px_#00000024]">
            <div className="rounded-xl px-2 h-full w-full overflow-y-auto overscroll-auto space-y-2 pt-2 pb-4">
                {loading ? (<div className="w-full h-full flex items-center justify-center"><Loading /></div>) : (
                    messages.map((message: any, index: number) => (
                        <div className="flex flex-col">
                            <p className="ml-2 text-sm">{message.user.username}</p>
                            <div key={message.id} className="shadow-[0px_0px_5px_1px_#00000024] bg-neutral-100 p-2 rounded-xl">
                                {message.message}
                            </div>
                        </div>

                    ))
                )}
            </div>
            <div className="shadow-[0px_0px_5px_1px_#00000024] flex bg-neutral-100 rounded-xl w-full overflow-hidden items-center">
                <input type="text"
                    placeholder="Type a message"
                    className="bg-neutral-100 p-2 w-full rounded-xl outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                            await sendMessage(message)
                        }
                    }}
                />
                <PaperAirplaneIcon className="h-6 w-6 cursor-pointer mx-2" onClick={() => sendMessage(message)} />
            </div>
        </div>
    );
}

export default Chat;