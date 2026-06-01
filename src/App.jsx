import { useState } from "react";

const PLATFORMS = [
  { id: "twitter",   name: "Twitter/X",  icon: "𝕏", limit: 280,  label: "Tweet",   bg: "#000000" },
  { id: "facebook",  name: "Facebook",   icon: "f",  limit: 500,  label: "Post",    bg: "#1877f2" },
  { id: "whatsapp",  name: "WhatsApp",   icon: "✉",  limit: 700,  label: "Message", bg: "#25d366" },
  { id: "instagram", name: "Instagram",  icon: "◈",  limit: 500,  label: "Caption", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
];

const CATEGORIES = [
  { id: "Politics",     emoji: "🏛️" },
  { id: "Business",    emoji: "💼" },
  { id: "Sports",      emoji: "⚽" },
  { id: "Technology",  emoji: "💻" },
  { id: "Health",      emoji: "🏥" },
  { id: "Education",   emoji: "📚" },
  { id: "Environment", emoji: "🌿" },
  { id: "Opinion",     emoji: "✍️" },
];

export default function App() {
  const [category, setCategory] = useState(null);
  const [headlines, setHeadlines] = useState([]);
  const [selectedHeadline, setSelectedHeadline] = useState(null);
  const [posts, setPosts] = useState({});
  const [apiKey, setApiKey] = useState("");
  const [loadingHeadlines, setLoadingHeadlines] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [copied, setCopied] = useState({});
  const [error, setError] = useState("");

  // STEP 1: Fetch headlines from Claude AI for the chosen category
  async function fetchHeadlines(cat) {
    setCategory(cat);
    setHeadlines([]);
    setSelectedHeadline(null);
    setPosts({});
    setError("");
    setLoadingHeadlines(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a news editor for Daily News Uganda, a Ugandan news website. 
Generate exactly 10 realistic, current-sounding news headlines for the category: ${cat}.
The headlines should be relevant to Uganda and East Africa.
Return ONLY a JSON array of 10 headline strings, nothing else. No explanation, no numbering.
Example format: ["Headline one here", "Headline two here", ...]`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setHeadlines(parsed);
    } catch (err) {
      setError("Could not load headlines. Check your API key and try again.");
    }

    setLoadingHeadlines(false);
  }

  // STEP 2: Generate social media posts for the selected headline
  async function generatePosts(headline) {
    setSelectedHeadline(headline);
    setPosts({});
    setError("");
    setLoadingPosts(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: `You are a social media manager for Daily News Uganda.
Write social media posts for this headline: "${headline}"

Return ONLY a JSON object with exactly these 4 keys:
{
  "twitter": "A tweet under 260 characters with 2-3 hashtags",
  "facebook": "A Facebook post under 480 characters, friendly tone, with hashtags",
  "whatsapp": "A WhatsApp message under 680 characters, conversational tone",
  "instagram": "An Instagram caption under 480 characters with emojis and hashtags"
}
No explanation. Only the JSON object.`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPosts(parsed);
    } catch (err) {
      setError("Could not generate posts. Please try again.");
    }

    setLoadingPosts(false);
  }

  function handleCopy(platformId, text) {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [platformId]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [platformId]: false })), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e0c", color: "#f0ebe0", fontFamily: "sans-serif", padding: "24px" }}>
      
      {/* HEADER */}
      <div style={{ borderBottom: "2px solid #c8a44a", paddingBottom: "16px", marginBottom: "28px" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "#f0ebe0", marginBottom: "4px" }}>
          📰 Daily News Uganda
        </h1>
        <p style={{ fontSize: "12px", color: "#c8a44a", letterSpacing: "2px", textTransform: "uppercase" }}>
          Social Media Post Generator
        </p>
      </div>

      {/* API KEY INPUT */}
      <div style={{ background: "#18160f", border: "1px solid #2a2520", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", color: "#7a6f5e", marginBottom: "8px" }}>🔑 Your Anthropic API Key</p>
        <input
          type="password"
          placeholder="Paste your API key here..."
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          style={{ width: "100%", background: "#0f0e0c", border: "1px solid #2a2520", borderRadius: "6px", padding: "10px 14px", color: "#f0ebe0", fontSize: "14px", outline: "none" }}
        />
        <p style={{ fontSize: "11px", color: "#7a6f5e", marginTop: "6px" }}>Your key is never saved or sent anywhere except directly to Anthropic.</p>
      </div>

      {/* STEP 1: CATEGORY PICKER */}
      <div style={{ background: "#18160f", border: "1px solid #2a2520", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#c8a44a", color: "#0f0e0c", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#f0ebe0" }}>Choose a Category</p>
            <p style={{ fontSize: "11px", color: "#7a6f5e" }}>AI will generate 10 headlines for you</p>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => apiKey ? fetchHeadlines(cat.id) : setError("Please enter your API key first!")}
              style={{
                padding: "7px 14px", borderRadius: "24px",
                border: category === cat.id ? "1px solid #c8a44a" : "1px solid #2a2520",
                background: category === cat.id ? "rgba(200,164,74,0.15)" : "transparent",
                color: category === cat.id ? "#c8a44a" : "#7a6f5e",
                fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px"
              }}
            >
              {cat.emoji} {cat.id}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: HEADLINES */}
      {(loadingHeadlines || headlines.length > 0) && (
        <div style={{ background: "#18160f", border: "1px solid #2a2520", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#c8a44a", color: "#0f0e0c", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#f0ebe0" }}>Pick a Headline</p>
              <p style={{ fontSize: "11px", color: "#7a6f5e" }}>Click any headline to generate social media posts</p>
            </div>
          </div>
          {loadingHeadlines ? (
            <p style={{ color: "#c8a44a", fontSize: "13px" }}>⏳ Generating headlines...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {headlines.map((h, i) => (
                <button
                  key={i}
                  onClick={() => generatePosts(h)}
                  style={{
                    textAlign: "left", padding: "12px 16px", borderRadius: "8px",
                    border: selectedHeadline === h ? "1px solid #c8a44a" : "1px solid #2a2520",
                    background: selectedHeadline === h ? "rgba(200,164,74,0.1)" : "#0f0e0c",
                    color: selectedHeadline === h ? "#c8a44a" : "#f0ebe0",
                    fontSize: "13px", cursor: "pointer", lineHeight: "1.5"
                  }}
                >
                  {i + 1}. {h}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: GENERATED POSTS */}
      {(loadingPosts || Object.keys(posts).length > 0) && (
        <div style={{ background: "#18160f", border: "1px solid #2a2520", borderRadius: "10px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#c8a44a", color: "#0f0e0c", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#f0ebe0" }}>Your Generated Posts</p>
              <p style={{ fontSize: "11px", color: "#7a6f5e" }}>Edit if needed, then copy to your social media</p>
            </div>
          </div>
          {loadingPosts ? (
            <p style={{ color: "#c8a44a", fontSize: "13px" }}>⏳ Writing posts for all platforms...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {PLATFORMS.map(p => (
                <div key={p.id} style={{ background: "#0f0e0c", border: "1px solid #2a2520", borderRadius: "10px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: "700", flexShrink: 0 }}>
                      {p.icon}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#f0ebe0" }}>{p.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: "11px", color: (posts[p.id] || "").length > p.limit ? "#e74c3c" : "#7a6f5e" }}>
                      {(posts[p.id] || "").length}/{p.limit}
                    </span>
                  </div>
                  <textarea
                    value={posts[p.id] || ""}
                    rows={6}
                    onChange={e => setPosts(prev => ({ ...prev, [p.id]: e.target.value }))}
                    style={{ width: "100%", background: "#18160f", border: "1px solid #2a2520", borderRadius: "6px", padding: "10px", color: "#f0ebe0", fontSize: "12px", resize: "vertical", outline: "none", fontFamily: "sans-serif", lineHeight: "1.5" }}
                  />
                  <button
                    onClick={() => handleCopy(p.id, posts[p.id])}
                    style={{ marginTop: "10px", width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #c8a44a", background: copied[p.id] ? "#c8a44a" : "transparent", color: copied[p.id] ? "#0f0e0c" : "#c8a44a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                  >
                    {copied[p.id] ? "✓ Copied!" : `Copy ${p.label}`}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid #e74c3c", borderRadius: "8px", padding: "12px 16px", marginTop: "16px", fontSize: "13px", color: "#e74c3c" }}>
          ⚠ {error}
        </div>
      )}

    </div>
  );
}