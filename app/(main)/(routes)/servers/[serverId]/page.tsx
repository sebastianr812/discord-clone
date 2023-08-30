import { FC } from 'react'

interface pageProps {
    params: {
        serverId: string;
    }
}

const page: FC<pageProps> = ({
    params: {
        serverId
    }
}) => {
    return <div>sevrer id page</div>
}

export default page