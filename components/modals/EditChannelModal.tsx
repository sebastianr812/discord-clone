'use client';

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { zodResolver } from '@hookform/resolvers/zod';
import qs from 'query-string';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from 'axios';
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModalStore";
import { CreateChannelRequest, CreateChannelValidator } from "@/lib/validators/createChannel";
import { ChannelType } from ".prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";

const EditChannelModal = () => {

    const router = useRouter();

    const {
        isOpen,
        onClose,
        onOpen,
        data,
        type
    } = useModal();

    const { server, channel } = data;

    const isModalOpen = isOpen && type === 'editChannel';

    const form = useForm({
        resolver: zodResolver(CreateChannelValidator),
        defaultValues: {
            name: '',
            type: channel?.type || ChannelType.TEXT
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: CreateChannelRequest) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            });
            await axios.patch(url, data);
            form.reset();
            router.refresh();
            onClose();
        } catch (e) {
            console.log(e);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    useEffect(() => {
        if (channel) {
            form.setValue('name', channel.name);
            form.setValue('type', channel.type);
        }
    }, [form, channel]);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Edit a Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter channel name"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={form.control}
                                name='type'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                    <SelectValue placeholder='Select a channel type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem key={type} value={type} className="capitalize">
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button
                                disabled={isLoading}
                                variant='primary'>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default EditChannelModal;