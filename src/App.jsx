import { useState, useEffect } from "react";

const SITE_NAME = "Daily News Uganda";
const SITE_URL = "https://www.dailynewsug.online";

// RSS feeds your site aggregates from
const RSS_SOURCES = [
  "https://www.monitor.co.ug/feed",
  "https://nilepost.co.ug/feed",
  "https://www.newvision.co.ug/feed",
  "https://chimp.net/feed",
  "https://www.bbc.com/news/world/africa/rss.xml",
  "https://allafrica.com/tools/rss2.0/uganda.xml",
];

const PROXY = "https://api.allorigins.win/get?url=";

const PLATFORMS = [
  {
    id: "twitter", name: "Twitter/X", icon: "𝕏", limit: 280, label: "Tweet", bg: "#000000",
    share: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook", name: "Facebook", icon: "f", limit: 500, label: "Post", bg: "#1877f2",
    share: (text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
  {
    id: "whatsapp", name: "WhatsApp", icon: "✉", limit: 700, label: "Message", bg: "#25d366",
    share: (text, url) => `https://wa.me/?text=${encodeURIComponent(text + "\n\n" + url)}`,
  },
  {
    id: "instagram", name: "Instagram", icon: "◈", limit: 500, label: "Caption",
    bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
    share: () => null,
  },
];

const CATEGORIES = [
  { id: "Politics", emoji: "🏛️" },
  { id: "Business", emoji: "💼" },
  { id: "Sports", emoji: "⚽" },
  { id: "Technology", emoji: "💻" },
  { id: "Health", emoji: "🏥" },
  { id: "Education", emoji: "📚" },
  { id: "Environment", emoji: "🌿" },
  { id: "Opinion", emoji: "✍️" },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body { background: #0f0e0c; overscroll-behavior: none; }
  .app { min-height: 100vh; min-height: 100dvh; background: #0f0e0c; color: #f0ebe0; font-family: 'Source Sans 3', sans-serif; max-width: 480px; margin: 0 auto; position: relative; padding-bottom: 100px; }
  .hdr { background: #0f0e0c; border-bottom: 2px solid #c8a44a; padding: 14px 18px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 50; }
  .hdr-icon { font-size: 28px; }
  .hdr-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 900; color: #f0ebe0; line-height: 1.2; }
  .hdr-sub { font-size: 9px; color: #c8a44a; letter-spacing: 2.5px; text-transform: uppercase; margin-top: 2px; }
  .steps-bar { display: flex; align-items: flex-start; justify-content: center; gap: 0; padding: 14px 18px; background: #18160f; border-bottom: 1px solid #2a2520; }
  .step-dot { width: 28px; height: 28px; border-radius: 50%; background: #2a2520; color: #7a6f5e; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s; }
  .step-dot.active { background: #c8a44a; color: #0f0e0c; }
  .step-dot.done { background: rgba(200,164,74,0.3); color: #c8a44a; }
  .step-line { flex: 1; height: 2px; background: #2a2520; max-width: 40px; margin-top: 14px; transition: background 0.3s; }
  .step-line.done { background: rgba(200,164,74,0.4); }
  .step-label { font-size: 9px; color: #7a6f5e; text-align: center; margin-top: 4px; }
  .steps-wrap { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .main { padding: 16px; }
  .card { background: #18160f; border: 1px solid #2a2520; border-radius: 14px; padding: 18px; margin-bottom: 16px; }
  .card-title { font-size: 15px; font-weight: 700; color: #f0ebe0; margin-bottom: 4px; }
  .card-sub { font-size: 12px; color: #7a6f5e; margin-bottom: 14px; }
  .api-input { width: 100%; background: #0f0e0c; border: 1px solid #2a2520; border-radius: 10px; padding: 13px 16px; color: #f0ebe0; font-size: 15px; outline: none; font-family: 'Source Sans 3', sans-serif; transition: border-color 0.2s; -webkit-appearance: none; }
  .api-input:focus { border-color: #c8a44a; }
  .api-hint { font-size: 11px; color: #7a6f5e; margin-top: 8px; line-height: 1.5; }
  .api-saved { font-size: 12px; color: #c8a44a; margin-top: 8px; }
  .badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(200,164,74,0.1); border: 1px solid rgba(200,164,74,0.25); border-radius: 20px; padding: 4px 12px; font-size: 11px; color: #c8a44a; margin-top: 10px; }
  .cats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .cat-btn { padding: 14px 10px; border-radius: 12px; border: 1px solid #2a2520; background: #0f0e0c; color: #7a6f5e; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 6px; -webkit-tap-highlight-color: transparent; }
  .cat-btn:active { transform: scale(0.97); }
  .cat-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .cat-btn.on { border-color: #c8a44a; background: rgba(200,164,74,0.12); color: #c8a44a; }
  .cat-emoji { font-size: 22px; }
  .headlines { display: flex; flex-direction: column; gap: 8px; }
  .hl-btn { text-align: left; padding: 14px 16px; border-radius: 12px; border: 1px solid #2a2520; background: #0f0e0c; color: #f0ebe0; font-size: 14px; font-family: 'Source Sans 3', sans-serif; cursor: pointer; line-height: 1.5; transition: all 0.2s; display: flex; align-items: flex-start; gap: 10px; width: 100%; -webkit-tap-highlight-color: transparent; }
  .hl-btn:active { transform: scale(0.99); }
  .hl-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .hl-btn.on { border-color: #c8a44a; background: rgba(200,164,74,0.08); color: #c8a44a; }
  .hl-num { color: #c8a44a; font-weight: 700; flex-shrink: 0; font-size: 13px; margin-top: 1px; min-width: 20px; }
  .hl-source { font-size: 10px; color: #7a6f5e; margin-top: 4px; }
  .ptabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 16px; scrollbar-width: none; }
  .ptabs::-webkit-scrollbar { display: none; }
  .ptab { flex-shrink: 0; padding: 8px 14px; border-radius: 20px; border: 1px solid #2a2520; background: transparent; color: #7a6f5e; font-size: 13px; font-weight: 600; font-family: 'Source Sans 3', sans-serif; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; -webkit-tap-highlight-color: transparent; }
  .ptab.on { border-color: #c8a44a; background: rgba(200,164,74,0.15); color: #c8a44a; }
  .article-img { width: 100%; height: 200px; object-fit: cover; border-radius: 12px; border: 1px solid #2a2520; display: block; margin-bottom: 14px; }
  .article-img-placeholder { width: 100%; height: 160px; border-radius: 12px; border: 1px solid #2a2520; background: #0f0e0c; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #7a6f5e; font-size: 12px; margin-bottom: 14px; }
  .article-img-placeholder span { font-size: 32px; }
  .source-box { background: #0f0e0c; border: 1px solid #2a2520; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; }
  .source-label { font-size: 10px; color: #7a6f5e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .source-name { font-size: 13px; color: #c8a44a; font-weight: 600; margin-bottom: 4px; }
  .source-link { font-size: 11px; color: #7a6f5e; word-break: break-all; line-height: 1.4; }
  .pcard { background: #0f0e0c; border: 1px solid #2a2520; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .pcard-hdr { display: flex; align-items: center; gap: 10px; }
  .picon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; font-weight: 700; flex-shrink: 0; }
  .pname { font-size: 14px; font-weight: 700; color: #f0ebe0; }
  .pcount { margin-left: auto; font-size: 12px; color: #7a6f5e; font-weight: 600; }
  .pcount.over { color: #e74c3c; }
  .pta { width: 100%; background: #18160f; border: 1px solid #2a2520; border-radius: 10px; padding: 13px; color: #f0ebe0; font-size: 14px; resize: none; outline: none; font-family: 'Source Sans 3', sans-serif; line-height: 1.6; transition: border-color 0.2s; min-height: 140px; -webkit-appearance: none; }
  .pta:focus { border-color: #c8a44a; }
  .btn-row { display: flex; gap: 10px; }
  .copy-btn { flex: 1; padding: 13px; border-radius: 10px; border: 1px solid #c8a44a; background: transparent; color: #c8a44a; font-size: 14px; font-weight: 700; font-family: 'Source Sans 3', sans-serif; cursor: pointer; transition: all 0.2s; -webkit-tap-highlight-color: transparent; }
  .copy-btn:active { transform: scale(0.97); }
  .copy-btn.ok { background: #c8a44a; color: #0f0e0c; }
  .regen-btn { padding: 13px 18px; border-radius: 10px; border: 1px solid #2a2520; background: transparent; color: #7a6f5e; font-size: 18px; cursor: pointer; transition: all 0.2s; -webkit-tap-highlight-color: transparent; }
  .regen-btn:active { transform: scale(0.97); }
  .regen-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .share-btn { width: 100%; padding: 14px; border-radius: 10px; border: none; color: #fff; font-size: 14px; font-weight: 700; font-family: 'Source Sans 3', sans-serif; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; -webkit-tap-highlight-color: transparent; }
  .share-btn:active { transform: scale(0.97); opacity: 0.9; }
  .ig-share { background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); }
  .ig-note { font-size: 11px; color: #7a6f5e; text-align: center; margin-top: 6px; line-height: 1.5; }
  .action-btn { width: 100%; padding: 16px; border-radius: 12px; border: none; background: #c8a44a; color: #0f0e0c; font-size: 15px; font-weight: 700; font-family: 'Source Sans 3', sans-serif; cursor: pointer; transition: all 0.2s; margin-top: 8px; -webkit-tap-highlight-color: transparent; }
  .action-btn:active { transform: scale(0.98); opacity: 0.9; }
  .loading { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 32px 0; color: #c8a44a; font-size: 14px; text-align: center; }
  .spinner { width: 32px; height: 32px; border: 3px solid #2a2520; border-top-color: #c8a44a; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner-sm { width: 14px; height: 14px; border: 2px solid #2a2520; border-top-color: #c8a44a; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
  .err-box { background: rgba(231,76,60,0.1); border: 1px solid #e74c3c; border-radius: 12px; padding: 14px 16px; font-size: 13px; color: #e74c3c; margin-top: 12px; line-height: 1.5; }
  .wm { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #7a6f5e; letter-spacing: 1px; text-transform: uppercase; }
  .hl-banner { background: rgba(200,164,74,0.08); border: 1px solid rgba(200,164,74,0.2); border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #c8a44a; line-height: 1.5; margin-bottom: 14px; }
  .hl-banner-label { font-size: 10px; color: #7a6f5e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: #18160f; border-top: 1px solid #2a2520; display: flex; z-index: 50; padding-bottom: env(safe-area-inset-bottom); }
  .nav-btn { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; align-items: center; gap: 3px; background: transparent; border: none; color: #7a6f5e; font-family: 'Source Sans 3', sans-serif; font-size: 10px; cursor: pointer; transition: all 0.2s; -webkit-tap-highlight-color: transparent; }
  .nav-btn.on { color: #c8a44a; }
  .nav-btn:disabled { opacity: 0.3; }
  .nav-icon { font-size: 20px; }
`;

const SCREEN = { KEY: "key", CATEGORY: "category", HEADLINES: "headlines", POSTS: "posts" };

// Parse RSS feed and find matching article
async function findArticleInRSS(feedUrl, headline) {
  try {
    const res = await fetch(`${PROXY}${encodeURIComponent(feedUrl)}`);
    const data = await res.json();
    const xml = data.contents || "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const items = Array.from(doc.querySelectorAll("item"));

    // Score each item by how many words match the headline
    const hlWords = headline.toLowerCase().split(/\s+/);
    let bestItem = null;
    let bestScore = 0;

    for (const item of items) {
      const title = (item.querySelector("title")?.textContent || "").toLowerCase();
      const score = hlWords.filter(w => w.length > 3 && title.includes(w)).length;
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }

    if (!bestItem || bestScore < 2) return null;

    // Extract image — try media:content, enclosure, or content
    const mediaContent = bestItem.querySelector("content")?.getAttribute("url")
      || bestItem.querySelector("[url]")?.getAttribute("url")
      || bestItem.getElementsByTagNameNS("*", "content")[0]?.getAttribute("url")
      || bestItem.getElementsByTagNameNS("*", "thumbnail")[0]?.getAttribute("url");

    // Also try to find image in description HTML
    const desc = bestItem.querySelector("description")?.textContent || "";
    const descImg = desc.match(/<img[^>]+src=["']([^"']+)["']/i);

    const image = mediaContent || (descImg ? descImg[1] : null);
    const link = bestItem.querySelector("link")?.textContent?.trim()
      || bestItem.querySelector("link")?.getAttribute("href") || "";
    const sourceName = new URL(feedUrl).hostname.replace("www.", "");

    return { image, link, sourceName, score: bestScore };
  } catch {
    return null;
  }
}

// Search all RSS feeds for the best matching article
async function findArticleFromAllFeeds(headline) {
  const results = await Promise.allSettled(
    RSS_SOURCES.map(feed => findArticleInRSS(feed, headline))
  );
  const valid = results
    .filter(r => r.status === "fulfilled" && r.value)
    .map(r => r.value)
    .sort((a, b) => b.score - a.score);
  return valid[0] || null;
}

export default function App() {
  const [screen, setScreen]                 = useState(SCREEN.CATEGORY);
  const [apiKey, setApiKey]                 = useState("");
  const [keySaved, setKeySaved]             = useState(false);
  const [category, setCategory]             = useState(null);
  const [headlines, setHeadlines]           = useState([]);
  const [selectedHL, setSelectedHL]         = useState(null);
  const [articleUrl, setArticleUrl]         = useState("");
  const [articleImage, setArticleImage]     = useState(null);
  const [sourceName, setSourceName]         = useState("");
  const [imageLoading, setImageLoading]     = useState(false);
  const [posts, setPosts]                   = useState({});
  const [activePlatform, setActivePlatform] = useState("twitter");
  const [loadingHL, setLoadingHL]           = useState(false);
  const [loadingPosts, setLoadingPosts]     = useState(false);
  const [loadingMsg, setLoadingMsg]         = useState("");
  const [regenLoading, setRegenLoading]     = useState({});
  const [copied, setCopied]                 = useState({});
  const [error, setError]                   = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("dnu_groq_key");
    if (saved) { setApiKey(saved); setKeySaved(true); }
    else setScreen(SCREEN.KEY);
  }, []);

  function handleKeyChange(val) {
    setApiKey(val);
    if (val.length > 10) { localStorage.setItem("dnu_groq_key", val); setKeySaved(true); }
    else { localStorage.removeItem("dnu_groq_key"); setKeySaved(false); }
  }

  async function callGroq(prompt) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 1500,
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.replace(/```json|```/g, "").trim();
  }

  async function fetchHeadlines(cat) {
    if (!apiKey) { setScreen(SCREEN.KEY); return; }
    setCategory(cat);
    setHeadlines([]);
    setSelectedHL(null);
    setPosts({});
    setArticleUrl("");
    setArticleImage(null);
    setSourceName("");
    setError("");
    setLoadingHL(true);
    setScreen(SCREEN.HEADLINES);
    try {
      const raw = await callGroq(
        `You are a news editor for ${SITE_NAME}, a Ugandan news aggregator.
Generate exactly 10 realistic, current-sounding news headlines for the category: ${cat}.
Headlines must be relevant to Uganda and East Africa.
Return ONLY a JSON array of 10 strings. No explanation, no numbering, no markdown.
Example: ["Headline one", "Headline two", ...]`
      );
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Could not read headlines. Please try again.");
      setHeadlines(JSON.parse(match[0]));
    } catch (e) {
      setError(e.message);
    }
    setLoadingHL(false);
  }

  async function generatePosts(headline) {
    setSelectedHL(headline);
    setPosts({});
    setArticleUrl("");
    setArticleImage(null);
    setSourceName("");
    setError("");
    setLoadingPosts(true);
    setScreen(SCREEN.POSTS);
    setActivePlatform("twitter");

    // Search RSS feeds for matching article + image
    setImageLoading(true);
    setLoadingMsg("Searching source websites for article & image...");
    const article = await findArticleFromAllFeeds(headline);
    const finalUrl = `${SITE_URL}/?s=${encodeURIComponent(headline)}`;
    const finalImage = article?.image || null;
    const finalSource = article?.sourceName || SITE_NAME;
    setArticleUrl(finalUrl);
    setArticleImage(finalImage);
    setSourceName(finalSource);
    setImageLoading(false);

    // Generate posts
    setLoadingMsg("Writing posts for all 4 platforms...");
    try {
      const raw = await callGroq(
        `You are a social media manager for ${SITE_NAME} (${SITE_URL}).
Write social media posts for this headline: "${headline}"
Original article source: ${finalSource}
Article link: ${finalUrl}

Return ONLY a JSON object with exactly these 4 keys. Each post MUST include the article link:
{
  "twitter": "Engaging tweet under 220 chars with 2-3 Uganda hashtags. End with: ${finalUrl}",
  "facebook": "Facebook post under 400 chars with hashtags. End with: Read more ➜ ${finalUrl}",
  "whatsapp": "WhatsApp message under 580 chars, conversational. End with: Full story: ${finalUrl}",
  "instagram": "Instagram caption under 400 chars with emojis and hashtags. End with the source site name."
}
No explanation. Only the JSON object.`
      );
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not read posts. Please try again.");
      setPosts(JSON.parse(match[0]));
    } catch (e) {
      setError(e.message);
    }
    setLoadingMsg("");
    setLoadingPosts(false);
  }

  async function regenOne(platformId) {
    if (!selectedHL) return;
    setRegenLoading(prev => ({ ...prev, [platformId]: true }));
    setError("");
    try {
      const raw = await callGroq(
        `You are a social media manager for ${SITE_NAME}.
Write a DIFFERENT ${platformId} post for: "${selectedHL}"
Article link: ${articleUrl}
Include the link naturally. Return ONLY: { "${platformId}": "post here" }`
      );
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not read response.");
      setPosts(prev => ({ ...prev, [platformId]: JSON.parse(match[0])[platformId] }));
    } catch (e) {
      setError(e.message);
    }
    setRegenLoading(prev => ({ ...prev, [platformId]: false }));
  }

  function handleCopy(platformId, text) {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [platformId]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [platformId]: false })), 2000);
  }

  function handleShare(platform) {
    const text = posts[platform.id] || "";
    const shareUrl = platform.share(text, articleUrl);
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    } else {
      navigator.clipboard.writeText(text);
      setTimeout(() => window.open("https://www.instagram.com", "_blank", "noopener,noreferrer"), 400);
    }
  }

  const currentPlatform = PLATFORMS.find(p => p.id === activePlatform);
  const currentText = posts[activePlatform] || "";
  const isOver = currentText.length > (currentPlatform?.limit || 999);
  const step = { [SCREEN.KEY]: 0, [SCREEN.CATEGORY]: 1, [SCREEN.HEADLINES]: 2, [SCREEN.POSTS]: 3 }[screen];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        <div className="hdr">
          <div className="hdr-icon">📰</div>
          <div>
            <div className="hdr-title">Daily News Uganda</div>
            <div className="hdr-sub">Social Post Generator</div>
          </div>
        </div>

        <div className="steps-bar">
          {["Key","Category","Headlines","Posts"].map((label, i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start" }}>
              {i > 0 && <div className={`step-line${i <= step ? " done" : ""}`}/>}
              <div className="steps-wrap">
                <div className={`step-dot${i === step ? " active" : i < step ? " done" : ""}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <div className="step-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="main">

          {/* KEY SCREEN */}
          {screen === SCREEN.KEY && (
            <div className="card">
              <div className="card-title">🔑 Groq API Key</div>
              <div className="card-sub">Free — get yours at console.groq.com</div>
              <input className="api-input" type="password" placeholder="Paste your key — gsk_..."
                value={apiKey} onChange={e => handleKeyChange(e.target.value)} />
              {keySaved
                ? <div className="api-saved">✓ Key saved — no need to paste again</div>
                : <div className="api-hint">Stored only in this browser. Never shared.</div>}
              <div className="badge">⚡ Llama 3.3 70B via Groq — Free & Fast</div>
              {apiKey.length > 10 && (
                <button className="action-btn" onClick={() => setScreen(SCREEN.CATEGORY)}>Continue →</button>
              )}
            </div>
          )}

          {/* CATEGORY SCREEN */}
          {screen === SCREEN.CATEGORY && (
            <div className="card">
              <div className="card-title">Choose a Category</div>
              <div className="card-sub">AI generates 10 Uganda-focused headlines</div>
              <div className="cats-grid">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} className={`cat-btn${category === cat.id ? " on" : ""}`}
                    onClick={() => fetchHeadlines(cat.id)} disabled={loadingHL}>
                    <span className="cat-emoji">{cat.emoji}</span>
                    {cat.id}
                  </button>
                ))}
              </div>
              {error && <div className="err-box">⚠ {error}</div>}
            </div>
          )}

          {/* HEADLINES SCREEN */}
          {screen === SCREEN.HEADLINES && (
            <div className="card">
              <div className="card-title">{category} Headlines</div>
              <div className="card-sub">Tap any headline to generate posts</div>
              {loadingHL ? (
                <div className="loading"><div className="spinner"/>Generating headlines...</div>
              ) : (
                <>
                  <div className="headlines">
                    {headlines.map((h, i) => (
                      <button key={i} className={`hl-btn${selectedHL === h ? " on" : ""}`}
                        onClick={() => generatePosts(h)} disabled={loadingPosts}>
                        <span className="hl-num">{i + 1}.</span>
                        <span>{h}</span>
                      </button>
                    ))}
                  </div>
                  <button className="action-btn"
                    style={{ background:"transparent", border:"1px solid #2a2520", color:"#7a6f5e", marginTop:16 }}
                    onClick={() => setScreen(SCREEN.CATEGORY)}>
                    ← Change Category
                  </button>
                </>
              )}
              {error && <div className="err-box">⚠ {error}</div>}
            </div>
          )}

          {/* POSTS SCREEN */}
          {screen === SCREEN.POSTS && (
            <div className="card">
              <div className="card-title">Generated Posts</div>

              {selectedHL && (
                <div className="hl-banner">
                  <div className="hl-banner-label">Headline</div>
                  {selectedHL}
                </div>
              )}

              {/* Article image */}
              {imageLoading ? (
                <div className="article-img-placeholder">
                  <div className="spinner" style={{ width:24, height:24, borderWidth:2 }}/>
                  <div>Searching source sites for image...</div>
                </div>
              ) : articleImage ? (
                <img src={articleImage} alt="Article" className="article-img"
                  onError={e => e.target.style.display="none"} />
              ) : (
                <div className="article-img-placeholder">
                  <span>🖼️</span>
                  <div>No image found on source sites</div>
                </div>
              )}

              {/* Source + link info */}
              {articleUrl && (
                <div className="source-box">
                  <div className="source-label">Original Source</div>
                  <div className="source-name">🌐 {sourceName}</div>
                  <div className="source-link">🔗 {articleUrl}</div>
                </div>
              )}

              {loadingPosts ? (
                <div className="loading">
                  <div className="spinner"/>
                  {loadingMsg || "Writing posts..."}
                </div>
              ) : (
                <>
                  <div className="ptabs">
                    {PLATFORMS.map(p => (
                      <button key={p.id} className={`ptab${activePlatform === p.id ? " on" : ""}`}
                        onClick={() => setActivePlatform(p.id)}>
                        <span>{p.icon}</span>{p.name}
                      </button>
                    ))}
                  </div>

                  {currentPlatform && (
                    <div className="pcard">
                      <div className="pcard-hdr">
                        <div className="picon" style={{ background: currentPlatform.bg }}>{currentPlatform.icon}</div>
                        <span className="pname">{currentPlatform.name}</span>
                        <span className={`pcount${isOver ? " over" : ""}`}>{currentText.length}/{currentPlatform.limit}</span>
                      </div>
                      <textarea className="pta" value={currentText} rows={6}
                        onChange={e => setPosts(prev => ({ ...prev, [activePlatform]: e.target.value }))} />
                      <div className="wm"><span>📰</span><span>Daily News Uganda</span></div>
                      <div className="btn-row">
                        <button className={`copy-btn${copied[activePlatform] ? " ok" : ""}`}
                          onClick={() => handleCopy(activePlatform, currentText)}>
                          {copied[activePlatform] ? "✓ Copied!" : "Copy"}
                        </button>
                        <button className="regen-btn" onClick={() => regenOne(activePlatform)}
                          disabled={regenLoading[activePlatform]} title="Get a different version">
                          {regenLoading[activePlatform] ? <span className="spinner-sm"/> : "↻"}
                        </button>
                      </div>

                      {/* SHARE BUTTON */}
                      {activePlatform !== "instagram" ? (
                        <button className="share-btn"
                          style={{ background: currentPlatform.bg }}
                          onClick={() => handleShare(currentPlatform)}>
                          {currentPlatform.icon} Share on {currentPlatform.name}
                        </button>
                      ) : (
                        <>
                          <button className="share-btn ig-share" onClick={() => handleShare(currentPlatform)}>
                            ◈ Copy Caption & Open Instagram
                          </button>
                          <div className="ig-note">
                            Caption copied! Just paste it when creating your Instagram post.
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <button className="action-btn"
                    style={{ background:"transparent", border:"1px solid #2a2520", color:"#7a6f5e", marginTop:8 }}
                    onClick={() => setScreen(SCREEN.HEADLINES)}>
                    ← Pick Another Headline
                  </button>
                </>
              )}

              {error && <div className="err-box">⚠ {error}</div>}
            </div>
          )}

        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          {[
            { s: SCREEN.KEY, icon: "🔑", label: "API Key", disabled: false },
            { s: SCREEN.CATEGORY, icon: "📂", label: "Category", disabled: false },
            { s: SCREEN.HEADLINES, icon: "📰", label: "Headlines", disabled: !headlines.length },
            { s: SCREEN.POSTS, icon: "✍️", label: "Posts", disabled: !selectedHL },
          ].map(n => (
            <button key={n.s} className={`nav-btn${screen === n.s ? " on" : ""}`}
              onClick={() => setScreen(n.s)} disabled={n.disabled}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>

      </div>
    </>
  );
}