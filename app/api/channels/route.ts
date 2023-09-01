import { MemberRole } from '.prisma/client';
import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { CreateChannelValidator } from '@/lib/validators/createChannel';
import { NextResponse } from 'next/server';
import * as z from 'zod';

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        const body = await req.json();
        const {
            name,
            type
        } = CreateChannelValidator.parse(body);

        if (!profile) {
            return new NextResponse('unauthorized', { status: 401 });
        }
        if (!serverId) {
            return new NextResponse('server id is missing', { status: 400 });
        }
        if (name === 'general') {
            return new NextResponse('cannot create a channel for general', { status: 400 });
        }
        // TODO db query for creating a channel (both admin and moderators have this functionality)
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                },
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        });
        return NextResponse.json(server);

    } catch (e) {
        if (e instanceof z.ZodError) {
            return new NextResponse('invalid data passed', { status: 400 });
        }
        return new NextResponse('internal error', { status: 500 });
    }
}