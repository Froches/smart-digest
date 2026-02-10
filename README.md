# 🧠 Smart Digest

A modern web application that transforms any article into a structured summary with an interactive quiz using AI. Built with Next.js 15, TypeScript, and OpenAI's GPT-4o-mini.

## ✨ Features

- **URL-based Content Extraction**: Simply paste any article URL
- **AI-Powered Summaries**: Get concise, structured summaries with key takeaways
- **Interactive Quiz**: Test your understanding with 3 auto-generated questions
- **Dark Mode**: Beautiful Linear.app-inspired dark interface
- **Type-Safe**: Built with TypeScript and Zod schema validation

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **AI**: Vercel AI SDK + OpenAI (gpt-4o-mini)
- **Scraping**: Cheerio
- **Validation**: Zod
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

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
# AI SDK and OpenAI
npm install ai @ai-sdk/openai zod

# Scraping
npm install cheerio
npm install -D @types/cheerio

# Icons
npm install lucide-react

# Shadcn UI dependencies
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot
npm install -D tailwindcss-animate
```

3. **Set up environment variables**:

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your OpenAI API key
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

4. **Run the development server**:

```bash
npm run dev
# or
pnpm dev
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
6. Submit to see your score!

## 📁 Project Structure

```
smart-digest/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint for content processing
│   ├── layout.tsx                # Root layout with dark mode
│   ├── page.tsx                  # Main page component
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
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
4. Sends content to OpenAI GPT-4o-mini with structured output
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
