import { useState, useEffect, useRef } from "react";

// ─── Design tokens ───────────────────────────────────────────────────────────
const COLORS = {
  navy: "#0B1F3A",
  navyLight: "#132847",
  teal: "#00BFA5",
  tealDark: "#009688",
  gold: "#F4A825",
  goldLight: "#F7C259",
  white: "#F7F9FC",
  gray: "#8A9BB0",
  grayLight: "#E2E8F0",
  red: "#E53E3E",
  green: "#38A169",
  purple: "#6B46C1",
  blue: "#3182CE",
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
const Badge = ({ color = COLORS.teal, children, small }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 20, padding: small ? "2px 8px" : "4px 12px",
    fontSize: small ? 11 : 12, fontWeight: 700, letterSpacing: "0.04em",
  }}>{children}</span>
);

const Avatar = ({ name = "?", size = 36, color = COLORS.teal }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}99)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: size * 0.38,
      flexShrink: 0, letterSpacing: "0.02em",
    }}>{initials}</div>
  );
};

const Card = ({ children, style, onClick, hover = true }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: COLORS.navyLight, borderRadius: 14,
        border: `1px solid ${hov && hover ? COLORS.teal + "66" : "#ffffff11"}`,
        padding: 20, transition: "all 0.2s",
        transform: hov && hover && onClick ? "translateY(-2px)" : "none",
        boxShadow: hov && hover ? "0 8px 32px #00BFA522" : "0 2px 8px #00000033",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>{children}</div>
  );
};

const Button = ({ children, onClick, variant = "primary", small, style, disabled }) => {
  const [hov, setHov] = useState(false);
  const variants = {
    primary: { bg: COLORS.teal, color: "#fff" },
    gold: { bg: COLORS.gold, color: COLORS.navy },
    ghost: { bg: "transparent", color: COLORS.teal, border: `1px solid ${COLORS.teal}` },
    danger: { bg: COLORS.red, color: "#fff" },
    dark: { bg: "#ffffff15", color: COLORS.white },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? (v.bg === "transparent" ? COLORS.teal + "22" : v.bg + "dd") : v.bg,
        color: v.color, border: v.border || "none",
        borderRadius: 8, padding: small ? "6px 14px" : "10px 20px",
        fontSize: small ? 13 : 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.18s", letterSpacing: "0.02em",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}>{children}</button>
  );
};

const Input = ({ placeholder, value, onChange, type = "text", style }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange}
    style={{
      background: "#ffffff0a", border: `1px solid #ffffff22`,
      borderRadius: 8, padding: "10px 14px", color: COLORS.white,
      fontSize: 14, outline: "none", width: "100%",
      fontFamily: "inherit", ...style,
    }} />
);

const Textarea = ({ placeholder, value, onChange, rows = 3 }) => (
  <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows}
    style={{
      background: "#ffffff0a", border: `1px solid #ffffff22`,
      borderRadius: 8, padding: "10px 14px", color: COLORS.white,
      fontSize: 14, outline: "none", width: "100%",
      fontFamily: "inherit", resize: "vertical",
    }} />
);

const Select = ({ value, onChange, options, style }) => (
  <select value={value} onChange={onChange}
    style={{
      background: COLORS.navyLight, border: `1px solid #ffffff22`,
      borderRadius: 8, padding: "10px 14px", color: COLORS.white,
      fontSize: 14, outline: "none", width: "100%", fontFamily: "inherit", ...style,
    }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "#00000088",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: COLORS.navyLight, borderRadius: 16,
        border: `1px solid #ffffff22`, padding: 28, width, maxWidth: "95vw",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 80px #00000066",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: COLORS.white, margin: 0, fontSize: 20 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: COLORS.gray,
            cursor: "pointer", fontSize: 22, lineHeight: 1,
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Toast = ({ message, type = "success", onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);
  const colors = { success: COLORS.green, error: COLORS.red, info: COLORS.teal };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 2000,
      background: colors[type], color: "#fff", borderRadius: 10,
      padding: "12px 22px", fontWeight: 700, fontSize: 14,
      boxShadow: "0 8px 32px #00000044",
      animation: "slideUp 0.3s ease",
    }}>{message}</div>
  );
};

// ─── Fake data ────────────────────────────────────────────────────────────────
const SPECIALTIES = ["All", "Cardiology", "Neurology", "Oncology", "Pediatrics", "Orthopedics", "Dermatology", "Psychiatry", "Radiology", "General Practice"];

const DOCTORS = [
  { id: 1, name: "Dr. Sarah Mitchell", specialty: "Cardiology", hospital: "St. Luke's Medical Center", available: true, avatar: COLORS.teal, rating: 4.9 },
  { id: 2, name: "Dr. James Okonkwo", specialty: "Neurology", hospital: "Metro Brain Institute", available: true, avatar: COLORS.gold, rating: 4.8 },
  { id: 3, name: "Dr. Priya Sharma", specialty: "Oncology", hospital: "City Cancer Center", available: false, avatar: COLORS.purple, rating: 4.7 },
  { id: 4, name: "Dr. Carlos Mendez", specialty: "Pediatrics", hospital: "Children's National", available: true, avatar: COLORS.blue, rating: 4.9 },
  { id: 5, name: "Dr. Emily Chen", specialty: "Dermatology", hospital: "Skin & Wellness Clinic", available: true, avatar: "#E53E3E", rating: 4.6 },
  { id: 6, name: "Dr. Ahmed Al-Rashid", specialty: "Orthopedics", hospital: "Bone & Joint Center", available: true, avatar: COLORS.green, rating: 4.8 },
  { id: 7, name: "Dr. Linda Osei", specialty: "Psychiatry", hospital: "MindCare Hospital", available: false, avatar: "#DD6B20", rating: 4.7 },
  { id: 8, name: "Dr. Tomás Novak", specialty: "Radiology", hospital: "Imaging Associates", available: true, avatar: "#B7791F", rating: 4.5 },
];

const MESSAGES = [
  { id: 1, from: "Admin", subject: "Platform Update — New Features Available", preview: "We've rolled out several improvements to the referral module...", time: "10:32 AM", read: false, body: "Dear Member,\n\nWe've rolled out several improvements to the referral module, including real-time appointment confirmation and enhanced patient tracking. Please review the updated workflows in your dashboard.\n\nBest regards,\nThe MedConnect Team" },
  { id: 2, from: "Dr. Sarah Mitchell", subject: "Re: Patient Referral — John Doe", preview: "I've reviewed the case and can schedule an appointment...", time: "Yesterday", read: false, body: "Hello,\n\nI've reviewed the referral for patient John Doe (cardiac workup). I can schedule an appointment next Tuesday at 2:00 PM. Please confirm with the patient and update the referral status.\n\nBest,\nDr. Mitchell" },
  { id: 3, from: "Events Team", subject: "Upcoming Cardiology Summit — Register Now", preview: "The annual cardiology summit will be held on...", time: "Mon", read: true, body: "The annual Cardiology Summit is scheduled for June 12–14. Early bird registration closes May 30. Featuring keynotes from Dr. Harrington and Dr. Patel. CME credits available." },
  { id: 4, from: "Marketplace", subject: "Your listing has received 3 inquiries", preview: "Three members have shown interest in your ECG machine listing...", time: "Sun", read: true, body: "Congratulations! Your ECG machine listing has received 3 inquiries. Log in to the marketplace to review and respond to interested buyers." },
];

const FORUM_POSTS = [
  { id: 1, author: "Dr. James Okonkwo", specialty: "Neurology", title: "New Guidelines on Migraine Management — Discussion", replies: 14, views: 342, time: "2h ago", pinned: true, tags: ["Neurology", "Guidelines"] },
  { id: 2, author: "Dr. Priya Sharma", specialty: "Oncology", title: "Immunotherapy response rates in NSCLC — sharing cases", replies: 8, views: 197, time: "5h ago", tags: ["Oncology", "Research"] },
  { id: 3, author: "Dr. Carlos Mendez", specialty: "Pediatrics", title: "RSV surge this winter — what are your treatment protocols?", replies: 22, views: 510, time: "1d ago", tags: ["Pediatrics", "Viral"] },
  { id: 4, author: "Dr. Emily Chen", specialty: "Dermatology", title: "Biologic therapy for moderate-to-severe psoriasis — outcomes?", replies: 6, views: 144, time: "2d ago", tags: ["Dermatology"] },
  { id: 5, author: "Dr. Ahmed Al-Rashid", specialty: "Orthopedics", title: "Robotic-assisted arthroplasty — worth the investment?", replies: 19, views: 388, time: "3d ago", tags: ["Orthopedics", "Technology"] },
];

const MARKETPLACE_ITEMS = [
  { id: 1, title: "Philips IntelliVue MX500 Patient Monitor", price: "$4,200", type: "sale", seller: "Dr. Sarah Mitchell", specialty: "Cardiology", condition: "Excellent", image: "🖥️", time: "2d ago" },
  { id: 2, title: "Welch Allyn Ophthalmoscope Set", price: "$380", type: "sale", seller: "Dr. Emily Chen", specialty: "Dermatology", condition: "Good", image: "🔦", time: "4d ago" },
  { id: 3, title: "Ultrasound Machine — Siemens ACUSON", price: "$1,500/mo", type: "rent", seller: "City Imaging Center", specialty: "Radiology", condition: "New", image: "📡", time: "1w ago" },
  { id: 4, title: "Exam Table — Midmark 626", price: "$650", type: "sale", seller: "Dr. Carlos Mendez", specialty: "Pediatrics", condition: "Good", image: "🛏️", time: "1w ago" },
  { id: 5, title: "Medical Office Space — 1,200 sq ft", price: "$3,200/mo", type: "rent", seller: "MedSpace Group", specialty: "General", condition: "—", image: "🏥", time: "2w ago" },
];

const EVENTS = [
  { id: 1, title: "International Cardiology Summit 2026", specialty: "Cardiology", date: "Jun 12–14, 2026", location: "Chicago, IL", type: "Conference", cme: 18, attendees: 1240 },
  { id: 2, title: "Neuroscience Research Symposium", specialty: "Neurology", date: "Jun 22, 2026", location: "Boston, MA", type: "Symposium", cme: 6, attendees: 340 },
  { id: 3, title: "Oncology Best Practices Workshop", specialty: "Oncology", date: "Jul 5, 2026", location: "Virtual", type: "Workshop", cme: 4, attendees: 890 },
  { id: 4, title: "Pediatric Emergency Medicine Update", specialty: "Pediatrics", date: "Jul 18–19, 2026", location: "Miami, FL", type: "Conference", cme: 12, attendees: 520 },
  { id: 5, title: "Skin Health & Dermatology Forum", specialty: "Dermatology", date: "Aug 3, 2026", location: "Los Angeles, CA", type: "Forum", cme: 8, attendees: 290 },
  { id: 6, title: "Orthopedic Innovation Expo", specialty: "Orthopedics", date: "Aug 20–22, 2026", location: "Houston, TX", type: "Expo", cme: 15, attendees: 780 },
];

const WEBINARS = [
  { id: 1, title: "Managing Hypertension in Elderly Patients", host: "Dr. Sarah Mitchell", specialty: "Cardiology", date: "May 20, 2026", duration: "90 min", attendees: 312, type: "live", cme: 1.5 },
  { id: 2, title: "AI in Diagnostic Radiology — Practical Applications", host: "Dr. Tomás Novak", specialty: "Radiology", date: "Recorded", duration: "60 min", attendees: 1450, type: "recorded", cme: 1.0 },
  { id: 3, title: "Pediatric Vaccination Updates 2026", host: "Dr. Carlos Mendez", specialty: "Pediatrics", date: "May 28, 2026", duration: "45 min", attendees: 289, type: "live", cme: 0.75 },
  { id: 4, title: "Cognitive Behavioral Therapy for Chronic Pain", host: "Dr. Linda Osei", specialty: "Psychiatry", date: "Recorded", duration: "120 min", attendees: 876, type: "recorded", cme: 2.0 },
  { id: 5, title: "Immunotherapy Breakthroughs in 2026", host: "Dr. Priya Sharma", specialty: "Oncology", date: "Jun 4, 2026", duration: "75 min", attendees: 540, type: "live", cme: 1.25 },
];

const ADS = [
  { id: 1, title: "Medscape EMR — Try Free for 30 Days", body: "Streamline your practice with our AI-powered electronic medical records. HIPAA-compliant, cloud-based, integrates with 200+ labs.", cta: "Start Free Trial", color: COLORS.teal, views: 1842, clicks: 213 },
  { id: 2, title: "MedLiability Pro Insurance", body: "Trusted by 50,000+ physicians. Comprehensive malpractice coverage starting at $899/year. Get your quote in 5 minutes.", cta: "Get a Quote", color: COLORS.gold, views: 2104, clicks: 341 },
  { id: 3, title: "Continuing Education — 50 CME Credits Online", body: "Accredited courses in 30+ specialties. Learn at your own pace. Certificate issued upon completion.", cta: "Browse Courses", color: COLORS.purple, views: 3200, clicks: 487 },
];

const APPOINTMENTS = [
  { id: 1, patient: "John Doe", referring: "Dr. Carlos Mendez", doctor: "Dr. Sarah Mitchell", date: "May 20, 2026 — 2:00 PM", urgency: "high", status: "pending", specialty: "Cardiology", notes: "Chest pain, SOB for 3 days. EKG ordered." },
  { id: 2, patient: "Maria Garcia", referring: "Dr. Emily Chen", doctor: "Dr. James Okonkwo", date: "May 22, 2026 — 10:00 AM", urgency: "medium", status: "confirmed", specialty: "Neurology", notes: "Persistent headaches, visual aura." },
  { id: 3, patient: "Robert Kim", referring: "Dr. Ahmed Al-Rashid", doctor: "Dr. Priya Sharma", date: "May 25, 2026 — 3:30 PM", urgency: "low", status: "pending", specialty: "Oncology", notes: "Follow-up biopsy results review." },
];

// ─── Tab Mailbox ──────────────────────────────────────────────────────────────
function MailboxTab() {
  const [messages, setMessages] = useState(MESSAGES);
  const [selected, setSelected] = useState(null);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState({ to: "", subject: "", body: "" });
  const [toast, setToast] = useState(null);

  const openMsg = (msg) => {
    setSelected(msg);
    setMessages(ms => ms.map(m => m.id === msg.id ? { ...m, read: true } : m));
  };

  const sendMsg = () => {
    setToast({ message: "Message sent successfully!", type: "success" });
    setComposing(false);
    setDraft({ to: "", subject: "", body: "" });
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div style={{ display: "flex", gap: 16, height: "70vh" }}>
      {/* List */}
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ color: COLORS.white, fontWeight: 700 }}>Inbox {unread > 0 && <Badge small color={COLORS.red}>{unread}</Badge>}</div>
          <Button small onClick={() => setComposing(true)}>✏ Compose</Button>
        </div>
        {messages.map(msg => (
          <Card key={msg.id} onClick={() => openMsg(msg)} style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ fontWeight: msg.read ? 500 : 800, color: COLORS.white, fontSize: 13, flex: 1 }}>{msg.from}</div>
              <div style={{ color: COLORS.gray, fontSize: 11, flexShrink: 0 }}>{msg.time}</div>
            </div>
            <div style={{ color: msg.read ? COLORS.gray : COLORS.white, fontSize: 13, fontWeight: msg.read ? 400 : 600, marginTop: 2 }}>{msg.subject}</div>
            <div style={{ color: COLORS.gray, fontSize: 12, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.preview}</div>
            {!msg.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.teal, marginTop: 8 }} />}
          </Card>
        ))}
      </div>

      {/* Body */}
      <Card style={{ flex: 1, padding: 24 }}>
        {selected ? (
          <div>
            <div style={{ color: COLORS.teal, fontWeight: 700, marginBottom: 4, fontSize: 11, letterSpacing: "0.08em" }}>FROM</div>
            <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{selected.from}</div>
            <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 16 }}>{selected.subject}</div>
            <div style={{ borderTop: "1px solid #ffffff11", paddingTop: 16, color: COLORS.grayLight, lineHeight: 1.7, whiteSpace: "pre-line", fontSize: 14 }}>{selected.body}</div>
            <div style={{ marginTop: 20 }}>
              <Button small onClick={() => { setDraft({ to: selected.from, subject: "Re: " + selected.subject, body: "" }); setComposing(true); setSelected(null); }}>↩ Reply</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: COLORS.gray }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
            <div style={{ fontSize: 15 }}>Select a message to read</div>
          </div>
        )}
      </Card>

      <Modal open={composing} onClose={() => setComposing(false)} title="New Message">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input placeholder="To (name or email)" value={draft.to} onChange={e => setDraft({ ...draft, to: e.target.value })} />
          <Input placeholder="Subject" value={draft.subject} onChange={e => setDraft({ ...draft, subject: e.target.value })} />
          <Textarea placeholder="Write your message..." value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={8} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" small onClick={() => setComposing(false)}>Cancel</Button>
            <Button small onClick={sendMsg}>Send Message</Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ─── Tab Forum ────────────────────────────────────────────────────────────────
function ForumTab() {
  const [posts, setPosts] = useState(FORUM_POSTS);
  const [filter, setFilter] = useState("All");
  const [newPost, setNewPost] = useState(false);
  const [draft, setDraft] = useState({ title: "", tag: "Cardiology", body: "" });
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [toast, setToast] = useState(null);

  const filtered = filter === "All" ? posts : posts.filter(p => p.tags.includes(filter));

  const submit = () => {
    setPosts([{ id: posts.length + 1, author: "You", specialty: draft.tag, title: draft.title, replies: 0, views: 1, time: "Just now", tags: [draft.tag] }, ...posts]);
    setNewPost(false); setDraft({ title: "", tag: "Cardiology", body: "" });
    setToast({ message: "Post published!", type: "success" });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", "Cardiology", "Neurology", "Oncology", "Pediatrics", "Dermatology", "Orthopedics"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? COLORS.teal : "#ffffff11",
              color: filter === f ? "#fff" : COLORS.gray,
              border: "none", borderRadius: 20, padding: "6px 14px",
              fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all 0.18s",
            }}>{f}</button>
          ))}
        </div>
        <Button small onClick={() => setNewPost(true)}>+ New Post</Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(post => (
          <Card key={post.id} onClick={() => setSelected(post)} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16 }}>
            <Avatar name={post.author} size={42} color={COLORS.teal} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {post.pinned && <Badge small color={COLORS.gold}>📌 Pinned</Badge>}
                {post.tags.map(t => <Badge key={t} small>{t}</Badge>)}
              </div>
              <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15, marginTop: 4 }}>{post.title}</div>
              <div style={{ color: COLORS.gray, fontSize: 12, marginTop: 4 }}>{post.author} · {post.time}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, color: COLORS.gray, fontSize: 12 }}>
              <div>💬 {post.replies} replies</div>
              <div>👁 {post.views} views</div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={newPost} onClose={() => setNewPost(false)} title="New Forum Post">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input placeholder="Post title" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          <Select value={draft.tag} onChange={e => setDraft({ ...draft, tag: e.target.value })}
            options={SPECIALTIES.filter(s => s !== "All").map(s => ({ value: s, label: s }))} />
          <Textarea placeholder="Write your post..." value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={6} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" small onClick={() => setNewPost(false)}>Cancel</Button>
            <Button small onClick={submit} disabled={!draft.title}>Publish</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} width={600}>
        {selected && (
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
              <Avatar name={selected.author} size={36} />
              <div>
                <div style={{ color: COLORS.white, fontWeight: 700 }}>{selected.author}</div>
                <div style={{ color: COLORS.gray, fontSize: 12 }}>{selected.specialty} · {selected.time}</div>
              </div>
            </div>
            <div style={{ color: COLORS.grayLight, lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>
              This is a discussion thread about {selected.title}. Colleagues are sharing clinical experiences and evidence-based protocols. Join the conversation below.
            </div>
            <div style={{ borderTop: "1px solid #ffffff11", paddingTop: 16 }}>
              <div style={{ color: COLORS.teal, fontWeight: 700, marginBottom: 12, fontSize: 13 }}>{selected.replies} REPLIES</div>
              {[...Array(Math.min(selected.replies, 3))].map((_, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <Avatar name={DOCTORS[i % DOCTORS.length].name} size={32} color={DOCTORS[i % DOCTORS.length].avatar} />
                  <div style={{ background: "#ffffff08", borderRadius: 8, padding: "10px 14px", flex: 1 }}>
                    <div style={{ color: COLORS.teal, fontSize: 12, fontWeight: 700 }}>{DOCTORS[i % DOCTORS.length].name}</div>
                    <div style={{ color: COLORS.grayLight, fontSize: 13, marginTop: 4 }}>Great point. In our department we've seen similar results with the updated protocol. Happy to share our case data.</div>
                  </div>
                </div>
              ))}
              <Textarea placeholder="Write a reply..." value={reply} onChange={e => setReply(e.target.value)} rows={3} />
              <div style={{ marginTop: 10, textAlign: "right" }}>
                <Button small onClick={() => { setToast({ message: "Reply posted!", type: "success" }); setReply(""); setSelected(null); }}>Post Reply</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ─── Tab Marketplace ──────────────────────────────────────────────────────────
function MarketplaceTab() {
  const [items, setItems] = useState(MARKETPLACE_ITEMS);
  const [typeFilter, setTypeFilter] = useState("all");
  const [listing, setListing] = useState(false);
  const [draft, setDraft] = useState({ title: "", price: "", type: "sale", description: "", condition: "Good" });
  const [contact, setContact] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = typeFilter === "all" ? items : items.filter(i => i.type === typeFilter);

  const publish = () => {
    setItems([{ id: items.length + 1, title: draft.title, price: draft.price, type: draft.type, seller: "You", specialty: "General", condition: draft.condition, image: "📦", time: "Just now" }, ...items]);
    setListing(false); setDraft({ title: "", price: "", type: "sale", description: "", condition: "Good" });
    setToast({ message: "Listing published!", type: "success" });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", gap: 8 }}>
          {[["all", "All"], ["sale", "For Sale"], ["rent", "For Rent"]].map(([v, l]) => (
            <button key={v} onClick={() => setTypeFilter(v)} style={{
              background: typeFilter === v ? COLORS.gold : "#ffffff11",
              color: typeFilter === v ? COLORS.navy : COLORS.gray,
              border: "none", borderRadius: 20, padding: "6px 16px",
              fontSize: 13, cursor: "pointer", fontWeight: 700, transition: "all 0.18s",
            }}>{l}</button>
          ))}
        </div>
        <Button small variant="gold" onClick={() => setListing(true)}>+ List Item</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {filtered.map(item => (
          <Card key={item.id} style={{ padding: 18 }}>
            <div style={{ fontSize: 40, marginBottom: 12, textAlign: "center", background: "#ffffff08", borderRadius: 10, padding: "16px 0" }}>{item.image}</div>
            <Badge small color={item.type === "sale" ? COLORS.teal : COLORS.gold}>{item.type === "sale" ? "For Sale" : "For Rent"}</Badge>
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15, marginTop: 8, marginBottom: 4 }}>{item.title}</div>
            <div style={{ color: COLORS.teal, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>{item.price}</div>
            <div style={{ color: COLORS.gray, fontSize: 12, marginBottom: 12 }}>
              Seller: {item.seller} · Condition: {item.condition} · {item.time}
            </div>
            <Button small style={{ width: "100%" }} onClick={() => setContact(item)}>Contact Seller</Button>
          </Card>
        ))}
      </div>

      <Modal open={listing} onClose={() => setListing(false)} title="New Listing">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input placeholder="Item title" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input placeholder="Price (e.g. $500 or $200/mo)" value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} />
            <Select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}
              options={[{ value: "sale", label: "For Sale" }, { value: "rent", label: "For Rent" }]} />
          </div>
          <Select value={draft.condition} onChange={e => setDraft({ ...draft, condition: e.target.value })}
            options={["New", "Excellent", "Good", "Fair"].map(c => ({ value: c, label: c }))} />
          <Textarea placeholder="Description..." value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" small onClick={() => setListing(false)}>Cancel</Button>
            <Button small variant="gold" onClick={publish} disabled={!draft.title || !draft.price}>Publish Listing</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!contact} onClose={() => setContact(null)} title={`Contact: ${contact?.seller}`}>
        {contact && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ color: COLORS.gray, fontSize: 14 }}>Re: <strong style={{ color: COLORS.white }}>{contact.title}</strong> ({contact.price})</div>
            <Textarea placeholder="Write a message to the seller..." rows={5} />
            <Button onClick={() => { setToast({ message: "Message sent!", type: "success" }); setContact(null); }}>Send Message</Button>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ─── Tab Admin Ads ────────────────────────────────────────────────────────────
function AdsTab({ isAdmin }) {
  const [ads, setAds] = useState(ADS);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", cta: "" });
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState(
    ADS.reduce((acc, a) => ({ ...acc, [a.id]: { views: a.views, clicks: a.clicks } }), {})
  );

  const trackClick = (id) => {
    setStats(s => ({ ...s, [id]: { ...s[id], clicks: s[id].clicks + 1 } }));
    setToast({ message: "Opening advertiser link...", type: "info" });
  };

  const publish = () => {
    const newAd = { id: ads.length + 1, title: draft.title, body: draft.body, cta: draft.cta, color: COLORS.teal, views: 0, clicks: 0 };
    setAds([...ads, newAd]);
    setStats(s => ({ ...s, [newAd.id]: { views: 0, clicks: 0 } }));
    setCreating(false); setDraft({ title: "", body: "", cta: "" });
    setToast({ message: "Ad published to all members!", type: "success" });
  };

  return (
    <div>
      {isAdmin && (
        <Card style={{ marginBottom: 20, background: COLORS.navy + "aa", border: `1px solid ${COLORS.gold}44` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ color: COLORS.gold, fontWeight: 800, fontSize: 16 }}>📊 Admin — Ad Performance</div>
            <Button small variant="gold" onClick={() => setCreating(true)}>+ Create Ad</Button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {ads.map(ad => (
              <div key={ad.id} style={{ background: "#ffffff08", borderRadius: 10, padding: 14 }}>
                <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{ad.title}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "#ffffff0a", borderRadius: 8, padding: 10, textAlign: "center" }}>
                    <div style={{ color: COLORS.teal, fontWeight: 800, fontSize: 20 }}>{(stats[ad.id]?.views || 0).toLocaleString()}</div>
                    <div style={{ color: COLORS.gray, fontSize: 11 }}>Views</div>
                  </div>
                  <div style={{ background: "#ffffff0a", borderRadius: 8, padding: 10, textAlign: "center" }}>
                    <div style={{ color: COLORS.gold, fontWeight: 800, fontSize: 20 }}>{stats[ad.id]?.clicks || 0}</div>
                    <div style={{ color: COLORS.gray, fontSize: 11 }}>Clicks</div>
                  </div>
                </div>
                <div style={{ color: COLORS.gray, fontSize: 12, marginTop: 8, textAlign: "center" }}>
                  CTR: {stats[ad.id]?.views ? ((stats[ad.id].clicks / stats[ad.id].views) * 100).toFixed(1) : 0}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 4 }}>Sponsored — From MedConnect Partners</div>
        {ads.map(ad => (
          <div key={ad.id} style={{
            background: `linear-gradient(135deg, ${ad.color}22, ${ad.color}08)`,
            border: `1px solid ${ad.color}44`,
            borderRadius: 14, padding: 20,
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <div style={{
              width: 6, alignSelf: "stretch", borderRadius: 3,
              background: `linear-gradient(to bottom, ${ad.color}, ${ad.color}66)`,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: ad.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>SPONSORED</div>
              <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 17, marginBottom: 6 }}>{ad.title}</div>
              <div style={{ color: COLORS.grayLight, fontSize: 14, lineHeight: 1.6 }}>{ad.body}</div>
            </div>
            <Button variant="gold" small onClick={() => trackClick(ad.id)} style={{ flexShrink: 0 }}>{ad.cta} →</Button>
          </div>
        ))}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Create New Ad">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input placeholder="Ad headline" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          <Textarea placeholder="Ad body text..." value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} />
          <Input placeholder="Call-to-action button text" value={draft.cta} onChange={e => setDraft({ ...draft, cta: e.target.value })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" small onClick={() => setCreating(false)}>Cancel</Button>
            <Button small variant="gold" onClick={publish} disabled={!draft.title}>Publish Ad</Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ─── Tab Referrals ────────────────────────────────────────────────────────────
function ReferralsTab() {
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [referring, setReferring] = useState(false);
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [toast, setToast] = useState(null);
  const [refForm, setRefForm] = useState({ patient: "", dob: "", notes: "", urgency: "medium", date: "", time: "" });

  const filteredDocs = DOCTORS.filter(d =>
    (specFilter === "All" || d.specialty === specFilter) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  const submitReferral = () => {
    setAppointments([{
      id: appointments.length + 1, patient: refForm.patient,
      referring: "You", doctor: selectedDoc.name, specialty: selectedDoc.specialty,
      date: `${refForm.date} — ${refForm.time}`, urgency: refForm.urgency,
      status: "pending", notes: refForm.notes,
    }, ...appointments]);
    setReferring(false); setSelectedDoc(null);
    setRefForm({ patient: "", dob: "", notes: "", urgency: "medium", date: "", time: "" });
    setToast({ message: `Referral sent to ${selectedDoc.name}. Awaiting confirmation.`, type: "success" });
  };

  const confirmAppt = (id) => {
    setAppointments(a => a.map(ap => ap.id === id ? { ...ap, status: "confirmed" } : ap));
    setToast({ message: "Appointment confirmed!", type: "success" });
  };

  const urgencyColor = { high: COLORS.red, medium: COLORS.gold, low: COLORS.green };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Search */}
      <div>
        <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Find a Specialist</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <Input placeholder="Search by name or specialty..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
          <Select value={specFilter} onChange={e => setSpecFilter(e.target.value)}
            options={SPECIALTIES.map(s => ({ value: s, label: s }))} style={{ width: 180 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {filteredDocs.map(doc => (
            <Card key={doc.id} onClick={() => { setSelectedDoc(doc); setReferring(true); }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                <Avatar name={doc.name} size={44} color={doc.avatar} />
                <div>
                  <div style={{ color: COLORS.white, fontWeight: 700 }}>{doc.name}</div>
                  <div style={{ color: COLORS.gray, fontSize: 12 }}>{doc.specialty}</div>
                </div>
              </div>
              <div style={{ color: COLORS.gray, fontSize: 12, marginBottom: 10 }}>{doc.hospital}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Badge small color={doc.available ? COLORS.green : COLORS.red}>{doc.available ? "Available" : "Busy"}</Badge>
                <div style={{ color: COLORS.gold, fontSize: 12 }}>⭐ {doc.rating}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Appointments list */}
      <div>
        <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>📋 Referral Appointments</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {appointments.map(apt => (
            <Card key={apt.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ color: COLORS.white, fontWeight: 800 }}>{apt.patient}</div>
                    <Badge small color={urgencyColor[apt.urgency]}>{apt.urgency.toUpperCase()} URGENCY</Badge>
                    <Badge small color={apt.status === "confirmed" ? COLORS.green : COLORS.gold}>
                      {apt.status === "confirmed" ? "✓ Confirmed" : "⏳ Pending"}
                    </Badge>
                  </div>
                  <div style={{ color: COLORS.gray, fontSize: 13 }}>
                    → {apt.doctor} ({apt.specialty}) · {apt.date}
                  </div>
                  <div style={{ color: COLORS.gray, fontSize: 12, marginTop: 4 }}>{apt.notes}</div>
                </div>
                {apt.status === "pending" && (
                  <Button small variant="gold" onClick={() => confirmAppt(apt.id)}>
                    ✓ Confirm (as Doctor)
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Referral modal */}
      <Modal open={referring && !!selectedDoc} onClose={() => { setReferring(false); setSelectedDoc(null); }} title={`Refer to ${selectedDoc?.name}`} width={540}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#ffffff08", borderRadius: 10, padding: 12 }}>
            <Avatar name={selectedDoc?.name || ""} size={40} color={selectedDoc?.avatar} />
            <div>
              <div style={{ color: COLORS.white, fontWeight: 700 }}>{selectedDoc?.name}</div>
              <div style={{ color: COLORS.gray, fontSize: 12 }}>{selectedDoc?.specialty} · {selectedDoc?.hospital}</div>
            </div>
          </div>
          <div style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13 }}>Patient Information</div>
          <Input placeholder="Full patient name" value={refForm.patient} onChange={e => setRefForm({ ...refForm, patient: e.target.value })} />
          <Input placeholder="Date of birth (MM/DD/YYYY)" value={refForm.dob} onChange={e => setRefForm({ ...refForm, dob: e.target.value })} />
          <Textarea placeholder="Clinical notes and reason for referral..." value={refForm.notes} onChange={e => setRefForm({ ...refForm, notes: e.target.value })} rows={3} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select value={refForm.urgency} onChange={e => setRefForm({ ...refForm, urgency: e.target.value })}
              options={[{ value: "high", label: "🔴 High Urgency" }, { value: "medium", label: "🟡 Medium" }, { value: "low", label: "🟢 Low" }]} />
            <Input type="date" value={refForm.date} onChange={e => setRefForm({ ...refForm, date: e.target.value })} />
          </div>
          <Input placeholder="Preferred time (e.g. 2:00 PM)" value={refForm.time} onChange={e => setRefForm({ ...refForm, time: e.target.value })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" small onClick={() => { setReferring(false); setSelectedDoc(null); }}>Cancel</Button>
            <Button small onClick={submitReferral} disabled={!refForm.patient}>Send Referral & Book</Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ─── Tab Events ───────────────────────────────────────────────────────────────
function EventsTab() {
  const [filter, setFilter] = useState("All");
  const [registering, setRegistering] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = filter === "All" ? EVENTS : EVENTS.filter(e => e.specialty === filter);
  const typeColors = { Conference: COLORS.teal, Symposium: COLORS.purple, Workshop: COLORS.gold, Forum: COLORS.blue, Expo: COLORS.green };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {["All", "Cardiology", "Neurology", "Oncology", "Pediatrics", "Dermatology", "Orthopedics"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? COLORS.teal : "#ffffff11",
            color: filter === f ? "#fff" : COLORS.gray,
            border: "none", borderRadius: 20, padding: "6px 14px",
            fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all 0.18s",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {filtered.map(ev => (
          <Card key={ev.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <Badge small color={typeColors[ev.type] || COLORS.teal}>{ev.type}</Badge>
              <Badge small color={COLORS.teal}>{ev.cme} CME</Badge>
            </div>
            <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{ev.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <div style={{ color: COLORS.teal, fontSize: 13 }}>📅 {ev.date}</div>
              <div style={{ color: COLORS.gray, fontSize: 13 }}>📍 {ev.location}</div>
              <div style={{ color: COLORS.gray, fontSize: 13 }}>👥 {ev.attendees.toLocaleString()} registered</div>
            </div>
            <Button small style={{ width: "100%" }} onClick={() => setRegistering(ev)}>Register Now</Button>
          </Card>
        ))}
      </div>

      <Modal open={!!registering} onClose={() => setRegistering(null)} title={`Register: ${registering?.title}`}>
        {registering && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#ffffff08", borderRadius: 10, padding: 14 }}>
              <div style={{ color: COLORS.teal, fontSize: 13 }}>📅 {registering.date} · 📍 {registering.location}</div>
              <div style={{ color: COLORS.white, fontSize: 14, marginTop: 6 }}>CME Credits: <strong>{registering.cme}</strong></div>
            </div>
            <Input placeholder="Full name" />
            <Input placeholder="Medical license number" />
            <Input type="email" placeholder="Email address" />
            <Button onClick={() => { setToast({ message: "Registration confirmed! Check your email.", type: "success" }); setRegistering(null); }}>
              Complete Registration
            </Button>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ─── Tab Webinars ─────────────────────────────────────────────────────────────
function WebinarsTab() {
  const [filter, setFilter] = useState("all");
  const [playing, setPlaying] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = filter === "all" ? WEBINARS : WEBINARS.filter(w => w.type === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        {[["all", "All"], ["live", "🔴 Upcoming Live"], ["recorded", "▶ Recorded"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background: filter === v ? COLORS.teal : "#ffffff11",
            color: filter === v ? "#fff" : COLORS.gray,
            border: "none", borderRadius: 20, padding: "6px 16px",
            fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all 0.18s",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {filtered.map(w => (
          <Card key={w.id} onClick={() => { if (w.type === "recorded") setPlaying(w); else setToast({ message: "Reminder set for " + w.date, type: "success" }); }}>
            <div style={{
              background: w.type === "live"
                ? `linear-gradient(135deg, ${COLORS.red}33, ${COLORS.red}11)`
                : `linear-gradient(135deg, ${COLORS.teal}33, ${COLORS.teal}11)`,
              borderRadius: 10, padding: "20px 0", textAlign: "center",
              fontSize: 36, marginBottom: 14,
            }}>
              {w.type === "live" ? "🔴" : "▶️"}
            </div>
            <Badge small color={w.type === "live" ? COLORS.red : COLORS.teal}>
              {w.type === "live" ? "LIVE — " + w.date : "Recorded"}
            </Badge>
            <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 15, marginTop: 8, marginBottom: 4 }}>{w.title}</div>
            <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 8 }}>
              Host: {w.host} · {w.duration} · {w.cme} CME
            </div>
            <div style={{ color: COLORS.gray, fontSize: 12, marginBottom: 12 }}>👥 {w.attendees.toLocaleString()} attendees</div>
            <Button small style={{ width: "100%" }} variant={w.type === "live" ? "gold" : "primary"}>
              {w.type === "live" ? "Register & Set Reminder" : "Watch Now"}
            </Button>
          </Card>
        ))}
      </div>

      {/* Video player modal */}
      <Modal open={!!playing} onClose={() => setPlaying(null)} title={playing?.title} width={640}>
        {playing && (
          <div>
            <div style={{
              background: "#000", borderRadius: 12, aspectRatio: "16/9",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 64 }}>▶️</div>
              <div style={{ color: COLORS.gray, fontSize: 14, marginTop: 8 }}>Video Player — {playing.duration}</div>
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                <Button small>⏮ 15s</Button>
                <Button small>▶ Play</Button>
                <Button small>⏭ 15s</Button>
              </div>
            </div>
            <div style={{ color: COLORS.gray, fontSize: 13 }}>Host: {playing.host} · CME: {playing.cme} credits · {playing.specialty}</div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "mailbox", label: "Mailbox", icon: "📬" },
  { id: "forum", label: "Forum", icon: "💬" },
  { id: "marketplace", label: "Marketplace", icon: "🏪" },
  { id: "ads", label: "Ads", icon: "📢" },
  { id: "referrals", label: "Referrals", icon: "🔗" },
  { id: "events", label: "Events", icon: "📅" },
  { id: "webinars", label: "Webinars", icon: "🎥" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("mailbox");
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const unreadMail = MESSAGES.filter(m => !m.read).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.navy,
      fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
      color: COLORS.white,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ffffff22; border-radius: 3px; }
        input, textarea, select { font-family: 'Outfit', system-ui, sans-serif !important; }
        input::placeholder, textarea::placeholder { color: #8A9BB0; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Sidebar Nav (desktop) */}
      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
        background: COLORS.navyLight,
        borderRight: "1px solid #ffffff0d",
        display: "flex", flexDirection: "column",
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>⚕</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em", color: COLORS.white }}>MedConnect</div>
              <div style={{ fontSize: 10, color: COLORS.teal, letterSpacing: "0.08em", fontWeight: 700 }}>PRO PLATFORM</div>
            </div>
          </div>
        </div>

        {/* User card */}
        <div style={{ margin: "0 12px 16px", background: "#ffffff08", borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Avatar name="Dr. Alex Jordan" size={36} color={COLORS.teal} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Dr. Alex Jordan</div>
              <div style={{ color: COLORS.gray, fontSize: 11 }}>General Practice</div>
            </div>
          </div>
          <button onClick={() => setIsAdmin(!isAdmin)} style={{
            marginTop: 10, width: "100%",
            background: isAdmin ? COLORS.gold + "22" : "#ffffff08",
            border: `1px solid ${isAdmin ? COLORS.gold + "55" : "#ffffff11"}`,
            borderRadius: 6, padding: "5px 10px", cursor: "pointer",
            color: isAdmin ? COLORS.gold : COLORS.gray, fontSize: 11, fontWeight: 700,
            transition: "all 0.18s",
          }}>
            {isAdmin ? "👑 Admin Mode ON" : "Switch to Admin"}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0 10px" }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "10px 12px", borderRadius: 10, marginBottom: 4,
                background: active ? `${COLORS.teal}22` : "transparent",
                border: active ? `1px solid ${COLORS.teal}44` : "1px solid transparent",
                color: active ? COLORS.white : COLORS.gray,
                cursor: "pointer", fontSize: 14, fontWeight: active ? 700 : 500,
                transition: "all 0.18s", textAlign: "left",
              }}>
                <span style={{ fontSize: 17 }}>{tab.icon}</span>
                <span style={{ flex: 1 }}>{tab.label}</span>
                {tab.id === "mailbox" && unreadMail > 0 && (
                  <span style={{
                    background: COLORS.red, color: "#fff",
                    borderRadius: "50%", width: 18, height: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800,
                  }}>{unreadMail}</span>
                )}
                {active && <div style={{ width: 3, height: 3, borderRadius: "50%", background: COLORS.teal }} />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "12px 20px 20px", color: COLORS.gray, fontSize: 11, borderTop: "1px solid #ffffff0d" }}>
          <div>© 2026 MedConnect</div>
          <div style={{ color: COLORS.teal + "aa", marginTop: 2 }}>HIPAA Compliant Platform</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 220, minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 50,
          background: COLORS.navy + "ee",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #ffffff0d",
          padding: "0 28px",
          height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
            </div>
            <div style={{ color: COLORS.gray, fontSize: 12 }}>MedConnect Professional Platform</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ color: COLORS.gray, fontSize: 13 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </div>
            {isAdmin && <Badge color={COLORS.gold}>👑 ADMIN</Badge>}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
          {activeTab === "mailbox" && <MailboxTab />}
          {activeTab === "forum" && <ForumTab />}
          {activeTab === "marketplace" && <MarketplaceTab />}
          {activeTab === "ads" && <AdsTab isAdmin={isAdmin} />}
          {activeTab === "referrals" && <ReferralsTab />}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "webinars" && <WebinarsTab />}
        </div>
      </div>

      {/* Mobile bottom nav (shown via CSS media) */}
      <style>{`
        @media (max-width: 700px) {
          div[style*="margin-left: 220px"] { margin-left: 0 !important; padding-bottom: 70px; }
          div[style*="position: fixed"][style*="width: 220px"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
