import axios from "axios";
import { HF_API_TOKEN } from '../env';

const HF_MODEL = "google/gemma-2-2b-it:nebius";

export async function fetchAITipsFromMistral(
  weeklyTotals: Record<string, number>,
  totalWeekSpending: number
): Promise<string[]> {
  if (totalWeekSpending === 0) {
    return ["🧘 You haven't spent anything this week. Great self-control!"];
  }

  const breakdown = Object.entries(weeklyTotals)
    .map(([category, amount]) => {
      const pct = ((amount / totalWeekSpending) * 100).toFixed(1);
      return `- ${category}: RM${amount.toFixed(2)} (${pct}%)`;
    })
    .join("\n");

  const prompt = `
You are a smart but friendly financial coach. A user spent RM${totalWeekSpending.toFixed(2)} this week.

Here’s their weekly spending breakdown:
${breakdown}

Give ONE short coaching tip or encouragement (max 200 characters), based on the spending pattern. Use emojis. Avoid listing multiple tips.
`;

  try {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: HF_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data?.choices?.[0]?.message?.content?.trim();
    console.log(raw);

    if (!raw) throw new Error("No AI response content");

    return [raw];
  } catch (err: any) {
    console.error("AI Tip Fetch Error:", err?.response?.data || err.message);
    return ["⚠️ Could not generate AI tips at the moment. Try again later."];
  }
}
