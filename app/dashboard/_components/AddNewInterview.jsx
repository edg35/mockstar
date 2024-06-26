"use client"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useState } from 'react';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
  return (
    <div>
      <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm transition-all" onClick={() => setOpenDialog(true)}>
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
                <div className="flex gap-5 justify-end my-5">
                    <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancle</Button>
                    <Button>Start Interview</Button>
                </div>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewInterview
