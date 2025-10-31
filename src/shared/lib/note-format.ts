export type BlockType =
  | "paragraph"
  | "task"
  | "ordered"
  | "unordered"
  | "quote"
  | "code";

export interface Block {
  type: BlockType;
  text: string;
  checked?: boolean;
}

function escapeHTML(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderInlineHTML(text: string): string {
  let html = escapeHTML(text);
  html = html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /~~(.+?)~~/g,
      '<span style="text-decoration:line-through">$1</span>'
    )
    .replace(
      /&lt;u&gt;(.+?)&lt;\/u&gt;/g,
      '<span style="text-decoration:underline">$1</span>'
    );
  return html;
}

export function parseBlocksString(value: string): Block[] {
  const lines = value.split("\n");
  return lines.map((l) => {
    const task = /^\s*- \[( |x|X)\] (.*)$/.exec(l);
    if (task)
      return {
        type: "task",
        checked: task[1].toLowerCase() === "x",
        text: task[2] ?? "",
      };
    const ord = /^\s*\d+\.\s+(.*)$/.exec(l);
    if (ord) return { type: "ordered", text: ord[1] ?? "" };
    const un = /^\s*-\s+(.*)$/.exec(l);
    if (un) return { type: "unordered", text: un[1] ?? "" };
    const quote = /^\s*>\s+(.*)$/.exec(l);
    if (quote) return { type: "quote", text: quote[1] ?? "" };
    const code = /^\s*`{3}\s*(.*)$/.exec(l);
    if (code) return { type: "code", text: code[1] ?? "" };
    return { type: "paragraph", text: l };
  });
}
