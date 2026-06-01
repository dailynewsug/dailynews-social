import { useState, useEffect } from "react";

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

// Free models to try in order — if one fails, next is tried automatically
const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "qwen/qwen-2-7b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f0e0c; }
  .app { min-height: 100vh; background: #0f0e0c; color: #f0ebe0; font-family: 'Source Sans 3', sans-serif; padding-bottom: 80px; }
  .hdr { background: #0f0e0c; border-bottom: 2px solid #c8a44a; padding: 16px 28px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 30; }
  .hdr-icon { font-size: 32px; }
  .hdr-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; color: #f0ebe0; letter-spacing: -0.3px; }
  .hdr-sub { font-size: 10px; color: #c8a44a; letter-spacing: 3px; text-transform: uppercase; margin-top: 2px; }
  .main { max-width: 980px; margin: 0 auto; padding: 28px 18px 0; }
  .card { background: #18160f; border: 1px solid #2a2520; border-radius: 12px; padding: 22px; margin-bottom: 22px; }
  .step-hdr { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
  .step-num { width: 28px; height: 28px; border-radius: 50%; background: #c8a44a; color: #0f0e0c; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .step-title { font-size: 14px; font-weight: 600; color: #f0ebe0; }
  .step-sub { font-size: 11px; color: #7a6f5e; margin-top: 2px; }
  .api-input { width: 100%; background: #0f0e0c; border: 1px solid #2a2520; border-radius: 8px; padding: 11px 16px; color: #f0ebe0; font-size: 14px; outline: none; font-family: 'Source Sans 3', sans-serif; transition: border-color 0.2s; }
  .api-input:focus { border-color: #c8a44a; }
  .api-hint { font-size: 11px; color: #7a6f5e; margin-top: 7px; }
  .api-saved { font-size: 11px; color: #c8a44a; margin-top: 7px; }
  .badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(200,164,74,0.1); border: 1px solid rgba(200,164,74,0.3); border-radius: 20px; padding: 3px 10px; font-size: 10px; color: #c8a44a; margin-top: 8px; }
  .cats { display: flex; flex-wrap: wrap; gap: 9px; }
  .cat { padding: 8px 16px; border-radius: 24px; border: 1px solid #2a2520; background: transparent; color: #7a6f5e; font-family: 'Source Sans 3', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
  .cat:hover { border-color: #c8a44a; color: #c8a44a; background: rgba(200,164,74,0.08); }
  .cat.on { border-color: #c8a44a; color: #c8a44a; background: rgba(200,164,74,0.15); font-weight: 600; }
  .cat:disabled { opacity: 0.5; cursor: not-allowed; }
  .headlines { display: flex; flex-direction: column; gap: 9px; }
  .hl-btn { text-align: left; padding: 13px 17px; border-radius: 9px; border: 1px solid #2a2520; background: #0f0e0c; color: #f0ebe0; font-size: 13px; font-family: 'Source Sans 3', sans-serif; cursor: pointer; line-height: 1.5; transition: all 0.2s; display: flex; align-items: flex-start; gap: 10px; }
  .hl-btn:hover { border-color: #c8a44a; color: #c8a44a; }
  .hl-btn.on { border-color: #c8a44a; background: rgba(200,164,74,0.1); color: #c8a44a; }
  .hl-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .hl-num { color: #c8a44a; font-weight: 700; flex-shrink: 0; font-size: 12px; margin-top: 1px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 18px; }
  .pcard { background: #0f0e0c; border: 1px solid #2a2520; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
  .pcard-hdr { display: flex; align-items: center; gap: 10px; }
  .picon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 15px; font-weight: 700; flex-shrink: 0; }
  .pname { font-size: 13px; font-weight: 600; color: #f0ebe0; }
  .pcount { margin-left: auto; font-size: 11px; color: #7a6f5e; }
  .pcount.over { color: #e74c3c; }
  .pta { width: 100%; background: #18160f; border: 1px solid #2a2520; border-radius: 8px; padding: 11px; color: #f0ebe0; font-size: 12px; resize: vertical; outline: none; font-family: 'Source Sans 3', sans-serif; line-height: 1.6; transition: border-color 0.2s; }
  .pta:focus { border-color: #c8a44a; }
  .btn-row { display: flex; gap: 8px; }
  .copy-btn { flex: 1; padding: 9px; border-radius: 7px; border: 1px solid #c8a44a; background: transparent; color: #c8a44a; font-size: 12px; font-weight: 600; font-family: 'Source Sans 3', sans-serif; cursor: pointer; transition: all 0.2s; }
  .copy-btn:hover { background: rgba(200,164,74,0.15); }
  .copy-btn.ok { background: #c8a44a; color: #0f0e0c; }
  .regen-btn { padding: 9px 13px; border-radius: 7px; border: 1px solid #2a2520; background: transparent; color: #7a6f5e; font-size: 15px; cursor: pointer; transition: all 0.2s; }
  .regen-btn:hover:not(:disabled) { border-color: #c8a44a; color: #c8a44a; }
  .regen-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .loading { color: #c8a44a; font-size: 13px; display: flex; align-items: center; gap: 8px; margin-top: 16px; }
  .spinner { width: 14px; height: 14px; border: 2px solid #2a2520; border-top-color: #c8a44a; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .err-box { background: rgba(231,76,60,0.1); border: 1px solid #e74c3c; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #e74c3c; margin-top: 16px; }
  .info-box { background: rgba(200,164,74,0.08); border: 1px solid rgba(200,164,74,0.2); border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #c8a44a; margin-top: 12px; }
  .divider { border: none; border-top: 1px solid #2a2520; margin: 4px 0 20px; }
  .wm { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #7a6f5e; letter-spacing: 1px; text-transform: uppercase; }
  @media (max-width: 600px) {
    .hdr { padding: 12px 16px; }
    .hdr-title { font-size: 16px; }
    .main { padding: 16px 12px 0; }
    .card { padding: 16px; }
    .grid { grid-template-columns: 1fr; }
    .cat { font-size: 12px; padding: 6px 12px; }
  }
`;

export default function App() {
  const [apiKey, setApiKey]             = useState("");
  const [keySaved, setKeySaved]         = useState(false);
  const [activeModel, setActiveModel]   = useState(FREE_MODELS[0]);
  const [category, setCategory]         = useState(null);
  const [headlines, setHeadlines]       = useState([]);
  const [selectedHL, setSelectedHL]     = useState(null);
  const [posts, setPosts]               = useState({});
  const [loadingHL, setLoadingHL]       = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [regenLoading, setRegenLoading] = useState({});
  const [copied, setCopied]             = useState({});
  const [error, setError]               = useState("");
  const [statusMsg, setStatusMsg]       = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("dnu_openrouter_key");
    if (saved) { setApiKey(saved); setKeySaved(true); }
  }, []);

  function handleKeyChange(val) {
    setApiKey(val);
    if (val.length > 10) {
      localStorage.setItem("dnu_openrouter_key", val);
      setKeySaved(true);
    } else {
      localStorage.removeItem("dnu_openrouter_key");
      setKeySaved(false);
    }
  }

  // Try each free model until one works
  async function callAI(prompt) {
    let lastError = "";
    for (let i = 0; i < FREE_MODELS.length; i++) {
      const model = FREE_MODELS[i];
      try {
        setStatusMsg(`Trying model ${i + 1} of ${FREE_MODELS.length}...`);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://dailynewsug.github.io",
            "X-Title": "Daily News Uganda Social Generator",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            max_tokens: 1500,
          })
        });
        const data = await response.json();
        if (data.error) {
          lastError = data.error.message;
          continue; // try next model
        }
        const text = data.choices[0].message.content;
        setActiveModel(model);
        setStatusMsg("");
        return text.replace(/```json|```/g, "").trim();
      } catch (e) {
        lastError = e.message;
        continue; // try next model
      }
    }
    setStatusMsg("");
    throw new Error("All free models are busy. Please try again in a moment. Last error: " + lastError);
  }

  async function fetchHeadlines(cat) {
    if (!apiKey) { setError("Please enter your OpenRouter API key first!"); return; }
    setCategory(cat);
    setHeadlines([]);
    setSelectedHL(null);
    setPosts({});
    setError("");
    setLoadingHL(true);
    try {
      const raw = await callAI(
        `You are a news editor for Daily News Uganda, a Ugandan news website.
Generate exactly 10 realistic, current-sounding news headlines for the category: ${cat}.
Headlines must be relevant to Uganda and East Africa.
Return ONLY a JSON array of 10 strings. No explanation, no numbering, no markdown.
Example: ["Headline one", "Headline two", ...]`
      );
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Could not parse headlines");
      setHeadlines(JSON.parse(match[0]));
    } catch (e) {
      setError(e.message);
    }
    setLoadingHL(false);
  }

  async function generatePosts(headline) {
    setSelectedHL(headline);
    setPosts({});
    setError("");
    setLoadingPosts(true);
    try {
      const raw = await callAI(
        `You are a social media manager for Daily News Uganda.
Write social media posts for this headline: "${headline}"
Return ONLY a JSON object with exactly these 4 keys:
{
  "twitter": "Tweet under 260 chars with 2-3 hashtags",
  "facebook": "Facebook post under 480 chars, engaging tone, with hashtags",
  "whatsapp": "WhatsApp message under 680 chars, conversational tone",
  "instagram": "Instagram caption under 480 chars with emojis and hashtags"
}
No explanation. Only the JSON object.`
      );
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse posts");
      setPosts(JSON.parse(match[0]));
    } catch (e) {
      setError(e.message);
    }
    setLoadingPosts(false);
  }

  async function regenOne(platformId) {
    if (!selectedHL) return;
    setRegenLoading(prev => ({ ...prev, [platformId]: true }));
    setError("");
    try {
      const raw = await callAI(
        `You are a social media manager for Daily News Uganda.
Write a DIFFERENT version of a ${platformId} post for this headline: "${selectedHL}"
Return ONLY a JSON object with one key: { "${platformId}": "your post here" }
No explanation. Only the JSON.`
      );
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse response");
      const parsed = JSON.parse(match[0]);
      setPosts(prev => ({ ...prev, [platformId]: parsed[platformId] }));
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

  const hasPosts = Object.keys(posts).length > 0;
  const shortModel = activeModel.split("/")[1]?.split(":")[0] || "Free AI";

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        <div className="hdr">
          <div className="hdr-icon">📰</div>
          <div>
            <div className="hdr-title">Daily News Uganda</div>
            <div className="hdr-sub">Social Media Post Generator</div>
          </div>
        </div>

        <div className="main">

          {/* API KEY */}
          <div className="card">
            <div className="step-hdr">
              <div className="step-num">🔑</div>
              <div>
                <div className="step-title">Your OpenRouter API Key</div>
                <div className="step-sub">Free — get yours at openrouter.ai</div>
              </div>
            </div>
            <input
              className="api-input"
              type="password"
              placeholder="Paste your OpenRouter key here — sk-or-..."
              value={apiKey}
              onChange={e => handleKeyChange(e.target.value)}
            />
            {keySaved
              ? <div className="api-saved">✓ Key saved in your browser — no need to paste it again</div>
              : <div className="api-hint">Your key is stored only in this browser. Never shared.</div>
            }
            <div className="badge">⚡ {shortModel} — Free via OpenRouter · Auto-switches if busy</div>
          </div>

          {/* STEP 1: CATEGORIES */}
          <div className="card">
            <div className="step-hdr">
              <div className="step-num">1</div>
              <div>
                <div className="step-title">Choose a Category</div>
                <div className="step-sub">AI will generate 10 Uganda-focused headlines for you</div>
              </div>
            </div>
            <div className="cats">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`cat${category === cat.id ? " on" : ""}`}
                  onClick={() => fetchHeadlines(cat.id)}
                  disabled={loadingHL || loadingPosts}
                >
                  {cat.emoji} {cat.id}
                </button>
              ))}
            </div>
            {loadingHL && (
              <div className="loading">
                <div className="spinner"/>
                {statusMsg || "Generating headlines..."}
              </div>
            )}
          </div>

          {/* STEP 2: HEADLINES */}
          {headlines.length > 0 && (
            <div className="card">
              <div className="step-hdr">
                <div className="step-num">2</div>
                <div>
                  <div className="step-title">Pick a Headline</div>
                  <div className="step-sub">Click any headline to generate posts for all 4 platforms</div>
                </div>
              </div>
              <div className="headlines">
                {headlines.map((h, i) => (
                  <button
                    key={i}
                    className={`hl-btn${selectedHL === h ? " on" : ""}`}
                    onClick={() => generatePosts(h)}
                    disabled={loadingPosts}
                  >
                    <span className="hl-num">{i + 1}.</span>
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: POSTS */}
          {(loadingPosts || hasPosts) && (
            <div className="card">
              <div className="step-hdr">
                <div className="step-num">3</div>
                <div>
                  <div className="step-title">Your Generated Posts</div>
                  <div className="step-sub">Edit if needed · Use ↻ to get a fresh version</div>
                </div>
              </div>
              <hr className="divider"/>
              {loadingPosts ? (
                <div className="loading">
                  <div className="spinner"/>
                  {statusMsg || "Writing posts for all 4 platforms..."}
                </div>
              ) : (
                <div className="grid">
                  {PLATFORMS.map(p => {
                    const text = posts[p.id] || "";
                    const over = text.length > p.limit;
                    return (
                      <div key={p.id} className="pcard">
                        <div className="pcard-hdr">
                          <div className="picon" style={{ background: p.bg }}>{p.icon}</div>
                          <span className="pname">{p.name}</span>
                          <span className={`pcount${over ? " over" : ""}`}>{text.length}/{p.limit}</span>
                        </div>
                        <textarea
                          className="pta"
                          value={text}
                          rows={7}
                          onChange={e => setPosts(prev => ({ ...prev, [p.id]: e.target.value }))}
                        />
                        <div className="wm">
                          <span>📰</span>
                          <span>Daily News Uganda</span>
                        </div>
                        <div className="btn-row">
                          <button
                            className={`copy-btn${copied[p.id] ? " ok" : ""}`}
                            onClick={() => handleCopy(p.id, text)}
                          >
                            {copied[p.id] ? "✓ Copied!" : `Copy ${p.label}`}
                          </button>
                          <button
                            className="regen-btn"
                            onClick={() => regenOne(p.id)}
                            disabled={regenLoading[p.id]}
                            title="Get a different version"
                          >
                            {regenLoading[p.id] ? <span className="spinner"/> : "↻"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {error && <div className="err-box">⚠ {error}</div>}

        </div>
      </div>
    </>
  );
}