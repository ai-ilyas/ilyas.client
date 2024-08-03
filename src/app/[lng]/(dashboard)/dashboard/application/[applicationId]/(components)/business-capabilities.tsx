'use client';
import { IApplication } from '@/convex/applications';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card';
import CustomApplicationTags from '@/src/components/custom-application-tags';
import { useTranslation } from '@/src/app/i18n/client';

interface BusinessCapabilitiesFormProps {
  app: IApplication;
  lng: string;
}

const businessCapabilities: React.FC<BusinessCapabilitiesFormProps> = ({
  app,
  lng
}) => {
  const { t } = useTranslation(lng);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start">
          <CardTitle>
            {t('application_businessCapabilities_businessCapabilities')}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <CustomApplicationTags
            applicationId={app!._id}
            tags={app!.tags!}
            type={1}
            // #100 CLIENT SERVER Maximum Application tag per application is 10
            maxNumber={10}
            lng={lng}
          ></CustomApplicationTags>
        </div>
      </CardContent>
    </Card>
  );
};

export default businessCapabilities;
