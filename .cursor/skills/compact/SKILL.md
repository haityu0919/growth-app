---
name: compact
description: Summarize the current conversation briefly in Japanese. Use when the user asks for /compact, compact, コンパクトにまとめて, 今までのやり取りをまとめて, or a short handoff summary.
disable-model-invocation: true
---

# Compact

## Instructions

When this skill is used, summarize the conversation in easy Japanese.

Keep the response compact and practical:

1. State the app or task being worked on.
2. Summarize the main decisions.
3. Summarize completed work.
4. Mention current important files only when useful.
5. Mention the next likely step.

Avoid long explanations. Do not include every small troubleshooting detail unless it affects the next step.

## Output Format

Use this structure:

```markdown
ここまでのコンパクトまとめです。

現在は、[何を作っているか] を進めています。

決まっている方針:
- [重要方針]
- [重要方針]

実装済み:
- [完了した機能]
- [完了した機能]

次にやること:
- [次の作業]
```

## Style

- Respond in Japanese.
- Use plain words for non-programmers.
- Keep it short.
- Prefer bullets over long paragraphs.
- If technical terms are necessary, add a short explanation.
