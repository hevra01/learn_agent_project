#!/bin/bash
# Pre-tool hook: Check for dangerous bash commands and block them.
# Reads JSON from stdin with tool_input.command field.
# Outputs JSON with permissionDecision: "allow" or "deny".

input=$(cat)
command=$(echo "$input" | python3 -c "import sys,json; data=json.load(sys.stdin); print(data.get('tool_input',{}).get('command',''))" 2>/dev/null)

# List of dangerous patterns
dangerous_patterns=(
  "rm -rf"
  "rm -fr"
  "rmdir"
  "git push --force"
  "git push -f"
  "git reset --hard"
  "git clean -f"
  "git clean -d"
  "git checkout -- ."
  "git restore ."
  "DROP TABLE"
  "DROP DATABASE"
  "TRUNCATE"
  "mkfs"
  "dd if="
  "> /dev/"
  "chmod -R 777"
  ":(){ :|:& };:"
)

for pattern in "${dangerous_patterns[@]}"; do
  if echo "$command" | grep -qi "$pattern"; then
    echo "{\"permissionDecision\": \"deny\", \"systemMessage\": \"BLOCKED: Dangerous command detected: '$pattern'. This command requires explicit user approval.\"}"
    exit 0
  fi
done

# Allow safe commands
echo "{\"permissionDecision\": \"allow\"}"
