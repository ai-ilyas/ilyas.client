'use client'
import CreateApplicationForm from './create-application-form';
import { ApplicationCard } from './application-card';
import { useAppSelector, useAppDispatch } from '@/src/lib/store/hooks';
import { useEffect } from 'react';
import { fetchApplications, selectAllApplications, selectApplicationStatus } from '@/src/lib/store/features/application/application-slice';

interface ApplicationListWrapperProps {
  lng: string;
}

const dashboardContainer: React.FC<ApplicationListWrapperProps> = ({ lng}) => {  
  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectAllApplications);
  const applicationsStatus = useAppSelector(selectApplicationStatus);

  useEffect(() => {
    if (applicationsStatus === 'initial') dispatch(fetchApplications())
  }, [dispatch])
  
  return (
    <>
        <CreateApplicationForm lng={lng} apps={ applications }></CreateApplicationForm>
        <ApplicationCard lng={lng} apps={ applications }></ApplicationCard>
    </>
  );
}

export default dashboardContainer;