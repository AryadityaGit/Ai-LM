import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Settings, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function ArticleDisplay({ article, onReset }) {
    const [pageLayout, setPageLayout] = useState('a4');

    const handleSaveAsPdf = () => {
        const contentElement = document.getElementById('printable-article');
        if (!contentElement) return;

        // Temporarily add a class for print-specific styling
        document.body.classList.add('printing');

        html2canvas(contentElement, {
            scale: 2, // Improve resolution
            windowWidth: contentElement.scrollWidth,
            windowHeight: contentElement.scrollHeight,
            onclone: (document) => {
                // Ensure the content inside the cloned document is visible for rendering
                document.getElementById('printable-article').style.display = 'block';
            }
        }).then(canvas => {
            document.body.classList.remove('printing'); // Remove the class after rendering

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: pageLayout,
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;
            const pdfAspectRatio = pdfWidth / pdfHeight;

            let finalWidth, finalHeight;

            if (canvasAspectRatio > pdfAspectRatio) {
                finalWidth = pdfWidth;
                finalHeight = pdfWidth / canvasAspectRatio;
            } else {
                finalHeight = pdfHeight;
                finalWidth = pdfHeight * canvasAspectRatio;
            }

            // Center the image on the PDF page
            const x = (pdfWidth - finalWidth) / 2;
            const y = (pdfHeight - finalHeight) / 2;

            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
            pdf.save(`document-${pageLayout}.pdf`);
        });
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Print Settings
                    </CardTitle>
                    <CardDescription>
                        Choose your desired page layout and save the document as a PDF.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Printer className="h-5 w-5 text-gray-500" />
                        <Select value={pageLayout} onValueChange={setPageLayout}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select page layout" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="a4">A4</SelectItem>
                                <SelectItem value="a3">A3</SelectItem>
                                <SelectItem value="letter">Letter</SelectItem>
                                <SelectItem value="legal">Legal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                         <Button onClick={handleSaveAsPdf} className="w-full">
                            <FileDown className="h-4 w-4 mr-2" />
                            Save as PDF
                        </Button>
                        <Button variant="outline" onClick={onReset} className="w-full">
                            Start Over
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Printable Content Area */}
            <Card>
                <CardContent className="p-4 sm:p-6 md:p-8">
                    <div id="printable-article" className="prose dark:prose-invert max-w-none">
                        <h1>{article.title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}