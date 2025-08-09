import { useState } from 'react';
import { AiControlPanel } from './AiControlPanel';
import { DocumentComposer } from './DocumentComposer';

export function ArticleWorkspace({ article, onReset }) {
    // This state will hold all the pieces of content for the final PDF
    const [documentElements, setDocumentElements] = useState([
        { id: 'title', type: 'title', content: article.title, included: true },
        { id: 'summary', type: 'summary', content: article.ai.summary, included: true },
        { id: 'takeaways', type: 'takeaways', content: article.ai.keyTakeaways, included: true },
        { id: 'full-text', type: 'full-text', content: article.content, included: false },
    ]);

    const handleElementToggle = (id) => {
        setDocumentElements(elements =>
            elements.map(el =>
                el.id === id ? { ...el, included: !el.included } : el
            )
        );
    };

    const addDocumentElement = (newElement) => {
        // newElement should be { id, type, content, included }
        setDocumentElements(prev => [...prev, newElement]);
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <AiControlPanel 
                    articleText={article.content} 
                    addDocumentElement={addDocumentElement}
                    onReset={onReset}
                />
            </div>
            <div className="lg:col-span-2">
                <DocumentComposer 
                    elements={documentElements} 
                    onToggle={handleElementToggle}
                />
            </div>
        </div>
    );
}
