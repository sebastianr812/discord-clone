import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react'

interface pageProps {
    params: {
        serverId: string;
    }
}

const page: FC<pageProps> = async ({
    params: {
        serverId
    }
}) => {

    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: 'general'
                },
                orderBy: {
                    createdAt: 'asc'
                }
            },
        }
    });

    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== 'general') {
        return null;
    }

    return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
}

export default page