// netlify/functions/claude.js
// Proxies Anthropic API calls and augments queries with live web search via Tavily

async function searchWeb(query) {
  const tavilyKey = process.env.Tavily_Key;
  if (!tavilyKey) return null;

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: `${query} startup hiring talent market 2025`,
        search_depth: "basic",
        max_results: 5,
        include_answer: false,
      }),
    });
    const data = await res.json();
    return data.results || [];
  } catch {
    return null;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  try {
    const body = JSON.parse(event.body);

    // Extract the user's query from the message
    const userQuery = body.messages?.[0]?.content || "";

    // Run web search in parallel with preparing the request
    const webResults = await searchWeb(userQuery);

    // Append web results to the system prompt if we got any
    let system = body.system || "";
    if (webResults && webResults.length > 0) {
      const webContext = webResults
        .map((r, i) => `[${i + 1}] ${r.title}\n${r.url}\n${r.content?.slice(0, 400)}`)
        .join("\n\n");
      system += `\n\nLIVE WEB SEARCH RESULTS for "${userQuery}":\n${webContext}\n\nUse these results to add current market context beyond the signals above. Cite specific sources where relevant.`;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.Anthropic_Key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ ...body, system }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
