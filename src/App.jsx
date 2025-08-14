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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Offline Browser Conversation
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A conversation about finding the perfect offline browser solution
            </p>
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => setShowSummary(!showSummary)}
              variant={showSummary ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {showSummary ? "Show Conversation" : "Show Summary"}
            </Button>
          </div>

          {/* Content */}
          {showSummary ? (
            /* Summary Card */
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Conversation Summary
                </CardTitle>
                <CardDescription>
                  Key points and recommendations from the discussion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {summary}
                  </p>
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Recommended Solutions:
                    </h4>
                    <ul className="list-disc list-inside text-blue-800 dark:text-blue-200">
                      <li><strong>Pocket</strong> - Popular read-later app with offline capabilities</li>
                      <li><strong>Wallabag</strong> - Open-source offline reading solution</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Conversation Messages */
            <div className="space-y-4">
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl flex gap-3 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="font-semibold text-sm mb-1 opacity-75">
                        {msg.name}
                      </div>
                      <div className="text-sm leading-relaxed">
                        {msg.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Conversation extracted from Microsoft Copilot shared link
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
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