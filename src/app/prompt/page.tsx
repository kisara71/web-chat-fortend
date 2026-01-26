"use client";

import { useEffect } from "react";
import { initApp } from "@/lib/app";

export default function PromptPage() {
  useEffect(() => {
    initApp("prompt");
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
              <div className="brand-name">Web-Chat</div>
              <div className="brand-sub">为每次对话定调。</div>
            </div>
          </div>
          <div className="top-actions">
            <button className="primary" id="logoutBtn">
              退出登录
            </button>
          </div>
        </header>

        <main className="settings-shell">
          <section className="settings-panel">
            <div className="panel-actions">
              <div className="theme-toggle" role="group" aria-label="主题">
                <button className="theme-button" type="button" id="themeBlue">
                  蓝白
                </button>
                <button className="theme-button" type="button" id="themeNeon">
                  霓虹
                </button>
              </div>
              <div className="panel-nav">
                <button className="ghost" id="backToSettings">
                  返回设置
                </button>
                <button className="ghost" id="backToChat">
                  返回聊天
                </button>
              </div>
            </div>
            <div className="section-title">提示词配置</div>
            <form id="profileForm" className="stack">
              <label className="field">
                <span>系统提示词</span>
                <textarea
                  id="systemPromptInput"
                  rows={5}
                  placeholder="用于设置助手的系统提示词，例如：保持简洁、用中文回答、优先给出结论。"
                />
              </label>
              <label className="field">
                <span>模型性格偏好</span>
                <input
                  id="modelPreferenceInput"
                  type="text"
                  placeholder="例如：更冷静、更简洁、更像资深顾问"
                />
              </label>
              <label className="field">
                <span>人设/特征</span>
                <textarea
                  id="traitsInput"
                  rows={3}
                  placeholder="例如：更关注结构化输出、喜欢列表、避免冗长描述"
                />
              </label>
              <div className="note">留空不会覆盖已有内容，保存后会在新对话里生效。</div>
              <button className="primary" type="submit">
                保存提示词
              </button>
            </form>
            <div className="hint" id="profileStatus" />
          </section>
        </main>

        <footer className="footer">
          <span>提示词设置 · 影响后续新对话</span>
        </footer>
      </div>
    </>
  );
}
