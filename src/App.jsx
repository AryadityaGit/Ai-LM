import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { ArticleWorkspace } from './components/ArticleWorkspace';
import { ArticleList } from './components/ArticleList';
import { UrlForm } from './components/UrlForm';
import { BookMarked, Loader2 } from 'lucide-react';

function App() {
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleBackToList = () => setSelectedArticleId(null);

    const article = useLiveQuery(
        () => selectedArticleId ? db.articles.get(selectedArticleId) : null,
        [selectedArticleId]
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
             <header className="border-b dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BookMarked className="h-7 w-7 text-blue-600" />
                        <h1 className="text-xl font-bold">Intelligent Reader</h1>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto p-4 space-y-8">
                {selectedArticleId ? (
                    article ? (
                         <ArticleWorkspace key={selectedArticleId} article={article} onReset={handleBackToList} />
                    ) : (
                        <div className="text-center p-10"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div>
                    )
                ) : (
                    <>
                        <div className="max-w-2xl mx-auto">
                           <UrlForm setIsLoading={setIsLoading} isLoading={isLoading} />
                        </div>
                        <ArticleList onArticleSelect={setSelectedArticleId} />
                    </>
                )}
            </main>
        </div>
    );
}

export default App;