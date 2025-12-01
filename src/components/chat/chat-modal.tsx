"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/types";
import {
  CloseButton,
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Bot, MessageSquareText, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { outdent } from "outdent";
import { useEffect, useRef, useState } from "react";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "./chat-context";

const remarkPlugins = [remarkGfm];

const components: Components = {
  // [!code change] Sửa p thành div để tránh lỗi Hydration khi chứa thẻ img (là div)
  p: (props) => <div className="mb-2 text-sm leading-relaxed last:mb-0" {...props} />,
  ul: (props) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
  li: (props) => <li className="text-sm" {...props} />,
  h1: (props) => <h1 className="text-lg font-bold mb-2 text-[#4E3B31]" {...props} />,
  h2: (props) => <h2 className="text-base font-bold mb-2 text-[#4E3B31]" {...props} />,
  h3: (props) => <h3 className="text-sm font-bold mb-2 text-[#4E3B31]" {...props} />,
  img: (props) => (
    <div className="relative mt-2 mb-3 rounded-lg overflow-hidden border border-[#8B6B4F]/20 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...props} className="w-full h-auto object-cover" alt={props.alt || "Image"} />
    </div>
  ),
  a: (props) => {
    const isInternal = props.href?.startsWith("/");
    if (isInternal) {
      return (
        <Link
          className="inline-block mt-2 mb-1 px-4 py-2 bg-white border border-[#8B6B4F]/30 rounded-lg shadow-sm text-[#8B6B4F] font-medium text-sm hover:bg-[#F5EDE3] hover:border-[#8B6B4F] transition-all w-full text-center md:w-auto"
          {...props}
        >
           🔗 {props.children}
        </Link>
      );
    }
    return (
      <a
        className="text-[#8B6B4F] underline hover:text-[#6d543e] font-medium transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
};

const MessageMarkdown = ({ children }: { children: string }) => (
  <Markdown remarkPlugins={remarkPlugins} components={components}>
    {children}
  </Markdown>
);

const defaultMessage = outdent`
  Xin chào! Tôi là trợ lý AI của The Book Haven. 🤖
  
  Tôi có thể giúp bạn:
  - Tìm sách theo nội dung, cảm xúc
  - Gợi ý sách hay
  - Giải đáp về đơn hàng & chính sách
  
  Bạn đang tìm kiếm điều gì hôm nay?
`;

function AssistantMessageBlock({
  message,
  isLoading,
}: {
  message: Message;
  isLoading?: boolean;
}) {
  return (
    <div className="flex gap-3 self-start w-full max-w-[90%]">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#8B6B4F] to-[#6d543e] flex items-center justify-center text-white shadow-sm mt-1">
        <Bot className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[10px] font-medium text-gray-500 ml-1">AI Assistant</span>
        <div className="bg-white border border-[#8B6B4F]/10 text-[#4E3B31] rounded-2xl rounded-tl-none px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {isLoading ? (
            <div className="flex items-center gap-1.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#8B6B4F]/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-[#8B6B4F]/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-[#8B6B4F]/60 rounded-full animate-bounce" />
            </div>
          ) : (
            <MessageMarkdown>{message.content}</MessageMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

function UserMessageBlock({ message }: { message: Message }) {
  return (
    <div className="self-end max-w-[85%]">
      <div className="bg-[#8B6B4F] text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-md">
        <MessageMarkdown>{message.content}</MessageMarkdown>
      </div>
    </div>
  );
}

function ChatModalContent({ close }: { close: () => void }) {
  const [value, setValue] = useState("");
  const isValid = value.trim().length > 0;
  const { messages, ask, loading } = useChat();
  
  // [!code change] Thay đổi cách scroll: Sử dụng ref vào container thay vì element cuối cùng
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // [!code change] Hàm scroll an toàn hơn, không gây scroll trang ngoài
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    const query = value.trim();
    setValue("");
    await ask(query);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, []);

  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      close();
    }
  }, [pathname, close]);

  return (
    <div className="flex flex-col w-full h-full bg-[#F9F5F1] shadow-2xl rounded-xl overflow-hidden border border-[#4E3B31]/10">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#4E3B31]/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-[#F5EDE3] rounded-full flex items-center justify-center border border-[#8B6B4F]/20 text-[#8B6B4F]">
               <Bot className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#4E3B31] font-serif">AI Support</h2>
            <div className="flex items-center gap-1">
               <span className="text-xs text-green-600 font-medium">● Online</span>
               <span className="text-xs text-gray-400">•</span>
               <span className="text-xs text-gray-500">Always ready to help</span>
            </div>
          </div>
        </div>
        <CloseButton aria-label="Close chat" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <XMarkIcon className="w-6 h-6" />
        </CloseButton>
      </div>

      {/* MESSAGES AREA */}
      <div 
        // [!code change] Gắn ref vào container để điều khiển scroll tại đây
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-[#8B6B4F]/20 scrollbar-track-transparent"
      >
        {!messages.length && (
           <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
              <div className="w-16 h-16 bg-[#8B6B4F]/10 rounded-full flex items-center justify-center">
                 <Sparkles className="w-8 h-8 text-[#8B6B4F]" />
              </div>
              <p className="text-sm text-[#4E3B31]">Bắt đầu trò chuyện để nhận gợi ý sách!</p>
           </div>
        )}
        
        {messages.length === 0 && (
             <AssistantMessageBlock
              message={{
                id: "default",
                content: defaultMessage,
                role: "assistant",
              }}
            />
        )}

        {messages.map((message) =>
          message.role === "assistant" ? (
            <AssistantMessageBlock message={message} key={message.id} />
          ) : (
            <UserMessageBlock message={message} key={message.id} />
          )
        )}
        
        {loading && (
          <AssistantMessageBlock
            message={{ id: "loading", content: "", role: "assistant" }}
            isLoading
          />
        )}
        {/* [!code change] Đã xóa thẻ div dummy scroll ở đây */}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t border-[#4E3B31]/10">
        <form className="relative flex items-end gap-2 bg-[#F5EDE3] p-2 rounded-xl border border-transparent focus-within:border-[#8B6B4F]/30 focus-within:bg-white transition-all" onSubmit={onSubmit}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 text-[#4E3B31] placeholder:text-gray-400 max-h-32"
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="submit"
            className={cn(
              "p-2 rounded-lg text-white transition-all duration-200",
              isValid 
                ? "bg-[#8B6B4F] hover:bg-[#6d543e] shadow-md translate-y-0" 
                : "bg-gray-300 cursor-not-allowed translate-y-0"
            )}
            disabled={!isValid || loading}
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
        <div className="text-center mt-2">
           <p className="text-[10px] text-gray-400">AI có thể mắc lỗi. Vui lòng kiểm tra thông tin quan trọng.</p>
        </div>
      </div>
    </div>
  );
}

function ChatPopoverLogic() {
  return (
    <Popover className="relative z-50">
      {({ open, close }) => {
        // Vẫn giữ logic khóa body scroll để tránh overscroll trên mobile
        // eslint-disable-next-line
        useEffect(() => {
          if (open) {
            document.body.style.overflow = "hidden";
          } else {
            document.body.style.overflow = "";
          }
          return () => {
            document.body.style.overflow = "";
          };
        }, [open]);

        return (
          <>
            <PopoverButton 
                className={cn(
                    "fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(139,107,79,0.4)] z-50 hover:scale-110 focus:outline-none",
                    open ? "bg-white text-[#8B6B4F] rotate-90" : "bg-[#8B6B4F] text-white"
                )}
            >
               {open ? <XMarkIcon className="w-8 h-8" /> : <MessageSquareText className="w-8 h-8" />}
               
               {!open && (
                 <span className="absolute top-0 right-0 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                 </span>
               )}
            </PopoverButton>

            <PopoverBackdrop
              transition
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] transition duration-200 ease-out data-[closed]:opacity-0 z-40"
            />

            <PopoverPanel
              anchor={{
                to: "top end",
                gap: 16,
              }}
              className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] h-[600px] max-h-[80vh] md:w-[400px] flex flex-col transition duration-300 ease-in-out data-[closed]:translate-y-12 data-[closed]:scale-95 data-[closed]:opacity-0 z-50 origin-bottom-right shadow-2xl rounded-2xl focus:outline-none"
              transition
            >
              <ChatModalContent close={close} />
            </PopoverPanel>
          </>
        );
      }}
    </Popover>
  );
}

export function ChatModal() {
  return <ChatPopoverLogic />;
}