import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse('serverId needed to update invite code', { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: uuidv4()
            }
        });

        return NextResponse.json(server);
    } catch (e) {
        console.log('[SERVER_ID_PATCH', e);
        return new NextResponse('internal error', { status: 500 });
    }
}