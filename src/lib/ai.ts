import { spawn } from "child_process";
import { Idea, Competitor } from "./types";

const CLAUDE_PATH = "/home/hpetekka/.local/bin/claude";

async function askClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(CLAUDE_PATH, [
      "--print",
      "--output-format", "text",
      "--bare",
      "--no-session-persistence",
    ]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Claude CLI exited with code ${code}: ${stderr}`));
      } else {
        resolve(stdout.trim());
      }
    });

    // Pipe the prompt via stdin to avoid argument length limits and stdin warnings
    child.stdin.write(prompt);
    child.stdin.end();

    // Kill if it takes too long
    setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error("Claude CLI timed out after 120 seconds"));
    }, 120_000);
  });
}

/** Ask Claude to return JSON. Retries once if parsing fails. */
async function askClaudeJson<T>(prompt: string): Promise<T> {
  const raw = await askClaude(prompt);
  // Try to extract JSON from the response (Claude sometimes wraps it in markdown)
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw];
  const jsonStr = jsonMatch[1]!.trim();
  return JSON.parse(jsonStr);
}

export async function generateFeedback(idea: Idea): Promise<string> {
  const prompt = `You are a product advisor. Given this software idea:

Title: ${idea.title}
Description: ${idea.description}
Target Region: ${idea.targetRegion}
Target Age Group: ${idea.targetAgeGroup}

Provide honest, constructive feedback on:
1. Viability and market fit for the specified region and age group
2. Key challenges and risks
3. Potential strengths and opportunities
4. Specific, actionable suggestions to improve the idea

Be direct and specific. No generic advice.`;

  return askClaude(prompt);
}

export async function generateIdeas(
  region: string,
  ageGroup: string
): Promise<{ title: string; description: string }[]> {
  const prompt = `Generate 5 unique software product ideas targeting:
- Region: ${region}
- Age Group: ${ageGroup}

Each idea should solve a real problem for this demographic. Be creative and specific.

Return ONLY valid JSON, no other text. Format:
[{"title": "Short Product Name", "description": "2-3 sentence description of what it does and why this audience needs it"}]`;

  return askClaudeJson(prompt);
}

export async function researchCompetitors(
  idea: Idea
): Promise<{ analysis: string; competitors: Competitor[] }> {
  const prompt = `Research competitors for this software product idea:

Title: ${idea.title}
Description: ${idea.description}
Target Region: ${idea.targetRegion}
Target Age Group: ${idea.targetAgeGroup}

Identify 3-5 existing products or services that address similar needs. For each, describe what they do, their strengths, and their weaknesses.

Return ONLY valid JSON, no other text. Format:
{"analysis": "Brief overall market analysis (2-3 sentences)", "competitors": [{"name": "Product Name", "description": "What it does", "strengths": "Key strengths", "weaknesses": "Key weaknesses"}]}`;

  return askClaudeJson(prompt);
}

export async function brainstormGaps(
  idea: Idea,
  competitors: Competitor[]
): Promise<string> {
  const competitorSummary = competitors
    .map(
      (c) =>
        `- ${c.name}: ${c.description} (Strengths: ${c.strengths}, Weaknesses: ${c.weaknesses})`
    )
    .join("\n");

  const prompt = `You are a product strategist. Given this software idea and its competitors, suggest how to differentiate and fill market gaps.

Idea: ${idea.title} - ${idea.description}
Target: ${idea.targetRegion}, ${idea.targetAgeGroup}

Known competitors:
${competitorSummary}

Provide:
1. Key gaps in the current market that this product could fill
2. Specific features or approaches that would differentiate from competitors
3. A recommended positioning strategy
4. Potential unique value propositions

Be specific and actionable.`;

  return askClaude(prompt);
}
