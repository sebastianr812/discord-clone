import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { CreateServerValidator } from '@/lib/validators/createServer';
import { NextResponse } from 'next/server';
import * as z from 'zod';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        const body = await req.json();
        const {
            imageUrl,
            name
        } = CreateServerValidator.parse(body);

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        });

        return NextResponse.json(server);

    } catch (e) {
        if (e instanceof z.ZodError) {
            return new NextResponse('invalid data passed', { status: 400 });
        }
        return new NextResponse('internal error PATCH:SERVERS/SERVERID', { status: 500 });
    }
}