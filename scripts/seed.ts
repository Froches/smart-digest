import { faker } from "@faker-js/faker";
import { Redis } from "@upstash/redis";
import { STATS_KEYS } from "../lib/redis";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Technical topics for realistic content
const TECH_TOPICS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "GraphQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Machine Learning",
  "DevOps",
  "Microservices",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "REST API",
  "WebSockets",
  "Tailwind CSS",
  "Vue.js",
  "Python",
  "Go",
];

// URL domains for realistic technical articles
const URL_DOMAINS = [
  "dev.to",
  "medium.com",
  "github.com/blog",
  "hackernoon.com",
  "freecodecamp.org",
  "css-tricks.com",
  "smashingmagazine.com",
  "blog.logrocket.com",
  "web.dev",
  "kentcdodds.com/blog",
];

function generateRealisticUrl(): string {
  const domain = faker.helpers.arrayElement(URL_DOMAINS);
  const topic = faker.helpers.arrayElement(TECH_TOPICS);
  const slug = faker.helpers
    .slugify(`${topic} ${faker.hacker.verb()} ${faker.hacker.noun()}`)
    .toLowerCase();

  return `https://${domain}/${slug}`;
}

function generateRealisticTitle(): string {
  const topic = faker.helpers.arrayElement(TECH_TOPICS);
  const templates = [
    `Understanding ${topic}: A Complete Guide`,
    `${topic} Best Practices in ${new Date().getFullYear()}`,
    `How to Master ${topic} in ${faker.number.int({ min: 5, max: 30 })} Minutes`,
    `${topic}: ${faker.hacker.verb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    `Advanced ${topic} Techniques You Should Know`,
    `Building ${faker.hacker.adjective()} ${faker.hacker.noun()} with ${topic}`,
    `${topic} vs ${faker.helpers.arrayElement(TECH_TOPICS)}: Which Should You Use?`,
    `The Ultimate ${topic} Tutorial for Developers`,
    `10 ${topic} Tips That Will Change Your Development`,
    `Why ${topic} is Perfect for ${faker.hacker.verb()} ${faker.hacker.noun()}`,
  ];

  return faker.helpers.arrayElement(templates);
}

function generateSummary(): string[] {
  const numParagraphs = faker.number.int({ min: 2, max: 4 });
  const paragraphs: string[] = [];

  for (let i = 0; i < numParagraphs; i++) {
    const sentences = faker.number.int({ min: 2, max: 4 });
    let paragraph = "";

    for (let j = 0; j < sentences; j++) {
      const topic = faker.helpers.arrayElement(TECH_TOPICS);
      paragraph += faker.helpers.arrayElement([
        `${topic} provides ${faker.hacker.adjective()} solutions for ${faker.hacker.verb()}ing ${faker.hacker.noun()}s. `,
        `This approach enables developers to ${faker.hacker.verb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}s efficiently. `,
        `By leveraging ${topic}, teams can ${faker.hacker.verb()} their ${faker.hacker.noun()} infrastructure seamlessly. `,
        `The ${faker.hacker.adjective()} architecture allows for ${faker.hacker.verb()}ing ${faker.hacker.noun()}s at scale. `,
        `Modern ${topic} implementations focus on ${faker.hacker.verb()}ing ${faker.hacker.adjective()} ${faker.hacker.noun()}s. `,
      ]);
    }

    paragraphs.push(paragraph.trim());
  }

  return paragraphs;
}

function generateKeyTakeaways(): string[] {
  const numTakeaways = faker.number.int({ min: 3, max: 5 });
  const takeaways: string[] = [];

  for (let i = 0; i < numTakeaways; i++) {
    const topic = faker.helpers.arrayElement(TECH_TOPICS);
    takeaways.push(
      faker.helpers.arrayElement([
        `${topic} enables ${faker.hacker.adjective()} ${faker.hacker.verb()}ing of ${faker.hacker.noun()}s`,
        `Understanding ${faker.hacker.adjective()} ${faker.hacker.noun()}s is crucial for modern development`,
        `${faker.hacker.verb().charAt(0).toUpperCase() + faker.hacker.verb().slice(1)}ing ${faker.hacker.adjective()} ${faker.hacker.noun()}s improves performance`,
        `Best practices include ${faker.hacker.verb()}ing ${faker.hacker.noun()}s with ${topic}`,
        `${topic} integration requires ${faker.hacker.adjective()} ${faker.hacker.noun()} architecture`,
      ]),
    );
  }

  return takeaways;
}

function generateQuiz() {
  const quiz = [];

  for (let i = 0; i < 3; i++) {
    const topic = faker.helpers.arrayElement(TECH_TOPICS);
    const correctAnswer = faker.number.int({ min: 0, max: 3 });

    const question = faker.helpers.arrayElement([
      `What is the primary benefit of using ${topic}?`,
      `How does ${topic} improve application performance?`,
      `Which approach is best for ${faker.hacker.verb()}ing ${faker.hacker.noun()}s?`,
      `What is the recommended way to implement ${topic}?`,
      `When should you use ${topic} in your project?`,
    ]);

    const options = [
      `${faker.hacker.verb().charAt(0).toUpperCase() + faker.hacker.verb().slice(1)}s ${faker.hacker.adjective()} ${faker.hacker.noun()}s`,
      `Enables ${faker.hacker.adjective()} ${faker.hacker.noun()} architecture`,
      `Provides ${faker.hacker.adjective()} ${faker.hacker.verb()}ing capabilities`,
      `Supports ${faker.hacker.adjective()} ${faker.hacker.noun()} integration`,
    ];

    quiz.push({
      question,
      options,
      correctAnswer,
    });
  }

  return quiz;
}

function generateTimestampInLastWeek(): number {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  return faker.number.int({ min: sevenDaysAgo, max: now });
}

function generateMockIp(): string {
  return faker.internet.ipv4();
}

async function seedDatabase() {
  console.log("🌱 Starting database seed...\n");

  const NUM_DIGESTS = faker.number.int({ min: 25, max: 30 });

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing data...");
    await redis.del(STATS_KEYS.TOTAL_DIGESTS);
    await redis.del(STATS_KEYS.RECENT_URLS);
    console.log("✅ Existing data cleared\n");

    console.log(`📝 Generating ${NUM_DIGESTS} mock digests...\n`);

    const digests = [];

    for (let i = 0; i < NUM_DIGESTS; i++) {
      const url = generateRealisticUrl();
      const title = generateRealisticTitle();
      const timestamp = generateTimestampInLastWeek();
      const processingTime = faker.number.int({ min: 800, max: 5000 });
      const ip = generateMockIp();

      const digest = {
        title,
        summary: generateSummary(),
        keyTakeaways: generateKeyTakeaways(),
        quiz: generateQuiz(),
      };

      const urlData = {
        url,
        title,
        timestamp,
        processingTime,
        ip,
      };

      digests.push({ digest, urlData, url });

      // Progress indicator
      if ((i + 1) % 5 === 0) {
        console.log(`  ✓ Generated ${i + 1}/${NUM_DIGESTS} digests...`);
      }
    }

    console.log(`\n💾 Saving ${NUM_DIGESTS} digests to Redis...\n`);

    // Sort by timestamp (oldest first, so newest will be at the top of the list)
    digests.sort((a, b) => a.urlData.timestamp - b.urlData.timestamp);

    // Save to Redis
    for (let i = 0; i < digests.length; i++) {
      const { digest, urlData, url } = digests[i];

      // Cache the digest (24 hour TTL)
      const cacheKey = `digest:${url}`;
      await redis.set(cacheKey, digest, {
        ex: 60 * 60 * 24, // 24 hours
      });

      // Increment total counter
      await redis.incr(STATS_KEYS.TOTAL_DIGESTS);

      // Add to recent URLs list (lpush adds to the beginning)
      await redis.lpush(STATS_KEYS.RECENT_URLS, JSON.stringify(urlData));

      // Progress indicator
      if ((i + 1) % 5 === 0) {
        console.log(`  ✓ Saved ${i + 1}/${NUM_DIGESTS} to Redis...`);
      }
    }

    // Trim to keep only the most recent 100 entries
    await redis.ltrim(STATS_KEYS.RECENT_URLS, 0, 99);

    console.log("\n✨ Database seed completed successfully!\n");

    // Display summary
    const totalDigests = await redis.get<number>(STATS_KEYS.TOTAL_DIGESTS);
    const recentUrls = await redis.lrange(STATS_KEYS.RECENT_URLS, 0, 4);

    console.log("📊 Summary:");
    console.log(`  Total digests: ${totalDigests}`);
    console.log(`  Recent URLs stored: ${recentUrls.length}`);
    console.log(`  Time range: Last 7 days`);
    console.log(`  Cache TTL: 24 hours`);

    console.log("\n🎯 Sample URLs seeded:");
    for (let i = 0; i < Math.min(5, digests.length); i++) {
      const item = JSON.parse(recentUrls[i]);
      console.log(`  ${i + 1}. ${item.title}`);
      console.log(`     ${item.url}`);
      console.log(`     ${new Date(item.timestamp).toLocaleString()}\n`);
    }

    console.log(
      "✅ You can now view the data at http://localhost:3000/admin\n",
    );
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log("🏁 Seed script finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });
