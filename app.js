const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const list = document.getElementById("messageList");

const replies = [
  "收到，我补充到方案里。",
  "好主意，我们明天一起看。",
  "我可以把数据拆成两个视角。",
  "我来准备一版节奏图。",
];

const pad = (value) => String(value).padStart(2, "0");
const nowLabel = () => {
  const date = new Date();
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const addMessage = (text, isYou) => {
  const wrapper = document.createElement("div");
  wrapper.className = `message${isYou ? " you" : ""}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `${isYou ? "你" : "Pulse"} · ${nowLabel()}`;

  const body = document.createElement("div");
  body.textContent = text;

  bubble.append(meta, body);
  wrapper.append(bubble);
  list.append(wrapper);
  list.scrollTop = list.scrollHeight;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addMessage(value, true);
  input.value = "";

  setTimeout(() => {
    const reply = replies[Math.floor(Math.random() * replies.length)];
    addMessage(reply, false);
  }, 600);
});
