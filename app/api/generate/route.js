import OpenAI from "openai";
import { NextResponse } from "next/server";

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it with questions on the front and answers in back. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long. 

 and get just the flashcards
No matter what You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
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
            {role: "system", content: systemPrompt},
            {role: 'user', content: data},
        ],
        response_format: {type: 'json_object'}
    })
    console.log(completion.choices[0].message);

    console.log(completion.choices[0].message.content);

    const flashcards = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(flashcards.flashcards)
}