import { IApplication } from "@/convex/applications";
import { z } from "zod";

export const applicationNameDefinition = (t: any, apps: IApplication[]) => z
    .string()
    // #040 CLIENT SERVER Application name length should be between 3 and 50 characters 
    .min(3, { message: t("common_error_min", { length: "3" }) })
    .max(50, { message: t("common_error_max", { length: "50" }) })
    // #041 CLIENT SERVER the combination Application name/userId must be unique 
    .refine((val) => !apps.some((x) => x.name === val), {
        message: t("dashboard_home_applicationNameAlreadyExists"),
      });

export const applicationDescriptionDefinition = (t: any) => z
    .string()
    // #050 CLIENT SERVER Application description length should be lower than 500 characters 
    .max(500, { message: t('common_error_max', { length: '500' }) })
    .optional();

export const applicationTechnicalOwnerDefinition = (t: any) => z
    .string()
    // #070 CLIENT SERVER Fields length for Technical Owner, Business Owner and NumberOfUsers should be 50 characters maximum
    .max(50, { message: t('common_error_max', { length: '50' }) })
    .optional();

export const applicationBusinessOwnerDefinition = (t: any) => applicationTechnicalOwnerDefinition(t);
export const applicationNumberOfUsersDefinition = (t: any) => applicationTechnicalOwnerDefinition(t);