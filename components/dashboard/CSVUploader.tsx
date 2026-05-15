"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { parseDarazCSV, parseDarazXLSX } from "../../lib/csvParser";
import { toast } from "sonner";

interface ParsedFile {
  orders: import("../../types").DarazOrder[];
  uniqueProducts: { name: string; selling_price: number; sku?: string }[];
  rowCount: number;
  fileName: string;
}

interface CSVUploaderProps {
  onFileParsed: (result: ParsedFile) => void;
  onLoadDemo: () => void;
}

export function CSVUploader({ onFileParsed, onLoadDemo }: CSVUploaderProps) {
  const [state, setState] = useState<"idle" | "parsing" | "done" | "error">("idle");
  const [fileName, setFileName] = useState("");

  const processFile = useCallback(async (file: File) => {
    setState("parsing");
    setFileName(file.name);

    try {
      const isXlsx = /\.(xlsx|xls)$/i.test(file.name);
      const result = isXlsx
        ? await parseDarazXLSX(file)
        : parseDarazCSV(await file.text());

      if (result.errors.length > 0 && result.orders.length === 0) {
        throw new Error(result.errors[0]);
      }

      setState("done");
      toast.success(`Found ${result.rowCount} orders — now enter product details`);
      onFileParsed({
        orders: result.orders,
        uniqueProducts: result.uniqueProducts,
        rowCount: result.rowCount,
        fileName: file.name,
      });
    } catch (err) {
      setState("error");
      toast.error(err instanceof Error ? err.message : "Failed to read file");
    }
  }, [onFileParsed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: File[]) => files[0] && processFile(files[0]),
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
    disabled: state === "parsing",
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer",
          isDragActive ? "border-orange-400 bg-orange-50 dark:bg-orange-950/30"
            : "border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/20",
          state === "parsing" && "cursor-not-allowed opacity-60",
          state === "done" && "border-green-300 bg-green-50 dark:bg-green-950/20",
          state === "error" && "border-red-300 bg-red-50 dark:bg-red-950/20"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {state === "parsing" ? (
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          ) : state === "done" ? (
            <CheckCircle className="w-10 h-10 text-green-500" />
          ) : state === "error" ? (
            <AlertCircle className="w-10 h-10 text-red-500" />
          ) : (
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center">
              <Upload className="w-7 h-7 text-orange-500" />
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {state === "parsing" ? "Reading your file..."
                : state === "done" ? `Loaded: ${fileName}`
                : state === "error" ? "Upload failed — try again"
                : isDragActive ? "Drop it here!"
                : "Drop your Daraz order export"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {state === "idle" && "Supports .xlsx and .csv"}
            </p>
          </div>

          {state === "idle" && (
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 mt-1">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Seller Center → Orders → All Orders → Export
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button onClick={onLoadDemo} className="text-xs text-gray-400 hover:text-orange-500 transition-colors">
          Or try with demo data →
        </button>
      </div>
    </div>
  );
}
