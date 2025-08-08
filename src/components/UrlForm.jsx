import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Loader2 } from "lucide-react";
import { db } from '@/db';

const PARSER_API_ENDPOINT = '/api/parse';

export function UrlForm({ setIsLoading, isLoading }) {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = event.target.elements.url.value;
        if (!url) return;

        setIsLoading(true);
        try {
            const response = await fetch(PARSER_API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch the article.');
            }
            const articleData = await response.json();
            await db.articles.add({
                url: url,
                title: articleData.title,
                content: articleData.content,
                author: articleData.author,
                savedAt: new Date(),
            });
            alert(`Article "${articleData.title}" saved successfully!`);
            event.target.reset();
        } catch (error) {
            console.error("Failed to process and save URL:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Save an Article</CardTitle>
                <CardDescription>Paste a URL to save it to your offline library.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative w-full">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input name="url" type="url" placeholder="https://..." className="pl-9" disabled={isLoading} required />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}```

**`src/components/ArticleList.jsx`**
```javascript
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Inbox } from 'lucide-react';

export function ArticleList({ onArticleSelect }) {
    const articles = useLiveQuery(() => db.articles.orderBy('savedAt').reverse().toArray(), []);

    if (!articles) {
        return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>;
    }

    if (articles.length === 0) {
        return (
             <Card className="text-center p-8">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">Your Library is Empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">Save your first article using the form above.</p>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Library</CardTitle>
                <CardDescription>All your saved articles, available offline.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {articles.map(article => (
                        <div
                            key={article.id}
                            className="p-3 -m-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                            onClick={() => onArticleSelect(article.id)}
                        >
                            <h3 className="font-semibold">{article.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {new URL(article.url).hostname} - {article.savedAt.toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
