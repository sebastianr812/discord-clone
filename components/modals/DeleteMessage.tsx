"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import qs from "query-string";

const DeleteMessageModal = () => {
  const { isOpen, onClose, data, type } = useModal();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { apiUrl, query } = data;

  const isModalOpen = isOpen && type === "deleteMessage";

  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.delete(url);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden text-black bg-white">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-center">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            The messag will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4 bg-gray-100">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
