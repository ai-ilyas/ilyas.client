import { IInterface } from '@/convex/interfaces';
import { z } from 'zod';

export const interfaceNameDefinition = (t: any, apps: IInterface[]) =>
  z
    .string()
    // #040 CLIENT SERVER Interface name length should be between 3 and 50 characters
    .min(3, { message: t('common_error_min', { length: '3' }) })
    .max(50, { message: t('common_error_max', { length: '50' }) })
    // #050 CLIENT SERVER the combination Interface/userId must be unique
    .refine((val) => !apps.some((x) => x.name === val), {
      message: t('dashboard_home_applicationNameAlreadyExists')
    })
    .optional()
    .or(z.literal(''));

export const interfaceDescriptionDefinition = (t: any) =>
  z
    .string()
    // #100 CLIENT SERVER Interface description length should be lower than 1000 characters
    .max(500, { message: t('common_error_max', { length: '1000' }) })
    .optional();

export const interfaceDirectionDefinition = (t: any) =>
  z
    .string()
    .min(1, { message: t('common_required') })
    .or(z.literal('incoming'))
    .or(z.literal('outgoing'))
    .or(z.literal('bi-directional'));

export const interfaceItComponentDefinition = z.string().optional();

export const interfaceDataObjectDefinition =
  interfaceItComponentDefinition.optional();

export const interfaceVolumetryDefinition =
  interfaceItComponentDefinition.optional();

export const interfaceFrequenceDefinition = z
  .union([
    z.literal('hourly'),
    z.literal('daily'),
    z.literal('weekly'),
    z.literal('monthly'),
    z.literal('yearly'),
    z.literal('on demand'),
    z.literal('real-time')
  ])
  .optional();
