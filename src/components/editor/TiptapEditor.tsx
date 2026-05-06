"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Image as ImageIcon, Code, Type, Highlighter,
  AlignLeft, AlignCenter, AlignRight, Maximize2, Minimize2,
  Palette
} from "lucide-react";
import { useState, useRef } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const SWATCHES = [
  { name: "Black", color: "#0D1B2A" },
  { name: "Gray", color: "#6B7280" },
  { name: "Mint", color: "#1ED490" },
  { name: "Orange", color: "#FF6B35" },
  { name: "Red", color: "#EF4444" },
  { name: "Blue", color: "#3B82F6" },
];

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [showColors, setShowColors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] font-sans",
      },
    },
  });

  if (!editor) return null;

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const content = readerEvent.target?.result as string;
        editor.chain().focus().setImage({ src: content }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full border border-brand-border rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-brand-midnight/5">
      {/* Hidden File Input for Image Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleLocalImageUpload}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-brand-border bg-brand-cream/10 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-brand-border/50">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            active={editor.isActive("bold")}
            icon={<Bold size={16} />}
            title="Bold"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            active={editor.isActive("italic")}
            icon={<Italic size={16} />}
            title="Italic"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            active={editor.isActive("underline")}
            icon={<UnderlineIcon size={16} />}
            title="Underline"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-brand-border/50">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            active={editor.isActive("heading", { level: 1 })}
            icon={<Heading1 size={16} />}
            title="H1"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            active={editor.isActive("heading", { level: 2 })}
            icon={<Heading2 size={16} />}
            title="H2"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            active={editor.isActive("heading", { level: 3 })}
            icon={<Heading3 size={16} />}
            title="H3"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-brand-border/50">
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('left').run()} 
            active={editor.isActive({ textAlign: 'left' })}
            icon={<AlignLeft size={16} />}
            title="Align Left"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('center').run()} 
            active={editor.isActive({ textAlign: 'center' })}
            icon={<AlignCenter size={16} />}
            title="Align Center"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('right').run()} 
            active={editor.isActive({ textAlign: 'right' })}
            icon={<AlignRight size={16} />}
            title="Align Right"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-brand-border/50">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            active={editor.isActive("bulletList")}
            icon={<List size={16} />}
            title="Bullets"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            active={editor.isActive("orderedList")}
            icon={<ListOrdered size={16} />}
            title="Numbers"
          />
        </div>

        {/* Color Palette */}
        <div className="relative">
          <button 
            onClick={() => setShowColors(!showColors)}
            className={`p-2 rounded-lg transition-all flex items-center gap-1 hover:bg-brand-cream/50 ${showColors ? 'bg-brand-cream text-brand-midnight' : 'text-brand-midnight/60'}`}
            title="Text Color"
          >
            <Palette size={16} />
            <div className="w-3 h-3 rounded-full border border-brand-border" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000' }} />
          </button>
          
          {showColors && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowColors(false)} />
              <div className="absolute top-full mt-2 left-0 bg-white border border-brand-border rounded-xl shadow-xl p-3 z-30 grid grid-cols-3 gap-2 min-w-[120px] animate-in fade-in zoom-in-95 duration-200">
                {SWATCHES.map((swatch) => (
                  <button
                    key={swatch.color}
                    onClick={() => {
                      editor.chain().focus().setColor(swatch.color).run();
                      setShowColors(false);
                    }}
                    className="w-8 h-8 rounded-full border border-brand-border hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: swatch.color }}
                    title={swatch.name}
                  />
                ))}
                <button
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColors(false);
                  }}
                  className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight py-1 border-t border-brand-border mt-1"
                >
                  Reset Color
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-brand-border/50">
          <ToolbarButton 
            onClick={() => fileInputRef.current?.click()} 
            icon={<ImageIcon size={16} />}
            title="Insert Image"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
            active={editor.isActive("codeBlock")}
            icon={<Code size={16} />}
            title="Code Block"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            active={editor.isActive("blockquote")}
            icon={<Quote size={16} />}
            title="Quote"
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6 md:p-12 min-h-[500px]">
        <EditorContent editor={editor} />
      </div>

      {/* Quick Image Helper (if an image is selected) */}
      {editor.isActive('image') && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-brand-midnight text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <span className="text-[10px] font-bold uppercase tracking-widest border-r border-white/20 pr-4">Image Controls</span>
          <div className="flex items-center gap-2">
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1.5 rounded-md ${editor.isActive({ textAlign: 'left' }) ? 'bg-brand-green text-brand-midnight' : 'hover:bg-white/10'}`}><AlignLeft size={14} /></button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1.5 rounded-md ${editor.isActive({ textAlign: 'center' }) ? 'bg-brand-green text-brand-midnight' : 'hover:bg-white/10'}`}><AlignCenter size={14} /></button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1.5 rounded-md ${editor.isActive({ textAlign: 'right' }) ? 'bg-brand-green text-brand-midnight' : 'hover:bg-white/10'}`}><AlignRight size={14} /></button>
          </div>
        </div>
      )}
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
        : "text-brand-midnight/60 hover:bg-brand-cream/50 hover:text-brand-midnight"
    }`}
  >
    {icon}
  </button>
);

export default TiptapEditor;


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
