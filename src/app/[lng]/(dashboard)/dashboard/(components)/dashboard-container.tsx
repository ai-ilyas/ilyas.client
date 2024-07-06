'use client'
import CreateApplicationForm from './create-application-form';
import { ApplicationCard } from './application-card';
import { useAppSelector, useAppDispatch } from '@/src/lib/store/hooks';
import { useEffect } from 'react';
import { fetchApplications, selectAllApplications, selectApplicationStatus } from '@/src/lib/store/features/application/application-slice';
import SpinnerLoading from '@/src/lib/presenter/components/spinner-loading';

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
  

  if (applicationsStatus === 'loading')
  {
    return (
      <div className="top-2/4">
      <SpinnerLoading lng={lng}></SpinnerLoading>
      </div>
    );  
  }
  else if (applicationsStatus === 'succeeded')
    {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CreateApplicationForm lng={lng} apps={ applications }></CreateApplicationForm>
          <ApplicationCard lng={lng} apps={ applications }></ApplicationCard>
        </div>
      );
    }
}

export default dashboardContainer;