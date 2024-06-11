import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export const getMermaidFromPrompt = async (prompt: string) => {
    return await generateText({
        model: openai("gpt-4-turbo"),
        prompt: prompt
        })
}