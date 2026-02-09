'use client';

import { useState } from "react";
import { searchTags } from "@/actions/tag"; // You'll need to create this
import ArticleListInfinite from "@/components/article/article-list-infinite";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { toast } from "sonner";
import { searchUsers } from "@/actions/profile";
import { UserProfile } from "@/lib/types";
import TagSearchResult from "./tag-search-result";
import UserSearchResult from "./user-search-result";
import { twMerge } from "tailwind-merge";

type SearchType = 'articles' | 'tags' | 'users';

interface SearchResultProps {
    query: string;
    initialArticles: any[];
    initialHasMore: boolean;
    initialArticleCounts: number;

}

export default function SearchResultClient({
    query,
    initialArticles,
    initialHasMore,
    initialArticleCounts
}: SearchResultProps) {
    const [activeTab, setActiveTab] = useState<SearchType>('articles');
    const [isLoading, setIsLoading] = useState(false);

    // State for each search type
    const [articlesData, setArticlesData] = useState({
        items: initialArticles,
        hasMore: initialHasMore,
        isLoaded: true,
        count: initialArticleCounts
    });
    const [tagsData, setTagsData] = useState({
        items: [] as string[],
        hasMore: false,
        isLoaded: false,
        count: 0
    });
    const [userData, setUserData] = useState({
        items: [] as UserProfile[],
        hasMore: false,
        isLoaded: false,
        count: 0
    });

    const handleTabChange = async (tab: SearchType) => {
        setActiveTab(tab);

        // If data already loaded, don't fetch again
        if (tab === 'tags' && tagsData.items.length > 0) return;
        if (tab === 'users' && userData.items.length > 0) return;
        if (tab === 'articles') return; // Already loaded initially

        setIsLoading(true);

        try {
            if (tab === 'tags') {
                const result = await searchTags(query);
                if (result.success) {
                    setTagsData({
                        items: result.data.tags,
                        hasMore: false,
                        isLoaded: true,
                        count: result.data.tags.length

                    });
                } else {
                    toast.error(result.error);
                }
            } else if (tab === 'users') {
                const result = await searchUsers(query);
                if (result.success) {
                    setUserData({
                        items: result.data!.users,
                        hasMore: false,
                        isLoaded: true,
                        count: result.data!.users.length
                    });
                } else {
                    toast.error(result.error);
                }
            }
        } catch (error) {
            toast.error("Failed to load search results");
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <Item variant="outline">
                    <ItemContent className="items-center">
                        <ItemTitle>Loading...</ItemTitle>
                    </ItemContent>
                </Item>
            );
        }

        switch (activeTab) {
            case 'articles':
                return articlesData.items.length === 0 ? (
                    <Item variant="outline">
                        <ItemContent className="items-center">
                            <ItemTitle>No articles found for "{query}"</ItemTitle>
                        </ItemContent>
                    </Item>
                ) : (
                    <ArticleListInfinite
                        initialArticles={articlesData.items}
                        initialHasMore={articlesData.hasMore}
                    />
                );

            case 'tags':
                return tagsData.items.length === 0 ? (
                    <Item variant="outline">
                        <ItemContent className="items-center">
                            <ItemTitle>No tags found for "{query}"</ItemTitle>
                        </ItemContent>
                    </Item>
                ) : (
                    <TagSearchResult tags={tagsData.items} />
                );

            case 'users':
                return userData.items.length === 0 ? (
                    <Item variant="outline">
                        <ItemContent className="items-center">
                            <ItemTitle>No user found for "{query}"</ItemTitle>
                        </ItemContent>
                    </Item>
                ) : (
                    <UserSearchResult users={userData.items} />
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto relative">
            <Item className="sticky top-0 z-40 px-0">
                <ItemContent>
                    <ItemTitle>Search</ItemTitle>
                    <ItemDescription>Search result for "{query}"</ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button variant="link" className="font-bold cursor-pointer">Most Relevant</Button>
                    <Button variant="link" className="cursor-pointer">Newest</Button>
                    <Button variant="link" className="cursor-pointer">Oldest</Button>
                </ItemActions>
            </Item>
            <div className="grid grid-cols-[280px_1fr] gap-4">
                <ButtonGroup className="w-full shrink-0" orientation="vertical">
                    <Button
                        variant={activeTab === 'articles' ? 'secondary' : 'outline'}
                        className={"w-full justify-between cursor-pointer"}
                        onClick={() => handleTabChange('articles')}
                    >
                        <p>Articles</p>
                        <Badge
                            variant={activeTab === 'articles' ? 'outline' : 'secondary'}
                            className="rounded"
                        >
                            {articlesData.count}
                        </Badge>
                    </Button>
                    <Button
                        variant={activeTab === 'tags' ? 'secondary' : 'outline'}
                        className="w-full justify-between cursor-pointer"
                        onClick={() => handleTabChange('tags')}
                    >
                        <p>Tags</p>
                        <Badge
                            variant={activeTab === 'tags' ? 'outline' : 'secondary'}
                            className="rounded"
                        >
                            {tagsData.isLoaded ? tagsData.count : 'Click to search'}
                        </Badge>
                    </Button>
                    <Button
                        variant={activeTab === 'users' ? 'secondary' : 'outline'}
                        className="w-full justify-between cursor-pointer"
                        onClick={() => handleTabChange('users')}
                    >
                        <p>Users</p>
                        <Badge
                            variant={activeTab === 'users' ? 'outline' : 'secondary'}
                            className="rounded"
                        >
                            {userData.isLoaded ? userData.count : 'Click to search'}
                        </Badge>
                    </Button>
                </ButtonGroup>
                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}