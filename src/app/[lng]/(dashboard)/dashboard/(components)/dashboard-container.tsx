'use client'
import CreateApplicationForm from './create-application-form';
import { ApplicationCard } from './application-card';
import SpinnerLoading from '@/src/lib/presenter/components/spinner-loading';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface ApplicationListWrapperProps {
  lng: string;
}

const dashboardContainer: React.FC<ApplicationListWrapperProps> = ({ lng}) => {  
  const applications = useQuery(api.applications.list);

  if (applications == undefined)
  {
    return (
      <div className="top-2/4">
        <SpinnerLoading lng={lng}></SpinnerLoading>       
      </div>
    );  
  }
  else
  {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">        
          <CreateApplicationForm lng={lng} apps={ applications! }></CreateApplicationForm>
          <ApplicationCard lng={lng} apps={ applications! }></ApplicationCard>         
      </div>
    );      
  }

}

export default dashboardContainer;