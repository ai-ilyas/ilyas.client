import { auth } from '@/src/auth';
import { updateApplication } from '@/src/lib/core/application/commands/update-application';
import { IApplication } from '@/src/lib/domain/entities/application.interface';

export async function POST(req: Request) {  
    const body = await req.json();
    const applicationPartial : Partial<IApplication> = body;
    const session = (await auth())!;
    const applicationUpdated = await updateApplication(applicationPartial ,session.user!.id!);
    return Response.json(applicationUpdated, { status: 200 }); 
}