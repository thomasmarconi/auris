import {
  BedrockRuntimeClient,
  ConverseStreamCommand
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

    // Converse API requires content as an array of content blocks
    const converseMessages = messages.map(({ role, content }) => ({
      role,
      content: [{ text: content }]
    }));

    try {
      const response = await client.send(
        new ConverseStreamCommand({
          modelId: "amazon.nova-micro-v1:0",
          messages: converseMessages,
          system: [{ text: "You are a helpful assistant." }],
          inferenceConfig: {
            maxTokens: 1000,
            temperature: 0.7
          }
        })
      );

      for await (const chunk of response.stream) {
        if (chunk.contentBlockDelta) {
          stream.write(chunk.contentBlockDelta.delta?.text ?? "");
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
