"use client";

import { useEffect } from "react";
import { initApp } from "@/lib/app";

export default function HomePage() {
  useEffect(() => {
    initApp("login");
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
            <div className="theme-toggle" role="group" aria-label="主题">
              <button className="theme-button" type="button" id="themeBlue">
                蓝白
              </button>
              <button className="theme-button" type="button" id="themeNeon">
                霓虹
              </button>
            </div>
            <button className="ghost" id="toggleMode">
              登录/注册
            </button>
            <button className="secondary" id="goChat">
              进入聊天
            </button>
          </div>
        </header>

        <main id="loginView" className="layout view view-login">
          <section className="hero">
            <div className="eyebrow">Clean & focused</div>
            <h1>
              Web<span>Chat</span>
            </h1>
            <div className="hero-actions">
              <button className="primary" id="focusAuth">
                立即登录
              </button>
              <button className="secondary" id="goChatFromHero">
                去聊天页
              </button>
            </div>
            <div className="hero-metrics">
              <div>
                <div className="metric-value" id="statusText">
                  未登录
                </div>
                <div className="metric-label">会话</div>
              </div>
              <div>
                <div className="metric-value" id="latencyText">
                  --
                </div>
                <div className="metric-label">最近延迟</div>
              </div>
              <div>
                <div className="metric-value" id="modelCount">
                  --
                </div>
                <div className="metric-label">模型</div>
              </div>
            </div>
          </section>

          <section className="auth-card">
            <div className="section-title" id="modeTitle">
              登录
            </div>
            <div className="mode-toggle" id="loginModeToggle">
              <button className="ghost active" type="button" id="loginPasswordMode">
                密码
              </button>
              <button className="ghost" type="button" id="loginCodeMode">
                邮箱验证码
              </button>
            </div>
            <form id="authForm" className="stack">
              <div id="passwordLoginFields" className="stack">
                <label className="field">
                  <span>账号</span>
                  <input id="accountInput" type="text" placeholder="手机号或邮箱" />
                  <span className="note">邮箱需已绑定手机号</span>
                </label>
                <label className="field">
                  <span>密码</span>
                  <input id="passwordInput" type="password" placeholder="至少 6 位" />
                </label>
              </div>

              <div id="codeLoginFields" className="stack hidden">
                <label className="field">
                  <span>邮箱</span>
                  <input id="emailLoginInput" type="email" placeholder="绑定手机号的邮箱" />
                </label>
                <label className="field">
                  <span>验证码</span>
                  <div className="inline-field">
                    <input id="codeLoginInput" type="text" placeholder="6 位验证码" />
                    <button className="secondary" type="button" id="sendLoginCode">
                      发送验证码
                    </button>
                  </div>
                  <span className="countdown" id="loginCodeCountdown" />
                </label>
              </div>

              <div id="registerFields" className="stack hidden">
                <label className="field">
                  <span>昵称</span>
                  <input id="nicknameInput" type="text" placeholder="可显示名称" />
                </label>
                <label className="field">
                  <span>邮箱</span>
                  <input id="emailInput" type="email" placeholder="必填邮箱" />
                </label>
                <label className="field">
                  <span>邮箱验证码</span>
                  <div className="inline-field">
                    <input id="emailCodeInput" type="text" placeholder="6 位验证码" />
                    <button className="secondary" type="button" id="sendRegisterCode">
                      发送验证码
                    </button>
                  </div>
                  <span className="countdown" id="registerCodeCountdown" />
                </label>
                <label className="field">
                  <span>密码</span>
                  <input id="registerPasswordInput" type="password" placeholder="至少 6 位" />
                </label>
                <label className="field">
                  <span>手机号</span>
                  <input id="phoneInput" type="text" placeholder="可选，用于绑定" />
                </label>
              </div>

              <button className="primary" type="submit" id="authSubmit">
                登录
              </button>
            </form>
            <div className="hint">验证码登录已启用。</div>
            <div className="notice" id="notice" aria-live="polite" />
          </section>
        </main>

        <footer className="footer">
          <span>Warm minimal · soft motion · SSE streaming</span>
        </footer>
      </div>
    </>
  );
}
