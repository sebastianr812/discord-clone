'use client';

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FC } from "react";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: 'messageFile' | 'serverImage';
}
const FileUpload: FC<FileUploadProps> = ({
    endpoint,
    onChange,
    value
}) => {

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].fileUrl)
            }} />
    );
}

export default FileUpload;