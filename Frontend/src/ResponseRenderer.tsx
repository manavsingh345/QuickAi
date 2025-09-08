
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import "prismjs/themes/prism-tomorrow.css"; // dark theme for code

export default function ResponseRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-3 mt-4 leading-7" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="list-disc ml-5 mb-1" {...props} />
          ),
          //@ts-ignore
          code({ inline, className, children, ...props }) {
            if (inline) {
              return (
                <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 text-sm">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-2xl overflow-x-auto my-3 shadow-md">
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
