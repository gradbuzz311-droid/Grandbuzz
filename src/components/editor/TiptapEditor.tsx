"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Image as ImageIcon, Code, Type, Highlighter
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px]",
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="w-full border border-brand-border rounded-2xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-brand-border bg-brand-cream/20">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          active={editor.isActive("bold")}
          icon={<Bold size={18} />}
          title="Bold"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          active={editor.isActive("italic")}
          icon={<Italic size={18} />}
          title="Italic"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          active={editor.isActive("underline")}
          icon={<UnderlineIcon size={18} />}
          title="Underline"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          active={editor.isActive("strike")}
          icon={<Strikethrough size={18} />}
          title="Strikethrough"
        />
        
        <div className="w-px h-6 bg-brand-border mx-1" />
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          active={editor.isActive("heading", { level: 1 })}
          icon={<Heading1 size={18} />}
          title="Heading 1"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          active={editor.isActive("heading", { level: 2 })}
          icon={<Heading2 size={18} />}
          title="Heading 2"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          active={editor.isActive("heading", { level: 3 })}
          icon={<Heading3 size={18} />}
          title="Heading 3"
        />

        <div className="w-px h-6 bg-brand-border mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          active={editor.isActive("bulletList")}
          icon={<List size={18} />}
          title="Bullet List"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          active={editor.isActive("orderedList")}
          icon={<ListOrdered size={18} />}
          title="Numbered List"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          active={editor.isActive("blockquote")}
          icon={<Quote size={18} />}
          title="Blockquote"
        />

        <div className="w-px h-6 bg-brand-border mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHighlight().run()} 
          active={editor.isActive("highlight")}
          icon={<Highlighter size={18} />}
          title="Highlight"
        />
        <ToolbarButton 
          onClick={() => {
            const color = window.prompt("Enter color (hex or name)");
            if (color) editor.chain().focus().setColor(color).run();
          }} 
          icon={<Type size={18} />}
          title="Text Color"
        />
        <ToolbarButton 
          onClick={addImage} 
          icon={<ImageIcon size={18} />}
          title="Insert Image"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
          active={editor.isActive("codeBlock")}
          icon={<Code size={18} />}
          title="Code Block"
        />
      </div>

      {/* Editor Content */}
      <div className="p-6 md:p-10 min-h-[500px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, active, icon, title }: { onClick: () => void, active?: boolean, icon: React.ReactNode, title: string }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-lg transition-all ${
      active 
        ? "bg-brand-green text-brand-midnight shadow-sm" 
        : "text-brand-midnight/60 hover:bg-brand-cream hover:text-brand-midnight"
    }`}
  >
    {icon}
  </button>
);

export default TiptapEditor;
