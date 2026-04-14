#!/bin/bash
# Pre-tool hook: Block writes to sensitive files.
# Reads JSON from stdin with tool_input.file_path field.

input=$(cat)
file_path=$(echo "$input" | python3 -c "import sys,json; data=json.load(sys.stdin); print(data.get('tool_input',{}).get('file_path',''))" 2>/dev/null)

# Block sensitive file patterns
sensitive_patterns=(
  ".env.local"
  ".env.production"
  "credentials"
  "secrets"
  "/etc/"
  "/sys/"
  "id_rsa"
  "id_ed25519"
  ".ssh/"
)

for pattern in "${sensitive_patterns[@]}"; do
  if echo "$file_path" | grep -qi "$pattern"; then
    echo "{\"permissionDecision\": \"deny\", \"systemMessage\": \"BLOCKED: Write to sensitive file detected: '$file_path'. This requires explicit user approval.\"}"
    exit 0
  fi
done

echo "{\"permissionDecision\": \"allow\"}"
