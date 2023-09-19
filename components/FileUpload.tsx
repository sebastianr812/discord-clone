"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}
const FileUpload: FC<FileUploadProps> = ({ endpoint, onChange, value }) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative w-20 h-20">
        <Image fill src={value} alt="Uploaded photo" className="rounded-full" />
        <button
          type="button"
          className="absolute top-0 right-0 p-1 text-white rounded-full shadow-sm bg-rose-500"
          onClick={() => onChange("")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="w-10 h-10 fll-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:unerie"
        >
          {value}
        </a>
        <button
          type="button"
          className="absolute p-1 text-white rounded-full shadow-sm -right-2 -top-2 bg-rose-500"
          onClick={() => onChange("")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(e: Error) => {
        console.log(e);
      }}
    />
  );
};

export default FileUpload;
