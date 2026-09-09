"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";
import { useCallback } from "react";
import toast from "react-hot-toast";

const lowlight = createLowlight(common);

export default function Editor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-cyan underline" } }),
      ImageExt,
      Placeholder.configure({ placeholder: "Start writing your article..." }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose-cyber prose prose-invert max-w-none min-h-[400px] px-4 py-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const addImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        editor.chain().focus().setImage({ src: data.url }).run();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolBtn = ({
    onClick,
    active,
    children,
    label,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    label: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active ? "bg-indigo/20 text-indigo-bright" : "text-ink-dim hover:bg-bg-elevated hover:text-ink"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg-raised">
      <div className="flex flex-wrap items-center gap-1 border-b border-line px-2 py-2">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold">
          <Bold size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic">
          <Italic size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Heading 2">
          <Heading2 size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Heading 3">
          <Heading3 size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet list">
          <List size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Numbered list">
          <ListOrdered size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Quote">
          <Quote size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} label="Code block">
          <Code size={15} />
        </ToolBtn>
        <ToolBtn onClick={addLink} active={editor.isActive("link")} label="Link">
          <LinkIcon size={15} />
        </ToolBtn>
        <ToolBtn onClick={addImage} label="Insert image">
          <ImageIcon size={15} />
        </ToolBtn>
        <div className="mx-1 h-5 w-px bg-line" />
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} label="Undo">
          <Undo size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} label="Redo">
          <Redo size={15} />
        </ToolBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
