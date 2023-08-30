import { currentProfile } from "@/lib/currentProfile";
import { CreateServerValidator } from "@/lib/validators/createServer";
import { NextResponse } from "next/server";
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const profile = await currentProfile();
        const {
            imageUrl,
            name
        } = CreateServerValidator.parse(body);

        if (!profile) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        const server = await db.server.create({
            data: {
                name,
                imageUrl,
                profileId: profile.id,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {
                            name: 'general',
                            profileId: profile.id
                        }
                    ]
                },
                members: {
                    create: [
                        {
                            profileId: profile.id,
                            role: MemberRole.ADMIN
                        }
                    ]
                }
            }
        });

        return NextResponse.json(server);
    } catch (e) {
        if (e instanceof z.ZodError) {
            return new NextResponse('invalid data passed', { status: 400 });
        }
        return new NextResponse('internal error POST:SERVERS', { status: 500 });
    }
}