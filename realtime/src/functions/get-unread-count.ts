import { and, eq, ne, count } from "drizzle-orm";
import { db } from "@/infra/database/conn"; // Ajuste para o caminho da sua instância do Drizzle
import { chatMessage } from "@/infra/database/tables" // Ajuste para o caminho do seu schema

/**
 * Conta mensagens não lidas em um chat específico para um usuário.
 * * Lógica: Conta mensagens onde o remetente NÃO é o currentUserId
 * e o status ainda não é 'read'.
 * * @param chatId - O ID da conversa
 * @param currentUserId - O ID do usuário logado (seja Customer ou Member)
 */
export async function getUnreadCount(chatId: string, currentUserId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(chatMessage)
    .where(
      and(
        // 1. Apenas mensagens deste chat
        eq(chatMessage.chat_id, chatId),

        // 2. Mensagens que NÃO foram enviadas por mim (ne = not equal)
        ne(chatMessage.sender_id, currentUserId),

        // 3. Mensagens que ainda NÃO foram lidas
        ne(chatMessage.status, "read")
      )
    );

  return result.count;
}
