import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, ScrollArea } from "@/components/ui";
import ShadowBox from "@/components/ShadowBox";
import { DotBackground } from "@/components/DotBackground";
import { Theme } from "@/components/theme";
import PDFToolbar from "./PDFToolbar";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PDF_PATH = "/Resume - Matthew Magin.pdf";
const ZOOM_STEP = 0.25;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const DEFAULT_SCALE = 1.25;

const Shell = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 50px;
  display: flex;
  justify-content: center;
  background-color: ${Theme.colors.dark.contentBackground};
`;

const ShellInner = styled.div`
  width: 100%;
  max-width: 2200px;
`;

const PDFViewer = () => {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, s + ZOOM_STEP));
  const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, s - ZOOM_STEP));
  const resetZoom = () => setScale(DEFAULT_SCALE);

  const handlePrint = () => {
    const printWindow = window.open(PDF_PATH, "_blank");
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.print();
      });
    }
  };

  return (
    <Shell>
      <ShellInner>
        <ShadowBox styles={{ content: { padding: "2rem 0" } }}>
          <DotBackground />
          <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
            <div className="flex flex-col gap-6">
              {/* Back button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={16} />
                Back
              </Button>

              <div className="overflow-auto flex flex-col items-center gap-6 p-4">
                {/* <PDFToolbar
                    numPages={numPages}
                    scale={scale}
                    minScale={MIN_SCALE}
                    maxScale={MAX_SCALE}
                    pdfPath={PDF_PATH}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onResetZoom={resetZoom}
                    onPrint={handlePrint}
                  /> */}
                <Document
                  file={PDF_PATH}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center py-24 text-sm font-medium text-gray-500">
                      Loading PDF...
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center py-24 text-sm font-medium text-red-600">
                      Failed to load PDF.
                    </div>
                  }
                >
                  <ScrollArea className="h-full">
                    {Array.from({ length: numPages }, (_, i) => (
                      <div key={i} className={i > 0 ? "mt-6" : ""}>
                        <Page
                          pageNumber={i + 1}
                          scale={scale}
                          renderTextLayer
                          renderAnnotationLayer
                        />
                      </div>
                    ))}
                  </ScrollArea>
                </Document>

              </div>
            </div>
          </div>
        </ShadowBox>
      </ShellInner>
    </Shell>
  );
};

export default PDFViewer;
