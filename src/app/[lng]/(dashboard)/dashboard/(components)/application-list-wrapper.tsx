'use client'
import { IApplication } from '@/src/lib/domain/entities/application.interface';
import CreateApplicationForm from './create-application-form';
import { ApplicationCard } from './application-card';
import { useState } from 'react';

interface ApplicationListWrapperProps {
  apps: IApplication[];
  lng: string;
}

const applicationListWrapper: React.FC<ApplicationListWrapperProps> = ({ apps, lng}) => {  
  const [ applications ] = useState(Object.values(apps));
  
  return (
    <>
        <CreateApplicationForm lng={lng} apps={ applications }></CreateApplicationForm>
        <ApplicationCard lng={lng} apps={ applications }></ApplicationCard>
    </>
  );
}

export default applicationListWrapper;