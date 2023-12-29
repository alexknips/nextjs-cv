// src/api/myOpenApiRoute.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type ResponseData = {
  message: string;
};

type ResponseError = {
  error: string;
};

export interface OpenAiRequestData {
  question: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const GET = async () => {
  const openai = new OpenAI();
  const assistants = await openai.beta.assistants.list();
  return NextResponse.json(
    { message: assistants.data.map((x) => x.id).join(",") },
    { status: 200 }
  );
};

const assistantId = "asst_HPuMBr1iPksfctoFk0jFQF1z";
export const POST = async (request: NextRequest) => {
  try {
    const data: OpenAiRequestData = await request.json();
    const openai = new OpenAI();
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: data.question,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      //   instructions: data.intructions,
    });
    await delay(3000);

    // Now, you might need to poll for messages
    // This is a simplified example; you'll need to add actual polling logic
    let completed = false;
    let failed = false;
    while (!completed && !failed) {
      let runResponse = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      console.log(runResponse.status);
      // messages = response.; // or however the messages are structured in the response
      completed = runResponse.status == "completed"; // Check if the run is completed
      failed =
        runResponse.status == "failed" ||
        runResponse.status == "cancelled" ||
        runResponse.status == "cancelling" ||
        runResponse.status == "expired" ||
        runResponse.status == "requires_action";
      // You might want to add a delay here to avoid hitting the API too frequently
      await delay(1000);
    }
    if (completed) {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const answers = messages.data.filter((x) => x.role == "assistant");
      console.log(JSON.stringify(messages));
      const answerString = answers
        .map((x) =>
          x.content
            .map((y) => (y.type == "text" ? y.text.value : ""))
            .join("\n")
        )
        .join("\n")
        .replace(/【.*?】/g, "");
      return NextResponse.json({ message: answerString }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "AI failed to answer" },
        { status: 400 }
      );
    }
  } catch (error) {
    // Handle errors and send an error response
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// const openai = new OpenAI();
// const completion = await openai.chat.completions.create({
//   messages: [{ role: "system", content: "You are a helpful assistant." }],
//   model: "gpt-3.5-turbo",
// });
// console.log(JSON.stringify(completion));
// console.log(completion.choices[0].message);
