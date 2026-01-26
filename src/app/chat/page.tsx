"use client";

import { useEffect } from "react";
import { initApp } from "@/lib/app";

export default function ChatPage() {
  useEffect(() => {
    initApp("chat");
  }, []);

  return (
    <>
      <div className="bg-gradient" />
      <div className="bg-grid" />
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <div className="page">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" />
            <div>
              <div className="brand-name">kisara71</div>
              <div className="brand-sub">kisara71@qq.com</div>
            </div>
          </div>
          <div className="top-actions">
            <button className="ghost" id="goSettings">
              设置
            </button>
            <button className="secondary" id="refreshModels">
              刷新模型
            </button>
          </div>
        </header>

        <main className="chat-shell">
          <aside className="side">
            <div className="side-content">
              <div className="section-title">对话</div>
              <button className="conversation-item" type="button" id="newConversation">
                + 新建对话
              </button>
              <div className="conversation-list" id="conversationList" />
              <div className="conversation-menu hidden" id="conversationMenu">
                <button type="button" className="ghost" id="conversationRename">
                  重命名
                </button>
                <button type="button" className="ghost danger" id="conversationDelete">
                  删除
                </button>
              </div>

              <div className="section-title">模型列表</div>
              <label className="field">
                <span>Model</span>
                <select id="modelSelect" />
              </label>
              <div className="hint">登录后自动刷新模型</div>
              <button className="ghost" type="button" id="clearChat">
                清空对话
              </button>
            </div>
          </aside>

          <section className="chat">
            <div className="chat-header">
              <div>
                <div className="chat-title" id="chatTitle">
                  新对话
                </div>
                <div className="chat-sub">流式回复已启用</div>
              </div>
              <div className="pill" id="userBadge">
                未登录
              </div>
            </div>

            <div id="messageList" className="messages">
              <div className="message assistant">
                <div className="bubble">
                  <div className="meta">Sydney · 09:10</div>
                  <div>你好，准备好开始对话。</div>
                </div>
              </div>
            </div>

            <form id="chatForm" className="composer">
              <input
                id="chatInput"
                type="text"
                placeholder="输入消息，按 Enter 发送"
                autoComplete="off"
              />
              <button type="submit" className="primary">
                发送
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
}
