# 🧠 Smart Digest

A modern web application that transforms any article into a structured summary with an interactive quiz using AI. Built with Next.js 15, TypeScript, and Google Gemini AI.

## 🔥 Technical Features

- **Type-Safe AI Integration**: Vercel AI SDK with Zod schema validation ensures guaranteed response structure
- **Intelligent Web Scraping**: Cheerio-based content extraction with multi-stage cleaning pipeline
- **SSR-Safe State Management**: Custom localStorage hook with hydration-proof architecture
- **Structured AI Output**: [`generateObject`](https://sdk.vercel.ai/docs) API enforces exact JSON schema compliance
- **Zero Runtime Errors**: End-to-end TypeScript + Zod validation from API to UI

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
- **AI**: Vercel AI SDK + Google Gemini (gemini-1.5-flash)
- **Scraping**: Cheerio
- **Validation**: Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Storage**: localStorage (client-side persistence)

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- Google Generative AI API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Setup

1. **Install dependencies**:

```bash
# Install all dependencies
npm install

# Or with pnpm
pnpm install

# Or with yarn
yarn install
```

2. **Install required packages**:

```bash
# AI SDK and Google Generative AI
pnpm install ai @ai-sdk/google zod

# Scraping
pnpm install cheerio

# Icons and Animations
pnpm install lucide-react framer-motion

# Shadcn UI dependencies
pnpm install class-variance-authority clsx tailwind-merge
pnpm install @radix-ui/react-slot @radix-ui/react-scroll-area
```

3. **Set up environment variables**:

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Google Generative AI API key
GOOGLE_GENERATIVE_AI_API_KEY=your-actual-google-api-key-here
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

1. Enter any article URL in the input field
2. Click "Generate" or press Enter
3. Wait for the AI to process and analyze the content
4. Review the summary and key takeaways
5. Take the quiz to test your understanding
6. Submit to see your score
7. **Browse your history** - All digests are automatically saved
8. Click "View" on any history card to restore it to the active slot
9. Use "Clear" to remove the active digest or "Clear All" for history

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
4. Sends content to Google Gemini (gemini-1.5-flash) with structured output
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

### Styling

- Update `tailwind.config.ts` for theme customization
- Modify `app/globals.css` for CSS variables
- Edit component styles in `app/page.tsx`

## 🔒 Security Notes

- Never commit `.env.local` or API keys to version control
- API key is only used server-side
- Consider adding rate limiting for production
- Validate and sanitize all user inputs

## 📄 License

MIT

## 🙏 Credits

Built with modern web technologies and AI tools.

---

Made with ❤️ using Next.js and OpenAI
