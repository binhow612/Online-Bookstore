// test-chat.ts
import 'dotenv/config'; // Tải các biến môi trường từ file .env
import * as readline from 'readline';
import { agent } from './src/lib/agent'; // Import agent chatbot
import { Message } from './src/types'; // Import định nghĩa kiểu 'Message'

// Khởi tạo giao diện đọc/ghi trên terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Lưu trữ lịch sử cuộc trò chuyện
const messages: Message[] = [];

/**
 * Hàm đệ quy để tạo vòng lặp chat
 */
async function chatLoop() {
  rl.question('Bạn: ', async (input) => {
    // Gõ 'exit' để thoát
    if (input.toLowerCase() === 'exit') {
      console.log('Chef: Tạm biệt!');
      rl.close();
      process.exit();
    }

    const userMessage: Message = { 
      role: 'user', 
      content: input, 
      id: new Date().toISOString() // Dùng timestamp làm ID đơn giản
    };
    messages.push(userMessage);

    try {
      console.log('Chef (đang suy nghĩ)...');
      
      // Gọi trực tiếp hàm logic của agent
      // Chúng ta truyền 'null' cho user vì đang test ở terminal
      const response = await agent.ask(messages, null);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        id: new Date().toISOString() + '-response'
      };
      messages.push(assistantMessage);

      // In ra phản hồi của Chef
      console.log(`\nChef: ${response}\n`);

    } catch (error) {
      console.error('Lỗi khi gọi agent:', error);
      messages.pop(); // Xóa tin nhắn cuối nếu có lỗi
    }

    // Lặp lại vòng chat
    chatLoop();
  });
}

console.log('🤖 Bắt đầu chat với Chef (gõ "exit" để thoát).');
chatLoop();