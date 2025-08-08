import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Inbox } from 'lucide-react';

export function ArticleList({ onArticleSelect }) {
    // useLiveQuery automatically updates when the database changes!
    const articles = useLiveQuery(
        () => db.articles.orderBy('savedAt').reverse().toArray(),
        [] // dependencies
    );

    if (!articles) {
        return (
            <div className="flex justify-center items-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (articles.length === 0) {
        return (
             <Card className="text-center p-8">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">Your Library is Empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Save your first article using the form above.
                </p>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Library</CardTitle>
                <CardDescription>All your saved articles, available online and offline.</CardDescription>
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