#!/bin/bash
# Post-tool hook: Auto-commit after file changes (Write/Edit).
# Reads JSON from stdin with tool_input and tool_name fields.

PROJECT_DIR="/BS/scene_repre/work/hpetekka/learn_agent_project"
cd "$PROJECT_DIR" || exit 0

input=$(cat)
tool_name=$(echo "$input" | python3 -c "import sys,json; data=json.load(sys.stdin); print(data.get('tool_name',''))" 2>/dev/null)
file_path=$(echo "$input" | python3 -c "import sys,json; data=json.load(sys.stdin); print(data.get('tool_input',{}).get('file_path',''))" 2>/dev/null)

# Only proceed if there are actual changes to commit
if ! git diff --quiet HEAD 2>/dev/null || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  # Get a short description of the file changed
  filename=$(basename "$file_path" 2>/dev/null || echo "files")

  # Stage the specific file if we know it, otherwise stage all changes
  if [ -n "$file_path" ] && [ -f "$file_path" ]; then
    git add "$file_path"
  else
    git add -A
  fi

  # Create commit with descriptive message
  git commit -m "auto: ${tool_name} ${filename}" --no-verify 2>/dev/null || true
fi

echo "{\"continue\": true}"
