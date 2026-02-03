"use client"

import { PiThumbsUp, PiThumbsUpFill } from 'react-icons/pi'
import { Button } from '../ui/button'
import { useState } from 'react';
import { likeArticle, unlikeArticle } from '@/actions/article';
import { toast } from 'sonner';

type LikeButtonProps = {
    articleId: string;
    initialLikes: number;
    initialIsLiked?: boolean;
}

export default function LikeButton({
    articleId, initialLikes, initialIsLiked = false
}: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        if (isLoading) return;

        setIsLoading(true);

        // Optimistic update
        const previousLikes = likes;
        const previousIsLiked = isLiked;
        setLikes(isLiked ? likes - 1 : likes + 1);
        setIsLiked(!isLiked);

        try {
            const result = isLiked
                ? await unlikeArticle(articleId)
                : await likeArticle(articleId);

            if (!result.data) {
                setLikes(previousLikes);
                setIsLiked(previousIsLiked);
                toast.error(result.error || 'Failed to update like');
            } else {
                setLikes(result.data.likes);
            }
        } catch (error) {
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleLike}
                disabled={isLoading}
                variant="ghost"
                type="button"
                className="p-2!"
                aria-label={isLiked ? 'Unlike article' : 'Like article'}
            >
                {isLiked ? (
                    <PiThumbsUpFill className="size-6 text-red-300" />
                ) : (
                    <PiThumbsUp className="size-6" />
                )}
            </Button>
        </div>
    );
}
