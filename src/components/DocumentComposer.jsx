import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Settings } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// A component to render different types of content blocks
const ContentBlock = ({ element }) => {
    switch (element.type) {
        case 'title':
            return <h1 className="text-3xl font-bold mb-4">{element.content}</h1>;
        case 'summary':
            return (
                <div>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-3">Executive Summary</h2>
                    <p className="text-gray-600 dark:text-gray-300">{element.content}</p>
                </div>
            );
        case 'takeaways':
            return (
                <div>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-3">Key Takeaways</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        {element.content.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            );
        case 'q-and-a':
             return (
                <div>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-3">Generated Q&A</h2>
                    <div className="space-y-4">
                        {element.content.map((item, index) => (
                            <div key={index}>
                                <p className="font-semibold">{item.q}</p>
                                <p className="text-gray-600 dark:text-gray-300 pl-2">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'full-text':
            return (
                <div>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-3">Full Article Text</h2>
                    <div dangerouslySetInnerHTML={{ __html: element.content }} />
                </div>
            );
        default:
            return null;
    }
};

export function DocumentComposer({ elements, onToggle }) {
    const [pageLayout, setPageLayout] = useState('a4');

    const handleSaveAsPdf = () => {
        const input = document.getElementById('pdf-composer');
        document.body.classList.add('printing');

        html2canvas(input, { scale: 2 })
            .then((canvas) => {
                document.body.classList.remove('printing');
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', pageLayout);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`document-${pageLayout}.pdf`);
            });
    };
    
    return (
        <div className="space-y-4">
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Document & Export
                    </CardTitle>
                    <CardDescription>
                       Select the components to include in your final document and export as a PDF.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex items-center gap-3">
                         <Select value={pageLayout} onValueChange={setPageLayout}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Page Layout" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="a4">A4</SelectItem>
                                <SelectItem value="letter">Letter</SelectItem>
                                <SelectItem value="legal">Legal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleSaveAsPdf} className="w-full sm:w-auto">
                        <FileDown className="mr-2 h-4 w-4" />
                        Export to PDF
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="mb-6 space-y-2">
                        <h3 className="font-semibold">Document Components</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {elements.map(el => (
                                <div key={el.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={el.id}
                                        checked={el.included}
                                        onCheckedChange={() => onToggle(el.id)}
                                    />
                                    <label
                                        htmlFor={el.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                                    >
                                        {el.type.replace('-', ' ')}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* This is the div that will be converted to PDF */}
                    <div id="pdf-composer" className="prose dark:prose-invert max-w-none space-y-6">
                        {elements.filter(el => el.included).map(el => (
                            <ContentBlock key={el.id} element={el} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}