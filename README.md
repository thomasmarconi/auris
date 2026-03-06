# Auris

Auris is an AI-powered chat app that helps you discover new music. Describe your mood, an activity, a genre, or artists you already love, and Auris will recommend songs, albums, and artists tailored to your taste — with an explanation of why each pick fits.

## Features

- **Conversational music recommendations** — chat naturally to get personalized suggestions
- **Streaming responses** — answers stream in token-by-token for a snappy feel
- **Full conversation context** — the entire chat history is sent with each request, so Auris remembers what you've discussed
- **Focused scope** — Auris only talks about music; off-topic requests are politely declined
- **Prompt injection protection** — user messages attempting to override the assistant's role are ignored

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | AWS Lambda (Node.js 24) with response streaming |
| AI Model | Amazon Nova Micro via AWS Bedrock Converse API |
| Infrastructure | AWS SAM (`template.yml`) |

## Project Structure

```
aws-chat-app/
├── frontend/          # React + Vite app
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   └── ChatWindow.jsx
│       └── hooks/
│           └── useChat.js   # Streaming fetch logic
└── backend/
    ├── index.js       # Lambda handler (streaming)
    ├── template.yml   # SAM infrastructure definition
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured with credentials that have Bedrock access
- AWS SAM CLI (for backend deployment)
- Amazon Nova Micro enabled in your AWS Bedrock console (us-east-2 by default)

### Backend

Deploy the Lambda function using SAM:

```bash
cd backend
npm install
sam build
sam deploy --guided
```

After deployment, SAM will output the `ChatFunctionUrl`. Copy it for the frontend setup.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=<your ChatFunctionUrl here>
```

Then start the dev server:

```bash
npm run dev
```

## Usage

Type a message in the chat input and press **Enter** (or click **Send**) to ask for music recommendations. Some example prompts:

- *"What should I listen to for a late-night drive?"*
- *"I love Radiohead and Bon Iver — what else might I enjoy?"*
- *"Recommend a jazz album for someone who's never really listened to jazz."*
- *"What's a good album to listen to front-to-back?"*
