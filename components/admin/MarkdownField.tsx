"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";

const InitializedMDXEditor = dynamic(
  () => import("./InitializedMDXEditor"),
  { ssr: false }
);

export function MarkdownField({
  id,
  label,
  value,
  onChange,
  required,
  dir,
  placeholder,
  height = 300,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  height?: number;
}) {
  const editorRef = useRef<import("@mdxeditor/editor").MDXEditorMethods>(null);
  const lastEmittedRef = useRef<string>(value);

  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      editorRef.current?.setMarkdown(value);
    }
  }, [value]);

  const handleChange = (markdown: string) => {
    lastEmittedRef.current = markdown;
    onChange(markdown);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && "*"}
      </Label>
      <p className="text-xs text-muted-foreground">
        Single-pane WYSIWYG editor. Use the toolbar to apply formatting.
      </p>
      <div
        data-dir={dir}
        className="overflow-hidden rounded-md border [&_.mdxeditor]:rounded-md"
        style={{ minHeight: height }}
      >
        <InitializedMDXEditor
          editorRef={editorRef}
          markdown={value}
          onChange={handleChange}
          placeholder={placeholder ?? "Write markdown here..."}
          className="min-h-[200px]"
          contentEditableClassName="mdx-editor-prose min-h-[200px]"
        />
      </div>
    </div>
  );
}
