const elements = {
  apiBase: document.getElementById("apiBase"),
  authForm: document.getElementById("authForm"),
  accountInput: document.getElementById("accountInput"),
  passwordInput: document.getElementById("passwordInput"),
  emailLoginInput: document.getElementById("emailLoginInput"),
  codeLoginInput: document.getElementById("codeLoginInput"),
  nicknameInput: document.getElementById("nicknameInput"),
  phoneInput: document.getElementById("phoneInput"),
  emailInput: document.getElementById("emailInput"),
  emailCodeInput: document.getElementById("emailCodeInput"),
  registerPasswordInput: document.getElementById("registerPasswordInput"),
  registerFields: document.getElementById("registerFields"),
  passwordLoginFields: document.getElementById("passwordLoginFields"),
  codeLoginFields: document.getElementById("codeLoginFields"),
  modeTitle: document.getElementById("modeTitle"),
  authSubmit: document.getElementById("authSubmit"),
  toggleMode: document.getElementById("toggleMode"),
  loginModeToggle: document.getElementById("loginModeToggle"),
  loginPasswordMode: document.getElementById("loginPasswordMode"),
  loginCodeMode: document.getElementById("loginCodeMode"),
  sendLoginCode: document.getElementById("sendLoginCode"),
  sendRegisterCode: document.getElementById("sendRegisterCode"),
  loginCodeCountdown: document.getElementById("loginCodeCountdown"),
  registerCodeCountdown: document.getElementById("registerCodeCountdown"),
  logoutBtn: document.getElementById("logoutBtn"),
  modelSelect: document.getElementById("modelSelect"),
  statusText: document.getElementById("statusText"),
  latencyText: document.getElementById("latencyText"),
  modelCount: document.getElementById("modelCount"),
  messageList: document.getElementById("messageList"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
  userBadge: document.getElementById("userBadge"),
  refreshModels: document.getElementById("refreshModels"),
  clearChat: document.getElementById("clearChat"),
  focusAuth: document.getElementById("focusAuth"),
  goChat: document.getElementById("goChat"),
  goChatFromHero: document.getElementById("goChatFromHero"),
  notice: document.getElementById("notice"),
  backToLogin: document.getElementById("backToLogin"),
  themeBlue: document.getElementById("themeBlue"),
  themeNeon: document.getElementById("themeNeon"),
  goSettings: document.getElementById("goSettings"),
  backToChat: document.getElementById("backToChat"),
  userName: document.getElementById("userName"),
  userEmail: document.getElementById("userEmail"),
  userForm: document.getElementById("userForm"),
  userNicknameInput: document.getElementById("userNicknameInput"),
  userEmailInput: document.getElementById("userEmailInput"),
  userPhoneInput: document.getElementById("userPhoneInput"),
  userPasswordInput: document.getElementById("userPasswordInput"),
  userStatus: document.getElementById("userStatus"),
};

const state = {
  apiBase: localStorage.getItem("apiBase") || "http://localhost:8080",
  token: localStorage.getItem("token") || "",
  userId: Number(localStorage.getItem("userId") || 0),
  user: null,
  isRegister: false,
  loginMode: "password",
  models: [],
  messages: [],
  streaming: false,
};

const pageType = document.body?.dataset?.page || "login";
const isChatPage = pageType === "chat";
const isSettingsPage = pageType === "settings";

const setAuthNotice = (message) => {
  if (!message) return;
  sessionStorage.setItem("authNotice", message);
};

const consumeAuthNotice = () => {
  const message = sessionStorage.getItem("authNotice");
  if (message) {
    sessionStorage.removeItem("authNotice");
  }
  return message;
};

const decodeBase64Url = (input) => {
  const base = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base + "===".slice((base.length + 3) % 4);
  return atob(padded);
};

const parseJwt = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = decodeBase64Url(parts[1]);
    return JSON.parse(payload);
  } catch (err) {
    return null;
  }
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderMarkdown = (value) => {
  const codeBlocks = [];
  let text = value.replace(/```([\w-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const escapedCode = escapeHtml(code);
    const language = lang ? ` data-lang="${escapeHtml(lang)}"` : "";
    codeBlocks.push(`<pre><code${language}>${escapedCode}</code></pre>`);
    return `@@CODE${codeBlocks.length - 1}@@`;
  });

  text = escapeHtml(text);
  text = text.replace(/@@CODE(\d+)@@/g, (match, index) => codeBlocks[Number(index)] || "");

  const inline = (input) =>
    input
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  const lines = text.split(/\n/);
  let html = "";
  let listType = "";

  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = "";
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      html += '<div class="md-spacer"></div>';
      return;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html += `<h${level}>${inline(heading[2])}</h${level}>`;
      return;
    }

    if (/^>\s+/.test(trimmed)) {
      closeList();
      html += `<blockquote>${inline(trimmed.replace(/^>\s+/, ""))}</blockquote>`;
      return;
    }

    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const nextListType = /^\d+\.\s+/.test(trimmed) ? "ol" : "ul";
      if (listType !== nextListType) {
        closeList();
        listType = nextListType;
        html += `<${listType}>`;
      }
      html += `<li>${inline(trimmed.replace(/^([-*]|\d+\.)\s+/, ""))}</li>`;
      return;
    }

    closeList();
    html += `<p>${inline(trimmed)}</p>`;
  });

  closeList();
  return html;
};

const setMessageContent = (bodyEl, content, useMarkdown) => {
  if (!bodyEl) return;
  if (useMarkdown) {
    bodyEl.innerHTML = renderMarkdown(content);
    bodyEl.classList.add("message-content");
  } else {
    bodyEl.textContent = content;
    bodyEl.classList.remove("message-content");
  }
};

const applyTheme = (theme) => {
  const next = theme === "neon" ? "neon" : "blue";
  document.body.dataset.theme = next;
  localStorage.setItem("theme", next);
  if (elements.themeBlue) {
    elements.themeBlue.classList.toggle("active", next === "blue");
  }
  if (elements.themeNeon) {
    elements.themeNeon.classList.toggle("active", next === "neon");
  }
};

const setStatus = (text) => {
  if (elements.statusText) {
    elements.statusText.textContent = text;
  }
};

const setLatency = (value) => {
  if (elements.latencyText) {
    elements.latencyText.textContent = value;
  }
};

const setModelCount = (value) => {
  if (elements.modelCount) {
    elements.modelCount.textContent = value;
  }
};

const setUserBadge = () => {
  if (!elements.userBadge) return;
  if (!state.token) {
    elements.userBadge.textContent = "未登录";
    return;
  }
  const label = state.user?.nick_name || state.user?.email || "已登录";
  elements.userBadge.textContent = label;
};

const setUserCard = () => {
  if (!elements.userName || !elements.userEmail) return;
  if (!state.user) {
    elements.userName.textContent = "--";
    elements.userEmail.textContent = "--";
    return;
  }
  elements.userName.textContent = state.user.nick_name || "未命名用户";
  elements.userEmail.textContent = state.user.email || "--";
  if (elements.userNicknameInput) {
    elements.userNicknameInput.value = state.user.nick_name || "";
  }
  if (elements.userEmailInput) {
    elements.userEmailInput.value = state.user.email || "";
  }
  if (elements.userPhoneInput) {
    elements.userPhoneInput.value = state.user.phone || "";
  }
};

const nowLabel = () => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date
    .getMinutes())
    .padStart(2, "0")}`;
};

const setLoginMode = (mode) => {
  if (!elements.loginPasswordMode || !elements.loginCodeMode) return;
  state.loginMode = mode;
  elements.loginPasswordMode.classList.toggle("active", mode === "password");
  elements.loginCodeMode.classList.toggle("active", mode === "code");
  elements.passwordLoginFields.classList.toggle(
    "hidden",
    state.isRegister || mode !== "password"
  );
  elements.codeLoginFields.classList.toggle(
    "hidden",
    state.isRegister || mode !== "code"
  );
  elements.authSubmit.textContent = state.isRegister ? "注册" : "登录";
};

const goToChat = () => {
  if (isChatPage) return;
  window.location.href = "/chat.html";
};

const goToSettings = () => {
  if (isSettingsPage) return;
  window.location.href = "/settings.html";
};

const goToLogin = () => {
  if (!isChatPage && !isSettingsPage) return;
  window.location.href = "/";
};

const addMessage = ({ role, content, streaming = false, typing = false }) => {
  if (!elements.messageList) {
    return { body: null, bubble: null };
  }
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role === "user" ? "user" : "assistant"}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.dataset.streaming = streaming ? "1" : "0";
  bubble.dataset.typing = typing ? "1" : "0";

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `${role === "user" ? "你" : "Sydney"} · ${nowLabel()}`;

  const body = document.createElement("div");
  setMessageContent(body, content, role !== "user");

  bubble.append(meta, body);
  wrapper.append(bubble);
  elements.messageList.append(wrapper);
  elements.messageList.scrollTop = elements.messageList.scrollHeight;

  return { body, bubble };
};

const notify = ({ role = "assistant", content }) => {
  if (elements.messageList) {
    addMessage({ role, content });
    return;
  }
  if (elements.notice) {
    elements.notice.textContent = content;
  }
};

const isMissingAccountError = (err) => {
  const message = String(err?.message || "").toLowerCase();
  return message.includes("record not found") || message.includes("not found");
};

const showRegisterMode = (message) => {
  if (!state.isRegister) {
    toggleMode();
  }
  if (elements.notice) {
    elements.notice.textContent = message;
  }
  alert(message);
};

const replaceStreamingContent = (bodyEl, bubbleEl, content) => {
  if (!bodyEl || !bubbleEl) return;
  setMessageContent(bodyEl, content, true);
  bubbleEl.dataset.typing = "0";
  if (elements.messageList) {
    elements.messageList.scrollTop = elements.messageList.scrollHeight;
  }
};

const stopStreaming = (bubbleEl) => {
  if (!bubbleEl) return;
  bubbleEl.dataset.streaming = "0";
  bubbleEl.dataset.typing = "0";
};

const clearMessages = () => {
  if (!elements.messageList) return;
  elements.messageList.innerHTML = "";
  state.messages = [];
};

const apiFetch = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const res = await fetch(`${state.apiBase}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    const error = new Error(text || `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  if (data.code !== 0) {
    const error = new Error(data.message || "请求失败");
    error.code = data.code;
    throw error;
  }

  return data.data;
};

const ensureUserId = () => {
  if (state.userId || !state.token) return;
  const payload = parseJwt(state.token);
  const userId = Number(payload?.user_id || 0);
  if (!userId) return;
  state.userId = userId;
  localStorage.setItem("userId", String(userId));
};

const clearAuthState = () => {
  state.token = "";
  state.userId = 0;
  state.user = null;
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  setStatus("未登录");
  setUserBadge();
  setUserCard();
  if (elements.modelSelect) {
    elements.modelSelect.innerHTML = "";
  }
  setModelCount("--");
};

const fetchUserInfo = async () => {
  if (!state.userId) return;
  const data = await apiFetch(`/api/user/info?user_id=${state.userId}`, { method: "GET" });
  state.user = data;
  setUserBadge();
  setUserCard();
};

const updateUser = async (payload) => {
  await apiFetch("/api/user/update", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

const setUserStatus = (text) => {
  if (!elements.userStatus) return;
  elements.userStatus.textContent = text;
};

const startCooldown = (button, seconds, labelEl) => {
  const original = button.dataset.label || button.textContent;
  button.dataset.label = original;
  button.disabled = true;
  let remaining = seconds;
  button.textContent = `${original}(${remaining}s)`;
  if (labelEl) {
    labelEl.textContent = `请等待 ${remaining}s`;
  }
  const timer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(timer);
      button.disabled = false;
      button.textContent = original;
      if (labelEl) {
        labelEl.textContent = "";
      }
      return;
    }
    button.textContent = `${original}(${remaining}s)`;
    if (labelEl) {
      labelEl.textContent = `请等待 ${remaining}s`;
    }
  }, 1000);
};

const syncModels = async () => {
  if (!state.token) return;
  try {
    const data = await apiFetch("/api/chat/models", { method: "GET" });
    state.models = data?.data || [];
    if (!elements.modelSelect) return;
    elements.modelSelect.innerHTML = "";
    state.models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.id;
      elements.modelSelect.append(option);
    });
    setModelCount(String(state.models.length || 0));
    if (state.models.length === 0) {
      const option = document.createElement("option");
      option.textContent = "暂无模型";
      elements.modelSelect.append(option);
    }
  } catch (err) {
    setModelCount("0");
    notify({ content: `模型获取失败：${err.message}` });
  }
};

const login = async ({ account, password }) => {
  const data = await apiFetch("/api/user/login", {
    method: "POST",
    body: JSON.stringify({ account, password }),
  });

  if (!data?.token) throw new Error("token missing");
  state.token = data.token;
  localStorage.setItem("token", state.token);
  ensureUserId();
  setStatus("已登录");
  setUserBadge();
  await syncModels();
};

const loginByCode = async ({ email, code }) => {
  const data = await apiFetch("/api/user/login/code", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });

  if (!data?.token) throw new Error("token missing");
  state.token = data.token;
  localStorage.setItem("token", state.token);
  ensureUserId();
  setStatus("已登录");
  setUserBadge();
  await syncModels();
};

const sendEmailCode = async (email) => {
  await apiFetch("/api/user/email/code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

const register = async ({ nickname, phone, email, emailCode, password }) => {
  await apiFetch("/api/user/register", {
    method: "POST",
    body: JSON.stringify({
      nick_name: nickname,
      phone: phone || undefined,
      email,
      email_code: emailCode,
      password,
    }),
  });
};

const logout = async () => {
  if (!state.token) return;
  await apiFetch("/api/user/logout", {
    method: "POST",
    body: JSON.stringify({ token: state.token }),
  });
  clearAuthState();
};

const sendStream = async (content) => {
  if (state.streaming) return;
  if (!state.token) {
    notify({ content: "请先登录。" });
    return;
  }

  const model = elements.modelSelect.value || "";
  if (!model) {
    notify({ content: "请先选择模型。" });
    return;
  }

  state.streaming = true;
  state.messages.push({ role: "user", content });

  const assistant = addMessage({ role: "assistant", content: "...", streaming: true, typing: true });
  const start = performance.now();

  try {
    const res = await fetch(`${state.apiBase}/api/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model,
        messages: state.messages,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        const payload = line.replace(/^data:\s*/, "");
        if (!payload) continue;

        let event;
        try {
          event = JSON.parse(payload);
        } catch (err) {
          continue;
        }

        if (event.type === "text.delta") {
          assistantText += event.delta || "";
          replaceStreamingContent(assistant.body, assistant.bubble, assistantText);
        }

        if (event.type === "error") {
          replaceStreamingContent(assistant.body, assistant.bubble, `错误：${event.delta || "unknown"}`);
        }

        if (event.type === "done") {
          break;
        }
      }
    }

    stopStreaming(assistant.bubble);
    state.messages.push({ role: "assistant", content: assistantText });
    const cost = Math.round(performance.now() - start);
    setLatency(`${cost} ms`);
  } catch (err) {
    replaceStreamingContent(assistant.body, assistant.bubble, `发送失败：${err.message}`);
    stopStreaming(assistant.bubble);
  } finally {
    state.streaming = false;
  }
};

const init = async () => {
  applyTheme(localStorage.getItem("theme") || "blue");
  if (elements.apiBase) {
    elements.apiBase.value = state.apiBase;
  }
  setUserBadge();
  setStatus(state.token ? "已登录" : "未登录");
  if (elements.loginModeToggle) {
    setLoginMode(state.loginMode);
  }
  if (!isChatPage && !isSettingsPage) {
    const message = consumeAuthNotice();
    if (message) {
      alert(message);
      notify({ content: message });
    }
  }

  if ((isChatPage || isSettingsPage) && !state.token) {
    setAuthNotice("请先登录再进入页面。");
    goToLogin();
    return;
  }
  ensureUserId();
  if ((isChatPage || isSettingsPage) && (!state.userId || !state.token)) {
    clearAuthState();
    setAuthNotice("请先登录再进入页面。");
    goToLogin();
    return;
  }
  if (state.token) {
    try {
      await fetchUserInfo();
    } catch (err) {
      const message = String(err.message || "");
      if (err.status === 401 || err.status === 403 || /unauthorized|invalid token|token revoked/i.test(message)) {
        clearAuthState();
        setAuthNotice("登录已失效，请重新登录。");
        goToLogin();
        return;
      }
      setUserStatus("用户信息获取失败");
    }
  }
  if (state.token && elements.modelSelect) {
    syncModels();
  }
};

const toggleMode = () => {
  state.isRegister = !state.isRegister;
  elements.modeTitle.textContent = state.isRegister ? "注册" : "登录";
  elements.authSubmit.textContent = state.isRegister ? "注册" : "登录";
  elements.registerFields.classList.toggle("hidden", !state.isRegister);
  elements.loginModeToggle.classList.toggle("hidden", state.isRegister);
  setLoginMode(state.loginMode);
};

if (elements.toggleMode) {
  elements.toggleMode.addEventListener("click", () => {
    toggleMode();
  });
}

if (elements.loginPasswordMode) {
  elements.loginPasswordMode.addEventListener("click", () => {
    setLoginMode("password");
  });
}

if (elements.loginCodeMode) {
  elements.loginCodeMode.addEventListener("click", () => {
    setLoginMode("code");
  });
}

if (elements.focusAuth) {
  elements.focusAuth.addEventListener("click", () => {
    elements.accountInput.focus();
  });
}

if (elements.refreshModels) {
  elements.refreshModels.addEventListener("click", () => {
    syncModels();
  });
}

if (elements.clearChat) {
  elements.clearChat.addEventListener("click", () => {
    clearMessages();
    notify({ content: "对话已清空，可以重新开始。" });
  });
}

if (elements.apiBase) {
  elements.apiBase.addEventListener("change", (event) => {
    state.apiBase = event.target.value.trim() || "http://localhost:8080";
    localStorage.setItem("apiBase", state.apiBase);
  });
}

if (elements.goChat) {
  elements.goChat.addEventListener("click", () => {
    if (!state.token) {
      alert("请先登录后进入聊天。");
      notify({ content: "请先登录后进入聊天。" });
      return;
    }
    goToChat();
  });
}

if (elements.goChatFromHero) {
  elements.goChatFromHero.addEventListener("click", () => {
    if (!state.token) {
      alert("请先登录后进入聊天。");
      notify({ content: "请先登录后进入聊天。" });
      return;
    }
    goToChat();
  });
}

if (elements.authForm) {
  elements.authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const account = elements.accountInput.value.trim();
    const password = state.isRegister
      ? elements.registerPasswordInput.value.trim()
      : elements.passwordInput.value.trim();

  try {
    if (state.isRegister) {
      const nickname = elements.nicknameInput.value.trim();
      const phone = elements.phoneInput.value.trim();
      const email = elements.emailInput.value.trim();
      const emailCode = elements.emailCodeInput.value.trim();

      if (!nickname || !email || !emailCode || !password) {
        notify({ content: "注册需要昵称、邮箱、邮箱验证码和密码。" });
        return;
      }

      await register({ nickname, phone, email, emailCode, password });
      notify({ content: "注册成功，请登录。" });
      toggleMode();
      return;
    }

    if (state.loginMode === "code") {
      const email = elements.emailLoginInput.value.trim();
      const code = elements.codeLoginInput.value.trim();
      if (!email || !code) {
        notify({ content: "请输入邮箱和验证码。" });
        return;
      }
      await loginByCode({ email, code });
    } else {
      if (!account || !password) {
        notify({ content: "请输入账号和密码。" });
        return;
      }
      await login({ account, password });
    }
    notify({ content: "登录成功，开始聊天吧。" });
    goToChat();
  } catch (err) {
    if (!state.isRegister && isMissingAccountError(err)) {
      showRegisterMode("账号不存在，请先注册。");
      return;
    }
    notify({ content: `登录失败：${err.message}` });
  }
  });
}

if (elements.sendLoginCode) {
  elements.sendLoginCode.addEventListener("click", async () => {
    const email = elements.emailLoginInput.value.trim();
    if (!email) {
      notify({ content: "请先输入邮箱。" });
      return;
    }
    try {
      await sendEmailCode(email);
      startCooldown(elements.sendLoginCode, 60, elements.loginCodeCountdown);
      notify({ content: "验证码已发送，请查收邮箱。" });
    } catch (err) {
      notify({ content: `发送失败：${err.message}` });
    }
  });
}

if (elements.sendRegisterCode) {
  elements.sendRegisterCode.addEventListener("click", async () => {
    const email = elements.emailInput.value.trim();
    if (!email) {
      notify({ content: "请先输入邮箱。" });
      return;
    }
    try {
      await sendEmailCode(email);
      startCooldown(elements.sendRegisterCode, 60, elements.registerCodeCountdown);
      notify({ content: "验证码已发送，请查收邮箱。" });
    } catch (err) {
      notify({ content: `发送失败：${err.message}` });
    }
  });
}

if (elements.logoutBtn) {
  elements.logoutBtn.addEventListener("click", async () => {
    try {
      await logout();
      notify({ content: "已退出登录。" });
      goToLogin();
    } catch (err) {
      notify({ content: `退出失败：${err.message}` });
    }
  });
}

if (elements.chatForm) {
  elements.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = elements.chatInput.value.trim();
    if (!value) return;
    addMessage({ role: "user", content: value });
    elements.chatInput.value = "";
    await sendStream(value);
  });
}

if (elements.backToLogin) {
  elements.backToLogin.addEventListener("click", () => {
    goToLogin();
  });
}

if (elements.goSettings) {
  elements.goSettings.addEventListener("click", () => {
    goToSettings();
  });
}

if (elements.backToChat) {
  elements.backToChat.addEventListener("click", () => {
    goToChat();
  });
}

if (elements.userForm) {
  elements.userForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nickName = elements.userNicknameInput.value.trim();
    const email = elements.userEmailInput.value.trim();
    const phone = elements.userPhoneInput.value.trim();
    const password = elements.userPasswordInput.value.trim();

    const payload = {};
    if (nickName) payload.nick_name = nickName;
    if (email) payload.email = email;
    if (phone) payload.phone = phone;
    if (password) payload.password = password;

    if (!Object.keys(payload).length) {
      setUserStatus("没有需要保存的修改");
      return;
    }

    try {
      await updateUser(payload);
      elements.userPasswordInput.value = "";
      setUserStatus("已保存");
      await fetchUserInfo();
    } catch (err) {
      setUserStatus(`保存失败：${err.message}`);
    }
  });
}

if (elements.themeBlue) {
  elements.themeBlue.addEventListener("click", () => {
    applyTheme("blue");
  });
}

if (elements.themeNeon) {
  elements.themeNeon.addEventListener("click", () => {
    applyTheme("neon");
  });
}

init();
