import { prisma } from "@/lib/db/prisma";
import { MessageRole } from "@prisma/client";

// Create a new conversation
export async function createConversation(userId: string, title?: string) {
  return await prisma.conversation.create({
    data: {
      userId,
      title,
    },
  });
}

// Add a message to a conversation
export async function addMessage(
  conversationId: string,
  content: string,
  role: MessageRole,
) {
  return await prisma.message.create({
    data: {
      content,
      role,
      conversationId,
    },
  });
}

// Get a conversation with its messages
export async function getConversation(conversationId: string) {
  return await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}

// Create a new user
export async function createUser(name?: string) {
  return await prisma.user.create({
    data: {
      name,
    },
  });
}

// const conversation = await createConversation(userId, "Chat about AI");
// const message = await addMessage(conversation.id, "Hello AI!", "user");
// const fullConversation = await getConversation(conversation.id);