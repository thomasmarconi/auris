import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "us-east-2"
});

export const handler = awslambda.streamifyResponse(
  async (event, responseStream, _context) => {
    const { messages } = JSON.parse(event.body ?? "{}");

    const stream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain"
      }
    });

    try {
      const response = await client.send(
        new InvokeModelWithResponseStreamCommand({
          modelId: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1024,
            system: "You are a helpful assistant.",
            messages
          })
        })
      );

      for await (const chunk of response.body) {
        if (chunk.chunk) {
          const parsed = JSON.parse(
            new TextDecoder().decode(chunk.chunk.bytes)
          );
          if (parsed.type === "content_block_delta") {
            stream.write(parsed.delta?.text ?? "");
          }
        }
      }
    } catch (err) {
      console.error(err);
      stream.write(`\n[Error: ${err.message}]`);
    } finally {
      stream.end();
    }
  }
);
