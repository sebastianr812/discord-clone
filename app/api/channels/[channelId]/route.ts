import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { CreateChannelValidator } from "@/lib/validators/createChannel";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!profile) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        if (!params.channelId) {
            return new NextResponse('channelId is required', { status: 400 });
        }
        if (!serverId) {
            return new NextResponse('serverId is required', { status: 400 })
        }

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
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: 'general'
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (e) {
        console.log('DELETE:CHANNELID', e);
        return new NextResponse('internal error', { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        const body = await req.json();
        // using validator for creating channel because its same schema
        const {
            name,
            type
        } = CreateChannelValidator.parse(body);
        if (!profile) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        if (!params.channelId) {
            return new NextResponse('channelId is required', { status: 400 });
        }
        if (!serverId) {
            return new NextResponse('serverId is required', { status: 400 })
        }
        if (name === 'general') {
            return new NextResponse('cannot edit general channel', { status: 400 });
        }

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
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: 'general'
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (e) {
        console.log('PATCH:CHANNELID', e);
        return new NextResponse('internal error', { status: 500 });
    }
}