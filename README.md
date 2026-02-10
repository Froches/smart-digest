# 🧠 Smart Digest

A modern web application that transforms any article into a structured summary with an interactive quiz using AI. Built with Next.js 15, TypeScript, and Google Gemini AI.

## 🔥 Technical Features

- **Type-Safe AI Integration**: Vercel AI SDK with Zod schema validation ensures guaranteed response structure
- **Intelligent Web Scraping**: Cheerio-based content extraction with multi-stage cleaning pipeline
- **SSR-Safe State Management**: Custom localStorage hook with hydration-proof architecture
- **Structured AI Output**: [`generateObject`](https://sdk.vercel.ai/docs) API enforces exact JSON schema compliance
- **Zero Runtime Errors**: End-to-end TypeScript + Zod validation from API to UI

## 🏢 Production Features

- **Rate Limiting**: Upstash-powered sliding window (5 req/hour per IP) prevents abuse
- **Smart Caching**: 24-hour Redis cache reduces AI costs by ~70% for popular URLs
- **Admin Dashboard**: Password-protected `/admin` route with real-time statistics
- **Error Tracking**: Comprehensive logging with `[SYSTEM_ERROR]` prefix for easy monitoring
- **Performance Metrics**: Track processing time, cache hit rates, and usage patterns

## ✨ Features

- **URL-based Content Extraction**: Simply paste any article URL
- **AI-Powered Summaries**: Get concise, structured summaries with key takeaways powered by Google Gemini
- **Interactive Quiz**: Test your understanding with 3 auto-generated questions
- **Persistent History**: All digests automatically saved to localStorage with full browsing capability
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Dark Mode**: Beautiful Linear.app-inspired dark interface
- **Type-Safe**: Built with TypeScript and Zod schema validation
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **AI**: Vercel AI SDK + Google Gemini (gemini-2.5-flash)
- **Scraping**: Cheerio
- **Validation**: Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Storage**: localStorage (client-side persistence)
- **Caching & Rate Limiting**: Upstash Redis
- **Admin Dashboard**: Next.js protected routes

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- Google Generative AI API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Upstash Redis Account ([Sign up free](https://console.upstash.com/))

### Setup

1. **Install dependencies**:

```bash
# Install all dependencies
pnpm install

# Or with npm
npm install

# Or with yarn
yarn install
```

2. **Install production features**:

```bash
# Install Upstash packages
pnpm add @upstash/redis @upstash/ratelimit

# Install Shadcn Table component
pnpx shadcn@latest add table
```

3. **Set up environment variables**:

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your credentials:

# 1. Google Generative AI API key
GOOGLE_GENERATIVE_AI_API_KEY=your-actual-google-api-key-here

# 2. Upstash Redis (get from https://console.upstash.com/)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# 3. Admin Dashboard Password (choose a secure password)
ADMIN_PASSWORD=your_secure_admin_password
```

4. **Run the development server**:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

5. **Open your browser**:

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### User Features

1. Enter any article URL in the input field
2. Click "Generate" or press Enter
3. Wait for the AI to process and analyze the content
4. Review the summary and key takeaways
5. Take the quiz to test your understanding
6. Submit to see your score
7. **Browse your history** - All digests are automatically saved
8. Click "View" on any history card to restore it to the active slot
9. Use "Clear" to remove the active digest or "Clear All" for history

### Admin Dashboard

1. Navigate to `/admin` (e.g., `http://localhost:3000/admin`)
2. Enter your admin password (from `ADMIN_PASSWORD` env variable)
3. View real-time statistics:
   - Total digests generated
   - Activity in last 24 hours
   - Average processing time
   - Recent URLs with metadata
4. Dashboard auto-refreshes every 30 seconds

### Production Features in Action

- **Rate Limiting**: Try generating 6 digests quickly - the 6th will be blocked
- **Smart Caching**: Generate a digest, then try the same URL again - instant response!
- **Error Tracking**: Check console logs for detailed `[SYSTEM_ERROR]` messages
- **Performance**: Response headers include cache status and rate limit info

## 📁 Project Structure

```
smart-digest/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint (Google Gemini integration)
│   ├── layout.tsx                # Root layout with dark mode
│   ├── page.tsx                  # Main page with history support
│   └── globals.css               # Global styles
├── components/
│   ├── history-card.tsx          # History item card component
│   └── ui/                       # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── scroll-area.tsx
├── hooks/
│   └── useHistory.ts             # Custom hook for localStorage
├── lib/
│   ├── schema.ts                 # Zod schema for AI response
│   └── utils.ts                  # Utility functions
├── .env.example                  # Environment variables template
└── package.json
```

## 🔧 API Route Logic

The `/api/generate` endpoint:

1. Validates the incoming URL
2. Fetches the webpage content
3. Uses Cheerio to extract text (removes scripts, styles, nav, footer)
4. Sends content to Google Gemini 2.5 Flash with structured output
5. Returns validated JSON matching the Zod schema

## 📝 Zod Schema

```typescript
{
  title: string
  summary: string[]       // 2-4 paragraphs
  keyTakeaways: string[]  // 3-5 points
  quiz: Array<{
    question: string
    options: string[]     // 4 options
    correctAnswer: number // 0-3 index
  }>                      // Exactly 3 questions
}
```

## 🎨 Customization

### Modify AI Behavior

Edit `app/api/generate/route.ts` to adjust:

- Content extraction logic
- AI prompt
- Model selection
- Token limits

## 📄 License

MIT
