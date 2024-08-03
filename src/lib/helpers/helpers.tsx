import {
  ArrowRightFromLine,
  ArrowRightLeft,
  ArrowRightToLine
} from 'lucide-react';

export const directionTranslator = (value: string, t: any) => {
  switch (value) {
    case 'incoming':
      return (
        <>
          <ArrowRightToLine
            strokeWidth={1}
            size={15}
            className="inline-block"
          />{' '}
          {t('application_ownedInterfaces_incoming')}
        </>
      );
    case 'outgoing':
      return (
        <>
          <ArrowRightFromLine
            strokeWidth={1}
            size={15}
            className="inline-block"
          />{' '}
          {t('application_ownedInterfaces_outgoing')}
        </>
      );
    case 'bi-directional':
      return (
        <>
          <ArrowRightLeft strokeWidth={1} size={15} className="inline-block" />{' '}
          {t('application_ownedInterfaces_biDirectional')}
        </>
      );
    default:
      break;
  }
};
