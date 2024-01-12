import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import OpenAI from "openai";
import CosmosDBWrapper from "./dataStore";
const assistantId = "asst_HPuMBr1iPksfctoFk0jFQF1z";
const cosmosDBWrapper = new CosmosDBWrapper();

export interface OpenAiRequestData {
  question: string;
  userKey: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function openaiHttp(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("JavaScript HTTP trigger function processed a request.");
  try {
    const data: OpenAiRequestData = (await request.json()) as OpenAiRequestData;
    const openai = new OpenAI();
    const threadId = await (async () => {
      const threadId = cosmosDBWrapper.getThreadId(data.userKey);
      if (threadId === undefined) {
        console.log("Creating new thread");
        const thread = await openai.beta.threads.create();
        cosmosDBWrapper.saveThreadId(data.question, thread.id);
        return thread.id;
      } else {
        console.log("Re-using old thread");
        return threadId;
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
      return {
        body: JSON.stringify({ message: answerString }),
        status: 200,
      };
    } else {
      return {
        body: JSON.stringify({ message: "AI failed to answer" }),
        status: 400,
      };
    }
  } catch (error) {
    // Handle errors and send an error response
    return {
      body: JSON.stringify({ message: "Internal Server Error" }),
      status: 500,
    };
  }
}

app.http("openai", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: openaiHttp,
});