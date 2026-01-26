"use client";

import { useEffect } from "react";
import { initApp } from "@/lib/app";

export default function SettingsPage() {
  useEffect(() => {
    initApp("settings");
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
              <div className="brand-sub">专注对话，顺滑而安静。</div>
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
                <button className="ghost" id="goPrompt">
                  提示词
                </button>
                <button className="ghost" id="backToChat">
                  返回聊天
                </button>
              </div>
            </div>
            <div className="section-title">账户信息</div>
            <div className="user-card">
              <div className="user-name" id="userName">
                --
              </div>
              <div className="user-meta" id="userEmail">
                --
              </div>
            </div>

            <form id="userForm" className="stack">
              <label className="field">
                <span>昵称</span>
                <input id="userNicknameInput" type="text" placeholder="新的昵称" />
              </label>
              <label className="field">
                <span>邮箱</span>
                <input id="userEmailInput" type="email" placeholder="新的邮箱" />
              </label>
              <label className="field">
                <span>手机号</span>
                <input id="userPhoneInput" type="text" placeholder="新的手机号" />
              </label>
              <label className="field">
                <span>新密码</span>
                <input id="userPasswordInput" type="password" placeholder="留空不修改" />
              </label>
              <button className="primary" type="submit">
                保存设置
              </button>
            </form>
            <div className="hint" id="userStatus" />
          </section>
        </main>

        <footer className="footer">
          <span>账号设置 · 安全退出</span>
        </footer>
      </div>
    </>
  );
}
