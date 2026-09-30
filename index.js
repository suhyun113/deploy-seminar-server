const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

const MAX_NAME = 20;
const MAX_MESSAGE = 50;
const POST_COOLDOWN_MS = 3000;

const nowKST = () =>
  new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().replace("Z", "+09:00");

let posts = [
  {
    id: 1,
    type: "message",
    name: "김수현",
    message: "배포 세미나 방명록이 열렸어요!",
    commit: null,
    createdAt: nowKST(),
  },
];
let nextId = 2;
const lastPostAt = new Map();

app.get("/health", (req, res) => {
  res.json({ status: "ok", posts: posts.length });
});

app.get("/api/posts", (req, res) => {
  res.json([...posts].reverse());
});

app.post("/api/posts", (req, res) => {
  const name = String(req.body.name ?? "").trim();
  const type = req.body.type === "deploy" ? "deploy" : "message";
  const commit = req.body.commit ? String(req.body.commit).slice(0, 12) : null;
  let message = String(req.body.message ?? "").trim();

  if (!name) return res.status(400).json({ error: "이름을 입력해 주세요." });
  if (name.length > MAX_NAME) return res.status(400).json({ error: `이름은 ${MAX_NAME}자까지 가능해요.` });

  if (type === "deploy") {
    const dup = posts.find((p) => p.type === "deploy" && p.name === name && p.commit === commit);
    if (dup) return res.status(200).json(dup);
    message = message || `${name}님이 배포에 성공했어요!`;
  } else {
    if (!message) return res.status(400).json({ error: "내용을 입력해 주세요." });
  }
  if (message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: `내용은 ${MAX_MESSAGE}자까지 가능해요.` });
  }

  const now = Date.now();
  if (now - (lastPostAt.get(req.ip) || 0) < POST_COOLDOWN_MS) {
    return res.status(429).json({ error: "잠시 후 다시 시도해 주세요." });
  }
  lastPostAt.set(req.ip, now);

  const post = { id: nextId++, type, name, message, commit, createdAt: nowKST() };
  posts.push(post);
  res.status(201).json(post);
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
