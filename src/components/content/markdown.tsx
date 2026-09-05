import ReactMarkdown from "react-markdown";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown skipHtml>{children}</ReactMarkdown>
    </div>
  );
}
