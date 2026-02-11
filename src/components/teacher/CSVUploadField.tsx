"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import { parseStudentEmailCSV } from "@/lib/utils/csv-parser.util";
import { Button } from "@/components/ui/button";

export interface CSVUploadProps {
  onEmailsParsed: (emails: string[]) => void;
  className?: string;
}

export function CSVUploadField({
  onEmailsParsed,
  className = "",
}: CSVUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<{
    valid: string[];
    invalid: { email: string; reason: string }[];
    duplicates: string[];
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }

    setFile(file);

    // Read and parse the file
    const text = await file.text();
    const result = parseStudentEmailCSV(text);
    setParseResult(result);

    // Pass valid emails to parent
    onEmailsParsed(result.valid);
  };

  const handleRemove = () => {
    setFile(null);
    setParseResult(null);
    onEmailsParsed([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const template = `email,name
student1@university.edu,Student One
student2@university.edu,Student Two
student3@university.edu,Student Three`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-emails-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {!file && (
        <div>
          <div
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-lg font-medium text-gray-700">
              Drop CSV file here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              CSV file with student emails
            </p>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleChange}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={downloadTemplate}
            className="mt-2 w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>
        </div>
      )}

      {/* File Info and Parse Results */}
      {file && parseResult && (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Parse Summary */}
          <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {parseResult.valid.length} valid email
                {parseResult.valid.length !== 1 ? "s" : ""}
              </span>
            </div>

            {parseResult.invalid.length > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">
                  {parseResult.invalid.length} invalid email
                  {parseResult.invalid.length !== 1 ? "s" : ""} (skipped)
                </span>
              </div>
            )}

            {parseResult.duplicates.length > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">
                  {parseResult.duplicates.length} duplicate
                  {parseResult.duplicates.length !== 1 ? "s" : ""} (skipped)
                </span>
              </div>
            )}
          </div>

          {/* Preview valid emails */}
          {parseResult.valid.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Valid Emails:
              </p>
              <div className="space-y-1">
                {parseResult.valid.slice(0, 10).map((email, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    {email}
                  </p>
                ))}
                {parseResult.valid.length > 10 && (
                  <p className="text-sm italic text-gray-500">
                    ... and {parseResult.valid.length - 10} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
