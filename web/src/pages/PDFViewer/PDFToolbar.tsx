import { Download, Printer, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui";
import ShadowBox from "@/components/ShadowBox";

export type PDFToolbarProps = {
  numPages: number;
  scale: number;
  minScale: number;
  maxScale: number;
  pdfPath: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onPrint: () => void;
};

const PDFToolbar = ({
  numPages,
  scale,
  minScale,
  maxScale,
  pdfPath,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onPrint,
}: PDFToolbarProps) => {
  return (
    <div className="sticky top-0 z-20 w-full">
      <ShadowBox offset="xsm" backgroundColor="#FFFFFF">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="text-sm font-mono font-semibold select-none">
            {numPages > 0
              ? `${numPages} page${numPages !== 1 ? "s" : ""}`
              : "..."}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onZoomOut}
              disabled={scale <= minScale}
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </Button>
            <button
              onClick={onResetZoom}
              className="text-sm font-mono font-semibold min-w-[3.5rem] text-center cursor-pointer bg-transparent border-none"
              title="Reset zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onZoomIn}
              disabled={scale >= maxScale}
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onPrint}
              aria-label="Print"
            >
              <Printer size={16} />
            </Button>
            <Button variant="primary" size="sm" asChild>
              <a href={pdfPath} download>
                <Download size={16} />
                Download
              </a>
            </Button>
          </div>
        </div>
      </ShadowBox>
    </div>
  );
};

export default PDFToolbar;

