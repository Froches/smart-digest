# 🧠 Verified Intelligence

A verification infrastructure platform that transforms articles into tamper-proof verified intelligence with cryptographic audit trails. Built with Next.js 15, TypeScript, and Google Gemini AI.

## 🔥 Technical Features

- **Cryptographic Verification**: SHA-256 content hashing creates immutable fingerprints for tamper detection
- **Type-Safe AI Integration**: Vercel AI SDK with Zod schema validation ensures guaranteed response structure
- **Intelligent Web Scraping**: Cheerio-based content extraction with multi-stage cleaning pipeline
- **SSR-Safe State Management**: Custom localStorage hook with hydration-proof architecture
- **Structured AI Output**: [`generateObject`](https://sdk.vercel.ai/docs) API enforces exact JSON schema compliance
- **Zero Runtime Errors**: End-to-end TypeScript + Zod validation from API to UI
- **Content Integrity Verification**: Real-time re-verification against stored cryptographic hashes

## 🏢 Production Features

- **Rate Limiting**: Upstash-powered sliding window (5 req/hour per IP) prevents abuse
- **Smart Caching**: 24-hour Redis cache reduces AI costs by ~70% for popular URLs
- **Admin Dashboard**: Password-protected `/admin` route with real-time statistics
- **Error Tracking**: Comprehensive logging with `[SYSTEM_ERROR]` prefix for easy monitoring
- **Performance Metrics**: Track processing time, cache hit rates, and usage patterns

## ✨ Features

- **Verification Infrastructure**: Cryptographic SHA-256 hashing creates tamper-proof content fingerprints
- **Immutable Audit Trail**: Every intelligence event includes source URL, timestamp, and content hash
- **URL-based Content Extraction**: Simply paste any article URL for verified analysis
- **AI-Powered Verified Intelligence**: Get concise, structured summaries with cryptographic verification
- **Content Integrity Verification**: Real-time button to re-verify content hasn't been tampered with
- **Interactive Quiz**: Test understanding with 3 auto-generated questions
- **Persistent Verification Ledger**: All verified events saved to localStorage with full audit trail
- **Security Badge**: Visual trust indicator showing verification metadata
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
4. **View the Security Badge** - See cryptographic verification metadata
5. Review the verified intelligence summary and insights
6. **Click "Verify Integrity"** - Re-verify content hasn't been tampered with
7. Take the quiz to test your understanding
8. Submit to see your score
9. **Browse your Verification Audit Trail** - All verified events are automatically saved
10. Click "View" on any audit trail card to restore it to the active slot
11. Use "Clear" to remove the active record or "Clear All" for history

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
