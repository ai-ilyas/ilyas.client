import { auth } from '@/src/auth';
import { getAllApplications } from '@/src/lib/core/application/queries/get-all-applications';

export async function GET(req: Request) {  
    const session = (await auth())!;
    const applications = await(getAllApplications(session.user!.id!));
    return Response.json(applications, { status : 200 });
}