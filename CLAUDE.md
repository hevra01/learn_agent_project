## Purpose

Project-wide instructions for AI-assisted code changes in this repository.

Priorities, in order:

1. Correctness
2. Simplicity
3. Minimal surface area
4. Clear verification

---

## 1. Think before coding

Before making changes:

- State assumptions when they affect the implementation.
- If requirements are ambiguous, ask instead of guessing.
- If multiple interpretations exist, briefly present the important ones and choose only with justification.
- If a simpler approach solves the problem, prefer it and say so.
- Push back on unnecessary complexity.
- Do not hide confusion. Name what is unclear.

Default behavior:

- Do not silently invent requirements.
- Do not silently broaden scope.
- Do not treat speculation as fact.

---

## 2. Simplicity first

Write the minimum code needed to solve the requested problem.

Rules:

- No features beyond the request.
- No abstractions for one-time use.
- No configurability unless explicitly needed by the task.
- No fallback behavior unless explicitly required.
- No defensive handling for impossible or unsupported scenarios unless requested.
- Fail clearly on missing or mismatched inputs rather than masking the issue.

Heuristic:

- If the solution feels overengineered, simplify it.
- If 50 lines can do the job, do not write 200.

---

## 3. Make surgical changes

When editing existing code:

- Touch only files and code relevant to the request.
- Do not refactor unrelated code.
- Do not reformat unrelated code.
- Do not "clean up" nearby code unless the task requires it.
- Match the existing style, naming, and local patterns unless told otherwise.
- Preserve surrounding behavior unless the requested change requires altering it.

Cleanup rule:

- Remove imports, variables, or helpers made unused by your own changes.
- Do not remove unrelated dead code unless explicitly asked.
- If you notice unrelated problems, mention them briefly instead of fixing them opportunistically.

Test:

- Every changed line should trace back to the user's request.

---

---

## 4. Document code clearly

When generating new code:

- Provide clear documentation for public types, functions, and modules when the language or codebase convention expects it.
- Explain non-obvious behavior, constraints, and assumptions.
- Keep documentation precise and proportional to the complexity of the code.
- Do not add verbose comments for obvious code.

When modifying code:

- Update existing documentation only where your change makes it inaccurate.

---

## 5. Communication style

In responses about implementation work:

- Be explicit about assumptions, tradeoffs, and limitations.
- Be concise.
- Do not present uncertain claims as certain.
- Say when you did not verify something.
- When blocked by missing information or resources, say exactly what is missing.

---

## 6. What not to do

- Do not guess hidden requirements.
- Do not add speculative abstractions.
- Do not make unrelated improvements.
- Do not claim something was tested if it was not.
- Do not claim something is safe, complete, or production-ready without verification.
