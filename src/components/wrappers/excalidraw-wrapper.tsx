'use client';
import { useCallback } from 'react';
import { Excalidraw } from '@/packages/excalidraw';
import { AppMainMenu } from '../../excalidraw-app/components/AppMainMenu';
import { useAtom } from 'jotai';
import { shareDialogStateAtom } from '@/src/excalidraw-app/share/ShareDialog';
import { useAtomWithInitialValue } from '@/packages/excalidraw/jotai';
import { isCollaboratingAtom } from '@/src/excalidraw-app/collab/Collab';
import { isCollaborationLink } from '../../excalidraw-app/data';
import { isRunningInIframe } from '@/packages/excalidraw/utils';
import { appThemeAtom } from '../../excalidraw-app/useHandleAppTheme';

const ExcalidrawWrapper: React.FC = () => {
  const isCollabDisabled = isRunningInIframe();
  const [, setShareDialogState] = useAtom(shareDialogStateAtom);
  const onCollabDialogOpen = useCallback(
    () => setShareDialogState({ isOpen: true, type: 'collaborationOnly' }),
    [setShareDialogState]
  );
  const [isCollaborating] = useAtomWithInitialValue(isCollaboratingAtom, () => {
    return isCollaborationLink(window.location.href);
  });
  const [appTheme, setAppTheme] = useAtom(appThemeAtom);

  return (
    <>
      <Excalidraw>
        <AppMainMenu
          onCollabDialogOpen={onCollabDialogOpen}
          isCollaborating={isCollaborating}
          isCollabEnabled={!isCollabDisabled}
          theme={appTheme}
          setTheme={(theme) => setAppTheme(theme)}
        />
      </Excalidraw>
    </>
  );
};

export default ExcalidrawWrapper;
