import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, RotateCcw, MessageSquareQuote } from "lucide-react";

export function AiControlPanel({ articleText, addDocumentElement, onReset }) {
    
    // In a real app, each of these functions would call your backend AI endpoint
    const handleGenerateQuestions = () => {
        console.log("Simulating AI Question Generation...");
        // Mock response
        setTimeout(() => {
            const newQuestions = {
                id: `qa-${Date.now()}`,
                type: 'q-and-a',
                content: [
                    { q: "What is the primary benefit of AI in research?", a: "The primary benefit is the ability to analyze vast datasets and identify patterns much faster than humanly possible." },
                    { q: "What are the main challenges mentioned?", a: "Ethical considerations, data privacy, and the risk of algorithmic bias are the main challenges." }
                ],
                included: true
            };
            addDocumentElement(newQuestions);
        }, 1500);
    };

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    AI Actions
                </CardTitle>
                <CardDescription>
                    Use AI to analyze the text and add new insights to your document.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                 <Button className="w-full justify-start gap-2" variant="ghost" onClick={handleGenerateQuestions}>
                    <MessageSquareQuote className="h-4 w-4" />
                    Generate Q&A
                </Button>
                {/* Add more AI action buttons here */}
                {/* e.g., "Find Action Items", "Change Tone", etc. */}
                
                <hr className="my-4" />

                <Button className="w-full" variant="outline" onClick={onReset}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Start New Session
                </Button>
            </CardContent>
        </Card>
    );
}