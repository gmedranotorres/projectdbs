// PreToolUse hook: Claude can read Gabriela's data but never change it.
// Blocks (exit 2, with the reason sent back to Claude):
//   - Edit, Write, MultiEdit, NotebookEdit on anything in data/
//   - Bash commands that name data/ (or courses.json) and could write, move or delete
//   - Calendar, email or Slack tools from connectors that create, change or delete anything
import path from "node:path";

const raw = await new Promise((resolve) => {
  let s = "";
  process.stdin.on("data", (c) => (s += c)).on("end", () => resolve(s));
});
let input;
try { input = JSON.parse(raw); } catch {
  // Fail closed: if the hook can't tell what's happening, it doesn't let it through.
  process.stderr.write("Blocked by the data hook: it couldn't read the tool call, so it can't confirm data/ is safe.\n");
  process.exit(2);
}
const tool = input.tool_name ?? "";
const args = input.tool_input ?? {};
const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
const dataDir = path.resolve(root, "data");

const block = (why) => {
  process.stderr.write(
    `Blocked by the data hook: ${why}\n` +
    "Gabriela's data is read-only for Claude. Don't try another way. Tell her what she would change, and where, so she can do it herself. Then replan around it.\n"
  );
  process.exit(2);
};

if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
  const target = path.resolve(input.cwd ?? root, args.file_path ?? args.notebook_path ?? "");
  if (target === dataDir || target.startsWith(dataDir + path.sep)) {
    block(`${tool} on ${path.relative(root, target)}`);
  }
}

if (tool === "Bash") {
  const cmd = args.command ?? "";
  const touchesData = /(^|[\s"'=/(])data\/|courses\.json/.test(cmd);
  const writes = new RegExp([
    ">>?\\s*[\"']?[^\\s\"'&|;]*(data/|courses\\.json)", "\\btee\\b", "\\brm\\b", "\\bmv\\b", "\\bcp\\b", "\\bln\\b", "\\btouch\\b", "\\btruncate\\b",
    "\\bchmod\\b", "\\bchown\\b", "\\bdd\\b", "sed\\s+(-\\w*\\s+)*-i", "perl\\s+-\\w*i", "\\bgit\\s+(checkout|restore|rm|mv|reset|clean|stash)",
    "writeFile", "appendFile", "unlink", "rename", "rmSync", "rmdir", "open\\(", "\\bpython", "\\bruby\\b", "\\bjq\\b.*>",
  ].join("|"));
  if (touchesData && writes.test(cmd)) block(`a shell command that could change data/: ${cmd.slice(0, 120)}`);
}

// Connectors (MCP): any calendar, email or messaging tool that writes.
if (tool.startsWith("mcp__") && /calendar|gmail|mail|slack/i.test(tool) &&
    /create|update|delete|remove|move|patch|insert|send|post|respond|modify|edit|write/i.test(tool)) {
  block(`${tool} would change her calendar, email or messages`);
}

process.exit(0);
