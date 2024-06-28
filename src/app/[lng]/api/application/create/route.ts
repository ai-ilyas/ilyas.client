import { auth } from '@/src/auth';
import { insertApplication } from '@/src/lib/core/application/commands/insert-application';
import { IApplication } from '@/src/lib/domain/entities/application.interface';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {  
    const applicationName = await req.text();
    const session = (await auth())!;
    const id = await insertApplication({ name: applicationName} as IApplication, session.user!.id!);
    return new NextResponse(id, { status: 200 }); 
}