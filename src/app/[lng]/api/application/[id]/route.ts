import { auth } from '@/src/auth';
import { getAllApplications } from '@/src/lib/core/application/queries/get-all-applications';
import { getByApplicationId } from '@/src/lib/core/application/queries/get-by-application-id';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    
    const session = (await auth())!;
    const applications = await(getAllApplications(session.user!.id!));
    const application = (await(getByApplicationId(params.id , session.user!.id!)))!;
    const index = applications.findIndex(x => x._id.toString() === params.id);
    applications[index] = { ...application};
    return NextResponse.json(applications, { status : 200 });
  }