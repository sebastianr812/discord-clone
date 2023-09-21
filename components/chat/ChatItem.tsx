"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import ActionTooltip from "../ActionTooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { ChatRequest, ChatValidator } from "@/lib/validators/createChat";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { useModal } from "@/hooks/useModalStore";

interface ChatItemProps {
  id: string;
  content: string;
  fileUrl: string | null;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

// test
const formShema = z.object({
  content: z.string().min(1),
});
//
const ChatItem: FC<ChatItemProps> = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timestamp,
}) => {
  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;

  const form = useForm<z.infer<typeof formShema>>({
    resolver: zodResolver(formShema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({
      content,
    });
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { onOpen } = useModal();

  const onSubmit = async (data: z.infer<typeof formShema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, data);

      form.reset();
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="relative flex items-center w-full p-4 transition group hover:bg-black/5">
      <div className="flex items-start w-full group gap-x-2">
        <div className="transition cursor-pointer hover:drop-shadow-md">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="text-sm font-semibold cursor-pointer hover:underline">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-sqaure bg-secondary"
            >
              <Image
                alt={content}
                src={fileUrl}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="w-10 h-10 fll-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:unerie"
              >
                PDF File
              </a>
            </div>
          )}
          {!isEditing && !fileUrl && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full pt-2 gap-x-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 border-0 border-none bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" variant="primary" disabled={isLoading}>
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute items-center hidden p-1 bg-white border rounded-sm group-hover:flex gap-x-2 -top-2 right-5 dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                onClick={() => {
                  setIsEditing(true);
                }}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
