import { Chat } from '@/src/components/chat/chat';
import { nanoid } from '@/src/lib/utils';
import { AI } from '@/src/lib/chat/actions';
import { auth } from '@/src/auth';
import { Session } from '@/src/components/chat/types';
import { getMissingKeys } from '@/src/app/[lng]/(dashboard)/dashboard/chat/actions';

export const metadata = {
  title: 'Ilyas AI'
};
export default async function ChatPage() {
  const id = nanoid();
  const session = (await auth()) as Session;
  const missingKeys = await getMissingKeys();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} missingKeys={missingKeys}></Chat>
    </AI>
  );
}
