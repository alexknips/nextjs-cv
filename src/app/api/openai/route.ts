import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export interface OpenAiRequestData {
  question: string;
}

interface Datastore {
  threadId: undefined | string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const assistantId = "asst_HPuMBr1iPksfctoFk0jFQF1z";

let dataStore: Datastore = { threadId: undefined };

export const GET = async () => {
  const openai = new OpenAI();
  const assistants = await openai.beta.assistants.list();
  return NextResponse.json(
    { message: assistants.data.map((x) => x.id).join(",") },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  try {
    const data: OpenAiRequestData = await req.json();
    const openai = new OpenAI();

    const threadId = await (async () => {
      if (dataStore.threadId === undefined) {
        console.log("Creating new thread");
        const thread = await openai.beta.threads.create();
        dataStore.threadId = thread.id;
        return thread.id;
      } else {
        console.log("Re-using old thread");
        return dataStore.threadId;
      }
    })();

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: data.question,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    await delay(3000);

    // Now, you might need to poll for messages
    // This is a simplified example; you'll need to add actual polling logic
    let completed = false;
    let failed = false;
    while (!completed && !failed) {
      let runResponse = await openai.beta.threads.runs.retrieve(
      threadId,
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
      const messages = await openai.beta.threads.messages.list(threadId);
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
