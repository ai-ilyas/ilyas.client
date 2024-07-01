import { auth } from '@/src/auth';
import { updateApplication } from '@/src/lib/core/application/commands/update-application';
import { IApplication } from '@/src/lib/domain/entities/application.interface';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {  
    const body = await req.json();
    const id : string = body.id;
    const applicationPartial : Partial<IApplication> = body.values;
    const session = (await auth())!;
    const count = await updateApplication( id, applicationPartial ,session.user!.id!);
    return new NextResponse(`${count} updates.`, { status: 200 }); 
}