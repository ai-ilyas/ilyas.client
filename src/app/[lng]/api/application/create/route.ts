import { auth } from '@/src/auth';
import { insertApplication } from '@/src/lib/core/application/commands/insert-application';
import { IApplication } from '@/src/lib/domain/entities/application.interface';

export async function POST(req: Request) {  
    const applicationName = await req.text();
    const session = (await auth())!;
    const application = await insertApplication({ name: applicationName} as IApplication, session.user!.id!);
    return Response.json(application, { status: 200 }); 
}