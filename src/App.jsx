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

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body { background: #0f0e0c; overscroll-behavior: none; }

  .app {
    min-height: 100vh;
    min-height: 100dvh;
    background: #0f0e0c;
    color: #f0ebe0;
    font-family: 'Source Sans 3', sans-serif;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    padding-bottom: 100px;
  }

  /* HEADER */
  .hdr {
    background: #0f0e0c;
    border-bottom: 2px solid #c8a44a;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .hdr-icon { font-size: 28px; }
  .hdr-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 900;
    color: #f0ebe0;
    line-height: 1.2;
  }
  .hdr-sub {
    font-size: 9px;
    color: #c8a44a;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  /* STEP INDICATOR */
  .steps-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 14px 18px;
    background: #18160f;
    border-bottom: 1px solid #2a2520;
  }
  .step-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #2a2520;
    color: #7a6f5e;
    font-size: 12px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .step-dot.active { background: #c8a44a; color: #0f0e0c; }
  .step-dot.done { background: rgba(200,164,74,0.3); color: #c8a44a; }
  .step-line {
    flex: 1;
    height: 2px;
    background: #2a2520;
    max-width: 48px;
    transition: background 0.3s;
  }
  .step-line.done { background: rgba(200,164,74,0.4); }
  .step-label {
    font-size: 10px;
    color: #7a6f5e;
    text-align: center;
    margin-top: 4px;
    letter-spacing: 0.5px;
  }
  .steps-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  /* MAIN */
  .main { padding: 16px; }

  /* CARD */
  .card {
    background: #18160f;
    border: 1px solid #2a2520;
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 16px;
  }
  .card-title {
    font-size: 15px;
    font-weight: 700;
    color: #f0ebe0;
    margin-bottom: 4px;
  }
  .card-sub {
    font-size: 12px;
    color: #7a6f5e;
    margin-bottom: 14px;
  }

  /* API KEY */
  .api-input {
    width: 100%;
    background: #0f0e0c;
    border: 1px solid #2a2520;
    border-radius: 10px;
    padding: 13px 16px;
    color: #f0ebe0;
    font-size: 15px;
    outline: none;
    font-family: 'Source Sans 3', sans-serif;
    transition: border-color 0.2s;
    -webkit-appearance: none;
  }
  .api-input:focus { border-color: #c8a44a; }
  .api-hint { font-size: 11px; color: #7a6f5e; margin-top: 8px; line-height: 1.5; }
  .api-saved { font-size: 12px; color: #c8a44a; margin-top: 8px; display: flex; align-items: center; gap: 5px; }
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(200,164,74,0.1);
    border: 1px solid rgba(200,164,74,0.25);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 11px;
    color: #c8a44a;
    margin-top: 10px;
  }

  /* CATEGORIES GRID */
  .cats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .cat-btn {
    padding: 14px 10px;
    border-radius: 12px;
    border: 1px solid #2a2520;
    background: #0f0e0c;
    color: #7a6f5e;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    -webkit-tap-highlight-color: transparent;
  }
  .cat-btn:active { transform: scale(0.97); }
  .cat-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .cat-btn.on {
    border-color: #c8a44a;
    background: rgba(200,164,74,0.12);
    color: #c8a44a;
  }
  .cat-emoji { font-size: 22px; }

  /* HEADLINES */
  .headlines { display: flex; flex-direction: column; gap: 8px; }
  .hl-btn {
    text-align: left;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid #2a2520;
    background: #0f0e0c;
    color: #f0ebe0;
    font-size: 14px;
    font-family: 'Source Sans 3', sans-serif;
    cursor: pointer;
    line-height: 1.5;
    transition: all 0.2s;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  .hl-btn:active { transform: scale(0.99); }
  .hl-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .hl-btn.on { border-color: #c8a44a; background: rgba(200,164,74,0.08); color: #c8a44a; }
  .hl-num {
    color: #c8a44a;
    font-weight: 700;
    flex-shrink: 0;
    font-size: 13px;
    margin-top: 1px;
    min-width: 20px;
  }

  /* PLATFORM TABS */
  .ptabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 16px;
    scrollbar-width: none;
  }
  .ptabs::-webkit-scrollbar { display: none; }
  .ptab {
    flex-shrink: 0;
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #2a2520;
    background: transparent;
    color: #7a6f5e;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Source Sans 3', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    -webkit-tap-highlight-color: transparent;
  }
  .ptab.on {
    border-color: #c8a44a;
    background: rgba(200,164,74,0.15);
    color: #c8a44a;
  }

  /* POST CARD */
  .pcard {
    background: #0f0e0c;
    border: 1px solid #2a2520;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .pcard-hdr {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .picon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .pname { font-size: 14px; font-weight: 700; color: #f0ebe0; }
  .pcount { margin-left: auto; font-size: 12px; color: #7a6f5e; font-weight: 600; }
  .pcount.over { color: #e74c3c; }
  .pta {
    width: 100%;
    background: #18160f;
    border: 1px solid #2a2520;
    border-radius: 10px;
    padding: 13px;
    color: #f0ebe0;
    font-size: 14px;
    resize: none;
    outline: none;
    font-family: 'Source Sans 3', sans-serif;
    line-height: 1.6;
    transition: border-color 0.2s;
    min-height: 140px;
    -webkit-appearance: none;
  }
  .pta:focus { border-color: #c8a44a; }

  /* BUTTONS */
  .btn-row { display: flex; gap: 10px; }
  .copy-btn {
    flex: 1;
    padding: 13px;
    border-radius: 10px;
    border: 1px solid #c8a44a;
    background: transparent;
    color: #c8a44a;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Source Sans 3', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .copy-btn:active { transform: scale(0.97); }
  .copy-btn.ok { background: #c8a44a; color: #0f0e0c; }
  .regen-btn {
    padding: 13px 18px;
    border-radius: 10px;
    border: 1px solid #2a2520;
    background: transparent;
    color: #7a6f5e;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .regen-btn:active { transform: scale(0.97); }
  .regen-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* BIG ACTION BUTTON */
  .action-btn {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    border: none;
    background: #c8a44a;
    color: #0f0e0c;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Source Sans 3', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
    -webkit-tap-highlight-color: transparent;
  }
  .action-btn:active { transform: scale(0.98); opacity: 0.9; }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* LOADING */
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 0;
    color: #c8a44a;
    font-size: 14px;
  }
  .spinner {
    width: 32px; height: 32px;
    border: 3px solid #2a2520;
    border-top-color: #c8a44a;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner-sm {
    width: 14px; height: 14px;
    border: 2px solid #2a2520;
    border-top-color: #c8a44a;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ERROR */
  .err-box {
    background: rgba(231,76,60,0.1);
    border: 1px solid #e74c3c;
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 13px;
    color: #e74c3c;
    margin-top: 12px;
    line-height: 1.5;
  }

  /* WATERMARK */
  .wm {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; color: #7a6f5e;
    letter-spacing: 1px; text-transform: uppercase;
  }

  /* BOTTOM NAV */
  .bottom-nav {
    position: fixed;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: #18160f;
    border-top: 1px solid #2a2520;
    display: flex;
    z-index: 50;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .nav-btn {
    flex: 1;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: transparent;
    border: none;
    color: #7a6f5e;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .nav-btn.on { color: #c8a44a; }
  .nav-icon { font-size: 20px; }

  /* DIVIDER */
  .divider { border: none; border-top: 1px solid #2a2520; margin: 4px 0 16px; }

  /* SELECTED HEADLINE BANNER */
  .hl-banner {
    background: rgba(200,164,74,0.08);
    border: 1px solid rgba(200,164,74,0.2);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 12px;
    color: #c8a44a;
    line-height: 1.5;
    margin-bottom: 14px;
  }
  .hl-banner-label {
    font-size: 10px;
    color: #7a6f5e;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
`;

// Pages / screens
const SCREEN = { KEY: "key", CATEGORY: "category", HEADLINES: "headlines", POSTS: "posts" };

export default function App() {
  const [screen, setScreen]             = useState(SCREEN.CATEGORY);
  const [apiKey, setApiKey]             = useState("");
  const [keySaved, setKeySaved]         = useState(false);
  const [category, setCategory]         = useState(null);
  const [headlines, setHeadlines]       = useState([]);
  const [selectedHL, setSelectedHL]     = useState(null);
  const [posts, setPosts]               = useState({});
  const [activePlatform, setActivePlatform] = useState("twitter");
  const [loadingHL, setLoadingHL]       = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [regenLoading, setRegenLoading] = useState({});
  const [copied, setCopied]             = useState({});
  const [error, setError]               = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("dnu_groq_key");
    if (saved) { setApiKey(saved); setKeySaved(true); }
    else { setScreen(SCREEN.KEY); }
  }, []);

  function handleKeyChange(val) {
    setApiKey(val);
    if (val.length > 10) {
      localStorage.setItem("dnu_groq_key", val);
      setKeySaved(true);
    } else {
      localStorage.removeItem("dnu_groq_key");
      setKeySaved(false);
    }
  }

  async function callGroq(prompt) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 1500,
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.choices[0].message.content;
    return text.replace(/```json|```/g, "").trim();
  }

  async function fetchHeadlines(cat) {
    if (!apiKey) { setScreen(SCREEN.KEY); return; }
    setCategory(cat);
    setHeadlines([]);
    setSelectedHL(null);
    setPosts({});
    setError("");
    setLoadingHL(true);
    setScreen(SCREEN.HEADLINES);
    try {
      const raw = await callGroq(
        `You are a news editor for Daily News Uganda, a Ugandan news website.
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
    setError("");
    setLoadingPosts(true);
    setScreen(SCREEN.POSTS);
    setActivePlatform("twitter");
    try {
      const raw = await callGroq(
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
      if (!match) throw new Error("Could not read posts. Please try again.");
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
      const raw = await callGroq(
        `You are a social media manager for Daily News Uganda.
Write a DIFFERENT version of a ${platformId} post for this headline: "${selectedHL}"
Return ONLY a JSON object with one key: { "${platformId}": "your post here" }
No explanation. Only the JSON.`
      );
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not read response.");
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

  const currentPlatform = PLATFORMS.find(p => p.id === activePlatform);
  const currentText = posts[activePlatform] || "";
  const isOver = currentText.length > (currentPlatform?.limit || 999);
  const step = screen === SCREEN.KEY ? 0 : screen === SCREEN.CATEGORY ? 1 : screen === SCREEN.HEADLINES ? 2 : 3;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-icon">📰</div>
          <div>
            <div className="hdr-title">Daily News Uganda</div>
            <div className="hdr-sub">Social Post Generator</div>
          </div>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="steps-bar">
          {["Key","Category","Headlines","Posts"].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
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

          {/* SCREEN: API KEY */}
          {screen === SCREEN.KEY && (
            <div className="card">
              <div className="card-title">🔑 Groq API Key</div>
              <div className="card-sub">Free — get yours at console.groq.com</div>
              <input
                className="api-input"
                type="password"
                placeholder="Paste your key here — gsk_..."
                value={apiKey}
                onChange={e => handleKeyChange(e.target.value)}
              />
              {keySaved
                ? <div className="api-saved">✓ Key saved — you won't need to paste it again</div>
                : <div className="api-hint">Your key stays only in this browser. Never shared.</div>
              }
              <div className="badge">⚡ Llama 3.3 70B via Groq — Free & Fast</div>
              {apiKey.length > 10 && (
                <button className="action-btn" onClick={() => setScreen(SCREEN.CATEGORY)}>
                  Continue →
                </button>
              )}
            </div>
          )}

          {/* SCREEN: CATEGORY */}
          {screen === SCREEN.CATEGORY && (
            <div className="card">
              <div className="card-title">Choose a Category</div>
              <div className="card-sub">AI generates 10 Uganda-focused headlines for you</div>
              <div className="cats-grid">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`cat-btn${category === cat.id ? " on" : ""}`}
                    onClick={() => fetchHeadlines(cat.id)}
                    disabled={loadingHL}
                  >
                    <span className="cat-emoji">{cat.emoji}</span>
                    {cat.id}
                  </button>
                ))}
              </div>
              {error && <div className="err-box">⚠ {error}</div>}
            </div>
          )}

          {/* SCREEN: HEADLINES */}
          {screen === SCREEN.HEADLINES && (
            <div className="card">
              <div className="card-title">{category} Headlines</div>
              <div className="card-sub">Tap any headline to generate posts</div>
              {loadingHL ? (
                <div className="loading">
                  <div className="spinner"/>
                  Generating headlines...
                </div>
              ) : (
                <>
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
                  <button
                    className="action-btn"
                    style={{ background: "transparent", border: "1px solid #2a2520", color: "#7a6f5e", marginTop: 16 }}
                    onClick={() => setScreen(SCREEN.CATEGORY)}
                  >
                    ← Change Category
                  </button>
                </>
              )}
              {error && <div className="err-box">⚠ {error}</div>}
            </div>
          )}

          {/* SCREEN: POSTS */}
          {screen === SCREEN.POSTS && (
            <div className="card">
              <div className="card-title">Generated Posts</div>

              {/* Selected headline banner */}
              {selectedHL && (
                <div className="hl-banner">
                  <div className="hl-banner-label">Headline</div>
                  {selectedHL}
                </div>
              )}

              {loadingPosts ? (
                <div className="loading">
                  <div className="spinner"/>
                  Writing posts for all 4 platforms...
                </div>
              ) : (
                <>
                  {/* Platform tabs */}
                  <div className="ptabs">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        className={`ptab${activePlatform === p.id ? " on" : ""}`}
                        onClick={() => setActivePlatform(p.id)}
                      >
                        <span>{p.icon}</span>
                        {p.name}
                      </button>
                    ))}
                  </div>

                  {/* Active platform post */}
                  {currentPlatform && (
                    <div className="pcard">
                      <div className="pcard-hdr">
                        <div className="picon" style={{ background: currentPlatform.bg }}>
                          {currentPlatform.icon}
                        </div>
                        <span className="pname">{currentPlatform.name}</span>
                        <span className={`pcount${isOver ? " over" : ""}`}>
                          {currentText.length}/{currentPlatform.limit}
                        </span>
                      </div>
                      <textarea
                        className="pta"
                        value={currentText}
                        rows={6}
                        onChange={e => setPosts(prev => ({ ...prev, [activePlatform]: e.target.value }))}
                      />
                      <div className="wm">
                        <span>📰</span>
                        <span>Daily News Uganda</span>
                      </div>
                      <div className="btn-row">
                        <button
                          className={`copy-btn${copied[activePlatform] ? " ok" : ""}`}
                          onClick={() => handleCopy(activePlatform, currentText)}
                        >
                          {copied[activePlatform] ? "✓ Copied!" : `Copy ${currentPlatform.label}`}
                        </button>
                        <button
                          className="regen-btn"
                          onClick={() => regenOne(activePlatform)}
                          disabled={regenLoading[activePlatform]}
                          title="Get a different version"
                        >
                          {regenLoading[activePlatform] ? <span className="spinner-sm"/> : "↻"}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    className="action-btn"
                    style={{ background: "transparent", border: "1px solid #2a2520", color: "#7a6f5e", marginTop: 8 }}
                    onClick={() => setScreen(SCREEN.HEADLINES)}
                  >
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
          <button className={`nav-btn${screen === SCREEN.KEY ? " on" : ""}`} onClick={() => setScreen(SCREEN.KEY)}>
            <span className="nav-icon">🔑</span>
            API Key
          </button>
          <button className={`nav-btn${screen === SCREEN.CATEGORY ? " on" : ""}`} onClick={() => setScreen(SCREEN.CATEGORY)}>
            <span className="nav-icon">📂</span>
            Category
          </button>
          <button className={`nav-btn${screen === SCREEN.HEADLINES ? " on" : ""}`} onClick={() => setScreen(SCREEN.HEADLINES)} disabled={!headlines.length}>
            <span className="nav-icon">📰</span>
            Headlines
          </button>
          <button className={`nav-btn${screen === SCREEN.POSTS ? " on" : ""}`} onClick={() => setScreen(SCREEN.POSTS)} disabled={!selectedHL}>
            <span className="nav-icon">✍️</span>
            Posts
          </button>
        </div>

      </div>
    </>
  );
}