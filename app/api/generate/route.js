import OpenAI from "openai";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import RootLayout from "@/app/layout";

const systemprompt = `Generate 10 flashcards. Each flashcard should contain:

Front: A clear question or key term.
Back: A concise answer or definition.
Example (Optional): An example or additional detail to reinforce understanding.
Example:

Front: What is a closure?
Back: A function that retains access to its lexical scope, even when the function is executed outside that scope.
Example: A function returning another function that references variables from its parent scope.
Return in the following JSON format 
{
    "flashcards": [
        {
            "front": str,
            "back": str
        }
    ]
}
`
//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
export async function POST(req)
{
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: "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",
    });
    const data = await req.text();

    const completion = await openai.chat.completions.create({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages:[
            {role: "system", content: systemprompt},
            {role: 'user', content: data},
        ],
        response_format: {type: 'json_object'}
    })

    const flashcards = JSON.parse(completion.choices[0].messages.content);
    return NextResponse.json(flashcards.flashcard)
}