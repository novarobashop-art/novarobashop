import { useState, useEffect, useRef } from "react";

// ============================================================
// MOCK DATABASE (In-Memory)
// ============================================================
const DB = {
  users: {
    "dragan.admin@gmail.com": { role: "admin", name: "Dragan Petrović" },
  },
  profiles: {
    // Example existing customer
    "petar.jovanovic@gmail.com": {
      tiktokIme: "@petar_kupuje",
      imeIPrezime: "Petar Jovanović",
      ulicaBroj: "Kralja Petra 12",
      postanskiBroj: "11000",
      grad: "Beograd",
      selo: "Ripanj",
      telefon: "0641234567",
      email: "petar.jovanovic@gmail.com",
    },
  },
  racuni: [
    {
      id: "r1",
      kupacEmail: "petar.jovanovic@gmail.com",
      tiktokIme: "@petar_kupuje",
      iznos: 3200,
      opis: "Porudžbina #001",
      status: "crvena",
      adminFoto: "https://placehold.co/400x300/1e3a5f/fff?text=Racun+001",
      kupacFoto: null,
      datum: "2026-03-01",
    },
    {
      id: "r2",
      kupacEmail: "petar.jovanovic@gmail.com",
      tiktokIme: "@petar_kupuje",
      iznos: 5800,
      opis: "Porudžbina #002",
      status: "zuta",
      adminFoto: "https://placehold.co/400x300/1e3a5f/fff?text=Racun+002",
      kupacFoto: "https://placehold.co/400x300/5f3a1e/fff?text=Uplata+002",
      datum: "2026-03-02",
    },
    {
      id: "r3",
      kupacEmail: "petar.jovanovic@gmail.com",
      tiktokIme: "@petar_kupuje",
      iznos: 2100,
      opis: "Porudžbina #000",
      status: "zelena",
      adminFoto: "https://placehold.co/400x300/1e3a5f/fff?text=Racun+000",
      kupacFoto: "https://placehold.co/400x300/1e5f3a/fff?text=Uplata+000",
      datum: "2026-02-28",
    },
  ],
  chats: {
    "petar.jovanovic@gmail.com": [
      {
        id: "c1",
        od: "kupac",
        tekst: "Zdravo, kada stiže moja porudžbina?",
        vreme: "10:32",
      },
      {
        id: "c2",
        od: "admin",
        tekst: "Uskoro šaljemo, pratite status.",
        vreme: "10:45",
      },
    ],
  },
  notifications: [],
};

// ============================================================
// UTILS
// ============================================================
const formatRSD = (n) =>
  n.toLocaleString("sr-RS") + " RSD";

const statusConfig = {
  crvena: { label: "Nova Faktura", color: "#e53e3e", bg: "#fff5f5", emoji: "🔴" },
  zuta: { label: "Čeka Proveru", color: "#d69e2e", bg: "#fffff0", emoji: "🟡" },
  zelena: { label: "Plaćeno", color: "#38a169", bg: "#f0fff4", emoji: "🟢" },
};

// ============================================================
// COMPONENTS
// ============================================================

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: "linear-gradient(135deg, #1e3a5f, #2b6cb0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(43,108,176,0.4)",
        fontWeight: 900, color: "#fff", fontSize: 18, letterSpacing: -1,
      }}>N</div>
      <span style={{ fontWeight: 800, fontSize: 20, color: "#1e3a5f", letterSpacing: -0.5 }}>
        nova<span style={{ color: "#2b6cb0" }}>roba</span>shop
      </span>
    </div>
  );
}

function Badge({ status }) {
  const cfg = statusConfig[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33`,
    }}>
      {cfg.emoji} {cfg.label}
    </span>
  );
}

function Notification({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      background: "#1e3a5f", color: "#fff", padding: "14px 20px",
      borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      maxWidth: 320, fontSize: 14, fontWeight: 600,
      animation: "slideIn 0.3s ease",
    }}>
      🔔 {msg}
      <button onClick={onClose} style={{
        marginLeft: 12, background: "none", border: "none",
        color: "#90cdf4", cursor: "pointer", fontSize: 16,
      }}>×</button>
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = (email) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 1200);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f2443 0%, #1e3a5f 40%, #2b6cb0 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: 48,
        width: "100%", maxWidth: 420,
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        textAlign: "center",
      }}>
        <Logo />
        <p style={{ color: "#718096", marginTop: 8, marginBottom: 36, fontSize: 14 }}>
          Prijavite se da nastavite
        </p>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: "#a0aec0", marginBottom: 12 }}>Prijavite se kao kupac:</p>
          <button
            onClick={() => handleGoogleLogin("petar.jovanovic@gmail.com")}
            disabled={loading}
            style={{
              width: "100%", padding: "14px 20px",
              border: "2px solid #e2e8f0", borderRadius: 12,
              background: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.2s", marginBottom: 10,
            }}
          >
            <GoogleIcon /> Prijavi se kao Kupac
          </button>
          <button
            onClick={() => handleGoogleLogin("dragan.admin@gmail.com")}
            disabled={loading}
            style={{
              width: "100%", padding: "14px 20px",
              border: "2px solid #2b6cb0", borderRadius: 12,
              background: "#ebf8ff", cursor: "pointer", fontSize: 15, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.2s", color: "#2b6cb0",
            }}
          >
            <GoogleIcon /> Prijavi se kao Admin
          </button>
        </div>

        {loading && (
          <div style={{ color: "#2b6cb0", fontSize: 14, marginTop: 16 }}>
            ⏳ Prijavljivanje...
          </div>
        )}

        <p style={{ fontSize: 11, color: "#cbd5e0", marginTop: 24 }}>
          Vaši podaci su zaštićeni i sigurni.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/>
    </svg>
  );
}

// ============================================================
// REGISTRATION / PROFILE FORM
// ============================================================
function RegistrationPage({ email, onComplete, onNotify }) {
  const [form, setForm] = useState({
    tiktokIme: "", imeIPrezime: "", ulicaBroj: "",
    postanskiBroj: "", grad: "", selo: "", telefon: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    Object.keys(form).forEach(k => { if (!form[k].trim()) e[k] = true; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    DB.profiles[email] = { ...form, email };
    onNotify(`Novi korisnik registrovan: ${form.tiktokIme}`);
    onComplete();
  };

  const fields = [
    { key: "tiktokIme", label: "TikTok Ime", placeholder: "@vaše_tiktok_ime" },
    { key: "imeIPrezime", label: "Ime i Prezime", placeholder: "Petar Petrović" },
    { key: "ulicaBroj", label: "Ulica i broj", placeholder: "Kralja Petra 12" },
    { key: "postanskiBroj", label: "Poštanski broj", placeholder: "11000" },
    { key: "grad", label: "Grad", placeholder: "Beograd" },
    { key: "selo", label: "Selo", placeholder: "Ripanj" },
    { key: "telefon", label: "Broj telefona", placeholder: "064 123 4567" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f2443, #1e3a5f)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: 36,
        width: "100%", maxWidth: 480, boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
      }}>
        <Logo />
        <h2 style={{ marginTop: 20, marginBottom: 6, color: "#1e3a5f", fontSize: 20 }}>
          Kompletiranje profila
        </h2>
        <p style={{ color: "#718096", fontSize: 13, marginBottom: 24 }}>
          Molimo popunite sve podatke pre nastavka.
        </p>

        {fields.map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2d3748", marginBottom: 5 }}>
              {f.label} *
            </label>
            <input
              value={form[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
                border: `2px solid ${errors[f.key] ? "#e53e3e" : "#e2e8f0"}`,
                outline: "none", boxSizing: "border-box",
                background: errors[f.key] ? "#fff5f5" : "#fff",
              }}
            />
            {errors[f.key] && (
              <p style={{ color: "#e53e3e", fontSize: 12, marginTop: 3 }}>Ovo polje je obavezno</p>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #1e3a5f, #2b6cb0)",
            color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
            marginTop: 8, boxShadow: "0 4px 16px rgba(43,108,176,0.4)",
          }}
        >
          Sačuvaj i nastavi →
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CUSTOMER PORTAL
// ============================================================
function KupacPortal({ email, onLogout, onNotify }) {
  const [tab, setTab] = useState("racuni");
  const profile = DB.profiles[email];
  const myRacuni = DB.racuni.filter(r => r.kupacEmail === email);

  return (
    <div style={{
      minHeight: "100vh", background: "#f0f4f8",
      fontFamily: "'Segoe UI', sans-serif", paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f, #2b6cb0)",
        padding: "16px 20px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#90cdf4", fontSize: 13 }}>{profile?.tiktokIme}</span>
          <button onClick={onLogout} style={{
            background: "rgba(255,255,255,0.15)", border: "none",
            color: "#fff", padding: "6px 12px", borderRadius: 8,
            cursor: "pointer", fontSize: 13,
          }}>Odjavi se</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
        {tab === "racuni" && <KupacRacuni racuni={myRacuni.filter(r => r.status !== "zelena")} email={email} onNotify={onNotify} />}
        {tab === "arhiva" && <KupacArhiva racuni={myRacuni.filter(r => r.status === "zelena")} />}
        {tab === "podrska" && <KupacPodrska email={email} tiktokIme={profile?.tiktokIme} />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "2px solid #e2e8f0",
        display: "flex", justifyContent: "space-around",
        padding: "10px 0",
      }}>
        {[
          { id: "racuni", icon: "📄", label: "Računi", badge: myRacuni.filter(r => r.status === "crvena").length },
          { id: "arhiva", icon: "🗃️", label: "Arhiva" },
          { id: "podrska", icon: "💬", label: "Podrška" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "4px 16px", borderRadius: 10,
            color: tab === t.id ? "#2b6cb0" : "#718096",
            fontWeight: tab === t.id ? 700 : 400,
            position: "relative",
          }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 11 }}>{t.label}</span>
            {t.badge > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 8,
                background: "#e53e3e", color: "#fff",
                width: 16, height: 16, borderRadius: "50%",
                fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700,
              }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function KupacRacuni({ racuni, email, onNotify }) {
  const [selectedRacun, setSelectedRacun] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");

  const handleUpload = (racunId) => {
    const idx = DB.racuni.findIndex(r => r.id === racunId);
    if (idx !== -1) {
      DB.racuni[idx].status = "zuta";
      DB.racuni[idx].kupacFoto = "https://placehold.co/400x300/d69e2e/fff?text=Uplata+Dokaz";
      onNotify(`Kupac je poslao dokaz uplate za račun ${racunId}`);
      setUploadMsg("✅ Dokaz uplate je poslat adminu!");
      setSelectedRacun(null);
    }
  };

  return (
    <div>
      <h2 style={{ color: "#1e3a5f", marginBottom: 16 }}>Moji Računi</h2>
      {uploadMsg && <div style={{
        background: "#f0fff4", border: "1px solid #38a169",
        color: "#276749", padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 14,
      }}>{uploadMsg}</div>}

      {racuni.length === 0 ? (
        <EmptyState icon="📭" text="Nemate aktivnih računa" />
      ) : racuni.map(r => (
        <div key={r.id} style={{
          background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderLeft: `4px solid ${statusConfig[r.status].color}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>{r.opis}</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#2d3748" }}>{formatRSD(r.iznos)}</p>
              <p style={{ fontSize: 12, color: "#a0aec0", marginTop: 4 }}>{r.datum}</p>
            </div>
            <Badge status={r.status} />
          </div>

          {r.status === "crvena" && (
            <div style={{ marginTop: 16 }}>
              <img src={r.adminFoto} alt="Račun" style={{
                width: "100%", borderRadius: 10, maxHeight: 200, objectFit: "cover",
              }} />
              <div style={{
                background: "#ebf8ff", borderRadius: 10, padding: 16, marginTop: 12,
                fontSize: 13, color: "#2b6cb0",
              }}>
                <strong>Podaci za uplatu:</strong><br />
                Račun: <code>325 9300706409307 32</code><br />
                PostNet: <code>0612068881</code><br />
                Primalac: Dragan Petrović, Sečanj
              </div>
              <button onClick={() => handleUpload(r.id)} style={{
                width: "100%", marginTop: 12, padding: "12px",
                background: "linear-gradient(135deg, #1e3a5f, #2b6cb0)",
                color: "#fff", border: "none", borderRadius: 10,
                cursor: "pointer", fontWeight: 700, fontSize: 14,
              }}>
                📤 Pošalji dokaz uplate
              </button>
            </div>
          )}

          {r.status === "zuta" && (
            <div style={{
              background: "#fffff0", border: "1px solid #d69e2e",
              borderRadius: 10, padding: 12, marginTop: 12,
              fontSize: 13, color: "#744210",
            }}>
              ⏳ Vaša uplata je primljena. Čeka se potvrda.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function KupacArhiva({ racuni }) {
  return (
    <div>
      <h2 style={{ color: "#1e3a5f", marginBottom: 16 }}>Arhiva Plaćanja</h2>
      {racuni.length === 0 ? (
        <EmptyState icon="📂" text="Nema plaćenih računa" />
      ) : racuni.map(r => (
        <div key={r.id} style={{
          background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderLeft: "4px solid #38a169",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontWeight: 700, color: "#1e3a5f" }}>{r.opis}</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: "#276749" }}>{formatRSD(r.iznos)}</p>
              <p style={{ fontSize: 12, color: "#a0aec0" }}>{r.datum}</p>
            </div>
            <Badge status="zelena" />
          </div>
        </div>
      ))}
    </div>
  );
}

function KupacPodrska({ email, tiktokIme }) {
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  if (!DB.chats[email]) DB.chats[email] = [];
  const [messages, setMessages] = useState(DB.chats[email]);

  const sendMsg = () => {
    if (!msg.trim()) return;
    const newMsg = { id: Date.now().toString(), od: "kupac", tekst: msg, vreme: new Date().toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" }) };
    DB.chats[email].push(newMsg);
    setMessages([...DB.chats[email]]);
    setMsg("");
  };

  return (
    <div>
      <h2 style={{ color: "#1e3a5f", marginBottom: 8 }}>Podrška & Uplata</h2>

      <div style={{
        background: "#ebf8ff", borderRadius: 16, padding: 20, marginBottom: 20,
        border: "1px solid #bee3f8",
      }}>
        <h3 style={{ color: "#2b6cb0", marginBottom: 12, fontSize: 15 }}>📋 Podaci za uplatu</h3>
        <div style={{ fontSize: 14, lineHeight: 2 }}>
          <div><strong>Račun:</strong> <code style={{ background: "#fff", padding: "2px 8px", borderRadius: 6 }}>325 9300706409307 32</code></div>
          <div><strong>PostNet:</strong> <code style={{ background: "#fff", padding: "2px 8px", borderRadius: 6 }}>0612068881</code></div>
          <div><strong>Primalac:</strong> Dragan Petrović, Sečanj</div>
        </div>
      </div>

      <div style={{
        background: "#fff", borderRadius: 16, overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}>
        <div style={{
          background: "#1e3a5f", padding: "14px 20px",
          color: "#fff", fontWeight: 700, fontSize: 15,
        }}>
          💬 Chat — {tiktokIme}
        </div>

        <div style={{ height: 300, overflowY: "auto", padding: 16 }}>
          {messages.map(m => (
            <div key={m.id} style={{
              display: "flex", justifyContent: m.od === "kupac" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}>
              <div style={{
                maxWidth: "70%", padding: "10px 14px", borderRadius: 16,
                background: m.od === "kupac" ? "#2b6cb0" : "#f0f4f8",
                color: m.od === "kupac" ? "#fff" : "#2d3748",
                fontSize: 14,
              }}>
                <p style={{ margin: 0 }}>{m.tekst}</p>
                <p style={{ margin: "4px 0 0", fontSize: 11, opacity: 0.7, textAlign: "right" }}>{m.vreme}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{
          padding: 12, borderTop: "1px solid #e2e8f0",
          display: "flex", gap: 10,
        }}>
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMsg()}
            placeholder="Napišite poruku..."
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 10,
              border: "2px solid #e2e8f0", outline: "none", fontSize: 14,
            }}
          />
          <button onClick={sendMsg} style={{
            padding: "10px 18px", background: "#2b6cb0", color: "#fff",
            border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700,
          }}>→</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PORTAL
// ============================================================
function AdminPortal({ onLogout, onNotify }) {
  const [tab, setTab] = useState("kupci");

  return (
    <div style={{
      minHeight: "100vh", background: "#0f2443",
      fontFamily: "'Segoe UI', sans-serif", paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f2443, #1e3a5f)",
        padding: "16px 20px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            background: "#2b6cb0", color: "#fff", fontSize: 11,
            padding: "3px 10px", borderRadius: 20, fontWeight: 700,
          }}>ADMIN</span>
          <button onClick={onLogout} style={{
            background: "rgba(255,255,255,0.1)", border: "none",
            color: "#fff", padding: "6px 12px", borderRadius: 8,
            cursor: "pointer", fontSize: 13,
          }}>Odjavi se</button>
        </div>
      </div>

      <div style={{ padding: 16, maxWidth: 700, margin: "0 auto" }}>
        {tab === "kupci" && <AdminKupci />}
        {tab === "finansije" && <AdminFinansije onNotify={onNotify} />}
        {tab === "kontrola" && <AdminKontrola onNotify={onNotify} />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#1e3a5f", borderTop: "1px solid rgba(255,255,255,0.1)",
        display: "flex", justifyContent: "space-around",
        padding: "10px 0",
      }}>
        {[
          { id: "kupci", icon: "👥", label: "Kupci" },
          { id: "finansije", icon: "💰", label: "Finansije" },
          { id: "kontrola", icon: "✅", label: "Kontrola", badge: DB.racuni.filter(r => r.status === "zuta").length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "4px 20px", borderRadius: 10,
            color: tab === t.id ? "#90cdf4" : "#718096",
            fontWeight: tab === t.id ? 700 : 400,
            position: "relative",
          }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 11 }}>{t.label}</span>
            {t.badge > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 8,
                background: "#d69e2e", color: "#fff",
                width: 16, height: 16, borderRadius: "50%",
                fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700,
              }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminKupci() {
  const [search, setSearch] = useState("");
  const profiles = Object.values(DB.profiles);
  const filtered = profiles.filter(p =>
    p.tiktokIme.toLowerCase().includes(search.toLowerCase()) ||
    p.imeIPrezime.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ color: "#e2e8f0", marginBottom: 16 }}>👥 Lista Kupaca</h2>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Pretraži po TikTok imenu..."
        style={{
          width: "100%", padding: "12px 16px", borderRadius: 12,
          border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
          color: "#e2e8f0", fontSize: 14, marginBottom: 16, boxSizing: "border-box",
        }}
      />
      {filtered.length === 0 ? (
        <EmptyState icon="🔍" text="Nema rezultata" dark />
      ) : filtered.map(p => (
        <div key={p.email} style={{
          background: "rgba(255,255,255,0.05)", borderRadius: 16,
          padding: 20, marginBottom: 12, border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <p style={{ color: "#90cdf4", fontWeight: 800, fontSize: 16 }}>{p.tiktokIme}</p>
              <p style={{ color: "#e2e8f0", fontSize: 14 }}>{p.imeIPrezime}</p>
            </div>
            <span style={{ color: "#718096", fontSize: 12 }}>{p.email}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13, color: "#a0aec0" }}>
            <div>📍 {p.ulicaBroj}</div>
            <div>🏙️ {p.grad} {p.postanskiBroj}</div>
            <div>🏘️ {p.selo}</div>
            <div>📞 {p.telefon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminFinansije({ onNotify }) {
  const [search, setSearch] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [iznos, setIznos] = useState("");
  const [opis, setOpis] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const profiles = Object.values(DB.profiles);
  const filtered = search
    ? DB.racuni.filter(r => r.tiktokIme.toLowerCase().includes(search.toLowerCase()))
    : DB.racuni;

  const totalOtvoren = DB.racuni
    .filter(r => r.status !== "zelena")
    .reduce((s, r) => s + r.iznos, 0);

  const handleSendRacun = () => {
    if (!assignTo || !iznos || !opis) return;
    const profile = profiles.find(p => p.tiktokIme === assignTo);
    if (!profile) return;
    const newRacun = {
      id: "r" + Date.now(),
      kupacEmail: profile.email,
      tiktokIme: profile.tiktokIme,
      iznos: parseInt(iznos),
      opis,
      status: "crvena",
      adminFoto: "https://placehold.co/400x300/1e3a5f/fff?text=Nova+Faktura",
      kupacFoto: null,
      datum: new Date().toISOString().split("T")[0],
    };
    DB.racuni.push(newRacun);
    onNotify(`Faktura poslata kupcu ${profile.tiktokIme}`);
    setSuccessMsg(`✅ Faktura uspešno poslata ${profile.tiktokIme}!`);
    setAssignTo(""); setIznos(""); setOpis("");
    setRefreshKey(k => k + 1);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const byKupac = {};
  DB.racuni.filter(r => r.status !== "zelena").forEach(r => {
    if (!byKupac[r.tiktokIme]) byKupac[r.tiktokIme] = 0;
    byKupac[r.tiktokIme] += r.iznos;
  });

  return (
    <div key={refreshKey}>
      <h2 style={{ color: "#e2e8f0", marginBottom: 16 }}>💰 Finansije</h2>

      {/* Total */}
      <div style={{
        background: "linear-gradient(135deg, #2b6cb0, #1e3a5f)",
        borderRadius: 16, padding: 20, marginBottom: 20,
      }}>
        <p style={{ color: "#90cdf4", fontSize: 13, marginBottom: 4 }}>Ukupno otvorene fakture</p>
        <p style={{ color: "#fff", fontSize: 32, fontWeight: 800 }}>{formatRSD(totalOtvoren)}</p>
      </div>

      {/* Per customer */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#90cdf4", fontSize: 14, marginBottom: 12 }}>Dugovanja po kupcu</h3>
        {Object.entries(byKupac).map(([tiktok, suma]) => (
          <div key={tiktok} style={{
            display: "flex", justifyContent: "space-between",
            background: "rgba(255,255,255,0.05)", padding: "12px 16px",
            borderRadius: 10, marginBottom: 8, fontSize: 14,
          }}>
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{tiktok}</span>
            <span style={{ color: "#fbd38d", fontWeight: 700 }}>{formatRSD(suma)}</span>
          </div>
        ))}
      </div>

      {/* Send new invoice */}
      <div style={{
        background: "rgba(255,255,255,0.05)", borderRadius: 16,
        padding: 20, border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h3 style={{ color: "#90cdf4", marginBottom: 16, fontSize: 15 }}>📸 Pošalji novu fakturu</h3>
        {successMsg && <div style={{
          background: "#f0fff4", color: "#276749", padding: 12,
          borderRadius: 10, marginBottom: 12, fontSize: 14,
        }}>{successMsg}</div>}

        <select
          value={assignTo}
          onChange={e => setAssignTo(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 10,
            border: "2px solid rgba(255,255,255,0.1)", background: "#1e3a5f",
            color: "#e2e8f0", fontSize: 14, marginBottom: 12, boxSizing: "border-box",
          }}
        >
          <option value="">-- Izaberite kupca --</option>
          {profiles.map(p => <option key={p.email} value={p.tiktokIme}>{p.tiktokIme} — {p.imeIPrezime}</option>)}
        </select>

        <input
          type="number"
          value={iznos}
          onChange={e => setIznos(e.target.value)}
          placeholder="Iznos u RSD..."
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 10,
            border: "2px solid rgba(255,255,255,0.1)", background: "#1e3a5f",
            color: "#e2e8f0", fontSize: 14, marginBottom: 12, boxSizing: "border-box",
          }}
        />

        <input
          value={opis}
          onChange={e => setOpis(e.target.value)}
          placeholder="Opis porudžbine..."
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 10,
            border: "2px solid rgba(255,255,255,0.1)", background: "#1e3a5f",
            color: "#e2e8f0", fontSize: 14, marginBottom: 16, boxSizing: "border-box",
          }}
        />

        <button onClick={handleSendRacun} style={{
          width: "100%", padding: "12px", background: "#2b6cb0",
          color: "#fff", border: "none", borderRadius: 10,
          cursor: "pointer", fontWeight: 700, fontSize: 14,
        }}>
          📤 Pošalji Fakturu → Kupcu
        </button>
      </div>

      {/* Search invoices */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: "#90cdf4", marginBottom: 12, fontSize: 14 }}>Pretraga faktura</h3>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pretraži po TikTok imenu..."
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 10,
            border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
            color: "#e2e8f0", fontSize: 14, marginBottom: 12, boxSizing: "border-box",
          }}
        />
        {filtered.map(r => (
          <div key={r.id} style={{
            background: "rgba(255,255,255,0.05)", borderRadius: 12,
            padding: "12px 16px", marginBottom: 8, fontSize: 13,
            borderLeft: `3px solid ${statusConfig[r.status].color}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#90cdf4" }}>{r.tiktokIme}</span>
              <Badge status={r.status} />
            </div>
            <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16, marginTop: 4 }}>
              {formatRSD(r.iznos)} <span style={{ fontWeight: 400, fontSize: 13, color: "#718096" }}>— {r.opis}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminKontrola({ onNotify }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const zute = DB.racuni.filter(r => r.status === "zuta");

  const confirm = (id, tiktokIme) => {
    const idx = DB.racuni.findIndex(r => r.id === id);
    if (idx !== -1) {
      DB.racuni[idx].status = "zelena";
      onNotify(`Plaćanje potvrđeno za ${tiktokIme}`);
      setRefreshKey(k => k + 1);
    }
  };

  const chatEmails = Object.keys(DB.chats);

  const sendAdminMsg = (email) => {
    if (!chatMsg.trim()) return;
    const newMsg = {
      id: Date.now().toString(), od: "admin", tekst: chatMsg,
      vreme: new Date().toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" }),
    };
    DB.chats[email].push(newMsg);
    setChatMsg("");
    setRefreshKey(k => k + 1);
  };

  return (
    <div key={refreshKey}>
      <h2 style={{ color: "#e2e8f0", marginBottom: 16 }}>✅ Kontrola & Chat</h2>

      {/* Pending payments */}
      <h3 style={{ color: "#fbd38d", marginBottom: 12, fontSize: 14 }}>🟡 Čekaju potvrdu ({zute.length})</h3>
      {zute.length === 0 ? (
        <EmptyState icon="✅" text="Sve potvrđeno!" dark />
      ) : zute.map(r => (
        <div key={r.id} style={{
          background: "rgba(255,255,255,0.05)", borderRadius: 16,
          padding: 20, marginBottom: 12, border: "1px solid #d69e2e44",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <p style={{ color: "#90cdf4", fontWeight: 700 }}>{r.tiktokIme}</p>
              <p style={{ color: "#fbd38d", fontWeight: 800, fontSize: 18 }}>{formatRSD(r.iznos)}</p>
              <p style={{ color: "#718096", fontSize: 12 }}>{r.opis}</p>
            </div>
            <Badge status={r.status} />
          </div>

          {r.kupacFoto && (
            <img src={r.kupacFoto} alt="Dokaz uplate" style={{
              width: "100%", borderRadius: 10, maxHeight: 160, objectFit: "cover", marginBottom: 12,
            }} />
          )}

          <button onClick={() => confirm(r.id, r.tiktokIme)} style={{
            width: "100%", padding: "12px", background: "#38a169",
            color: "#fff", border: "none", borderRadius: 10,
            cursor: "pointer", fontWeight: 700, fontSize: 14,
          }}>
            ✅ Potvrdi plaćanje → Zeleno
          </button>
        </div>
      ))}

      {/* Chats */}
      <h3 style={{ color: "#90cdf4", marginTop: 24, marginBottom: 12, fontSize: 14 }}>💬 Chatovi sa kupcima</h3>
      {chatEmails.map(email => {
        const profile = DB.profiles[email];
        const msgs = DB.chats[email];
        const isOpen = selectedChat === email;

        return (
          <div key={email} style={{
            background: "rgba(255,255,255,0.05)", borderRadius: 16,
            marginBottom: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div
              onClick={() => setSelectedChat(isOpen ? null : email)}
              style={{
                padding: "14px 20px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <p style={{ color: "#90cdf4", fontWeight: 700, margin: 0 }}>
                  {profile?.tiktokIme || email}
                </p>
                <p style={{ color: "#718096", fontSize: 12, margin: "2px 0 0" }}>
                  {msgs.length} poruka(e)
                </p>
              </div>
              <span style={{ color: "#718096" }}>{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
              <div>
                <div style={{ padding: "0 16px 12px", maxHeight: 250, overflowY: "auto" }}>
                  {msgs.map(m => (
                    <div key={m.id} style={{
                      display: "flex", justifyContent: m.od === "admin" ? "flex-end" : "flex-start",
                      marginBottom: 8,
                    }}>
                      <div style={{
                        maxWidth: "70%", padding: "8px 14px", borderRadius: 14,
                        background: m.od === "admin" ? "#2b6cb0" : "rgba(255,255,255,0.1)",
                        color: "#e2e8f0", fontSize: 13,
                      }}>
                        {m.tekst}
                        <div style={{ fontSize: 10, opacity: 0.6, textAlign: "right", marginTop: 2 }}>{m.vreme}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 8 }}>
                  <input
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendAdminMsg(email)}
                    placeholder="Odgovor..."
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 10,
                      border: "2px solid rgba(255,255,255,0.1)", background: "#1e3a5f",
                      color: "#e2e8f0", fontSize: 14,
                    }}
                  />
                  <button onClick={() => sendAdminMsg(email)} style={{
                    padding: "10px 16px", background: "#2b6cb0", color: "#fff",
                    border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700,
                  }}>→</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ icon, text, dark }) {
  return (
    <div style={{
      textAlign: "center", padding: "48px 20px",
      color: dark ? "#4a5568" : "#a0aec0",
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontSize: 15 }}>{text}</p>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [loggedInEmail, setLoggedInEmail] = useState(null);
  const [notification, setNotification] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const notify = (msg) => {
    setNotification(msg);
  };

  const handleLogin = (email) => {
    setLoggedInEmail(email);
    setRefreshKey(k => k + 1);
  };

  const handleLogout = () => {
    setLoggedInEmail(null);
  };

  const handleProfileComplete = () => {
    setRefreshKey(k => k + 1);
  };

  const isAdmin = loggedInEmail === "dragan.admin@gmail.com";
  const hasProfile = loggedInEmail && DB.profiles[loggedInEmail];

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #2b6cb0 !important; }
      `}</style>

      {notification && (
        <Notification msg={notification} onClose={() => setNotification(null)} />
      )}

      {!loggedInEmail && (
        <LoginPage onLogin={handleLogin} />
      )}

      {loggedInEmail && isAdmin && (
        <AdminPortal onLogout={handleLogout} onNotify={notify} key={refreshKey} />
      )}

      {loggedInEmail && !isAdmin && !hasProfile && (
        <RegistrationPage
          email={loggedInEmail}
          onComplete={handleProfileComplete}
          onNotify={notify}
        />
      )}

      {loggedInEmail && !isAdmin && hasProfile && (
        <KupacPortal
          email={loggedInEmail}
          onLogout={handleLogout}
          onNotify={notify}
          key={refreshKey}
        />
      )}
    </div>
  );
}
