"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { deleteSocialPost } from "@/actions/homepageActions";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SocialPostListItemProps {
  post: any;
}

const initialState = {
  error: undefined,
  message: "",
  success: false,
};

export function SocialPostListItem({ post }: SocialPostListItemProps) {
  const [deleteState, deleteAction] = useFormState(deleteSocialPost, initialState);
  const router = useRouter();

  useEffect(() => {
    if (deleteState?.success) {
      toast.success(deleteState.message);
      router.refresh();
    }
    if (deleteState?.error) {
      toast.error(deleteState.error);
    }
  }, [deleteState, router]);

  return (
    <div className="flex justify-between items-center p-4 border rounded bg-white shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {post.postLink}
      </h2>
      <div className="flex gap-4">
        <Link href={`/admin/homepage/social/${post.id}`}>
          <Button
            variant="outline"
            className="text-green-500 border-green-500 hover:bg-green-50 dark:text-green-400 dark:border-green-400"
          >
            Edit
          </Button>
        </Link>

        <DeleteConfirmationDialog onConfirm={() => {
          const form = document.getElementById(`delete-form-${post.id}`) as HTMLFormElement;
          form.requestSubmit();
        }}>
          <form id={`delete-form-${post.id}`} action={deleteAction}>
            <input type="hidden" name="postId" value={post.id} />
            <Button
              type="button"
              variant="destructive"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </Button>
          </form>
        </DeleteConfirmationDialog>
      </div>
    </div>
  );
}
