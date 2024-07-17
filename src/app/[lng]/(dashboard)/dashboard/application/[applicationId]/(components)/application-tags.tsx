'use client';
import { api } from '@/convex/_generated/api';
import { IApplication } from '@/convex/applications';
import { useTranslation } from '@/src/app/i18n/client';
import CustomTags from '@/src/components/custom-tags';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useQuery } from 'convex/react';

interface ApplicationTagsProps {
  app: IApplication;
  lng: string;
  apps: IApplication[];
}

const applicationTags: React.FC<ApplicationTagsProps> = ({
  app,
  lng,
  apps
}) => {
  const { t } = useTranslation(lng);    
  const tags = useQuery(api.tags.list, { type: 0});

  return (
        <Card>
          <CardHeader>
            <div className="flex items-start">
              <CardTitle>{t('common_tags')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CustomTags lng={lng} application={app}></CustomTags>
          </CardContent>
        </Card>
  );
};

export default applicationTags;
