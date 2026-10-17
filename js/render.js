import {
  audiences,
  getGuild,
  getIdentity,
  getTag,
  guilds,
  identities,
  styles,
  tagsForIdentity,
  trafficPacks,
} from "./seed.js";

const viewLabels = {
  home: "工作台总览",
  identity: "选择身份",
  persona: "设定人设",
  tags: "选标签",
  publish: "发作品",
  guild: "加公会",
  traffic: "买流量",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("zh-CN", { hour12: false });
}

function navItem(view, current) {
  return `<button class="nav-item ${view === current ? "is-active" : ""}" data-view="${view}" type="button">${viewLabels[view]}</button>`;
}

function lockedBanner(hasIdentity, extra) {
  if (hasIdentity) return extra ?? "";
  return `<p class="banner">请先在「选择身份」中确定身份，再使用此功能。</p>${extra ?? ""}`;
}

function renderHome(state) {
  const identity = getIdentity(state.profile.identityId);
  const guild = getGuild(state.profile.guildId);
  const persona = state.profile.persona;
  const tagNames = state.profile.tagIds
    .map((id) => getTag(id)?.name)
    .filter(Boolean);

  const works = state.works
    .map(
      (work) => `
      <article class="work-card">
        <div class="work-card__top">
          <h3>${escapeHtml(work.title)}</h3>
          <span class="pill">${work.views} 播放${work.boosted ? " · 已加热" : ""}</span>
        </div>
        <p>${escapeHtml(work.body)}</p>
        <div class="chip-row">
          ${work.tagIds.map((id) => `<span class="chip">${escapeHtml(getTag(id)?.name ?? id)}</span>`).join("")}
        </div>
        <time>${formatTime(work.createdAt)}</time>
      </article>`
    )
    .join("");

  return `
    <section class="panel">
      <h2>工作台总览</h2>
      <div class="stat-grid">
        <article class="stat"><span>身份</span><strong>${identity ? escapeHtml(identity.name) : "未选择"}</strong></article>
        <article class="stat"><span>金币</span><strong>${state.profile.coins}</strong></article>
        <article class="stat"><span>曝光</span><strong>${state.profile.exposure}</strong></article>
        <article class="stat"><span>作品</span><strong>${state.works.length}</strong></article>
      </div>
      <article class="card persona-card">
        <h3>${escapeHtml(persona.nickname || "尚未设定昵称")}</h3>
        <p>${escapeHtml(persona.bio || "还没有简介，去「设定人设」完善名片。")}</p>
        <div class="chip-row">
          <span class="chip">${escapeHtml(styles.find((s) => s.id === persona.style)?.name ?? persona.style)}</span>
          <span class="chip">${escapeHtml(audiences.find((a) => a.id === persona.audience)?.name ?? persona.audience)}</span>
          ${guild ? `<span class="chip">${escapeHtml(guild.name)} +${Math.round(guild.boost * 100)}%</span>` : ""}
          ${tagNames.map((name) => `<span class="chip">${escapeHtml(name)}</span>`).join("")}
        </div>
      </article>
      <h3 class="subhead">作品列表</h3>
      <div class="work-list">${works || `<p class="muted">还没有作品。去「发作品」发布第一条内容。</p>`}</div>
    </section>`;
}

function renderIdentity(state) {
  return `
    <section class="panel">
      <h2>选择身份</h2>
      <p class="lead">身份决定起始金币与推荐标签。切换身份会重置金币并套用推荐标签。</p>
      <div class="card-grid">
        ${identities
          .map((item) => {
            const active = state.profile.identityId === item.id;
            return `
              <article class="choice-card ${active ? "is-selected" : ""}">
                <div class="choice-card__mark"></div>
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.summary)}</p>
                <p class="meta">起始金币 ${item.startCoins}</p>
                <button type="button" data-identity="${item.id}">${active ? "当前身份" : "选择此身份"}</button>
              </article>`;
          })
          .join("")}
      </div>
    </section>`;
}

function renderPersona(state) {
  const p = state.profile.persona;
  return `
    <section class="panel">
      <h2>设定人设</h2>
      <form id="persona-form" class="form">
        <label>昵称
          <input name="nickname" maxlength="16" value="${escapeHtml(p.nickname)}" placeholder="例如：夜航剪辑室" />
        </label>
        <label>简介
          <textarea name="bio" maxlength="80" rows="4" placeholder="一句话说明你是谁、做什么内容">${escapeHtml(p.bio)}</textarea>
        </label>
        <label>风格
          <select name="style">
            ${styles.map((s) => `<option value="${s.id}" ${p.style === s.id ? "selected" : ""}>${s.name}</option>`).join("")}
          </select>
        </label>
        <label>目标受众
          <select name="audience">
            ${audiences.map((a) => `<option value="${a.id}" ${p.audience === a.id ? "selected" : ""}>${a.name}</option>`).join("")}
          </select>
        </label>
        <button type="submit">保存人设</button>
      </form>
    </section>`;
}

function renderTags(state) {
  const identityId = state.profile.identityId;
  const options = tagsForIdentity(identityId);
  return `
    <section class="panel">
      <h2>选标签</h2>
      ${lockedBanner(
        Boolean(identityId),
        `<p class="lead">最多选择 5 个标签，将用于发布作品。</p>
        <form id="tags-form" class="form">
          <div class="tag-grid">
            ${options
              .map((tag) => {
                const checked = state.profile.tagIds.includes(tag.id);
                return `<label class="tag ${checked ? "is-on" : ""}">
                  <input type="checkbox" name="tag" value="${tag.id}" ${checked ? "checked" : ""} />
                  ${escapeHtml(tag.name)}
                </label>`;
              })
              .join("")}
          </div>
          <button type="submit" ${identityId ? "" : "disabled"}>保存标签</button>
        </form>`
      )}
    </section>`;
}

function renderPublish(state) {
  const identityId = state.profile.identityId;
  const options = tagsForIdentity(identityId);
  const selected = new Set(state.profile.tagIds);
  return `
    <section class="panel">
      <h2>发作品</h2>
      ${lockedBanner(
        Boolean(identityId),
        `<form id="publish-form" class="form">
          <label>标题
            <input name="title" maxlength="40" placeholder="给作品起一个能点开的标题" />
          </label>
          <label>正文
            <textarea name="body" rows="6" placeholder="写一段内容简介或文案"></textarea>
          </label>
          <fieldset>
            <legend>标签（1–5 个）</legend>
            <div class="tag-grid">
              ${options
                .map((tag) => {
                  const checked = selected.has(tag.id);
                  return `<label class="tag ${checked ? "is-on" : ""}">
                    <input type="checkbox" name="tag" value="${tag.id}" ${checked ? "checked" : ""} />
                    ${escapeHtml(tag.name)}
                  </label>`;
                })
                .join("")}
            </div>
          </fieldset>
          <button type="submit" ${identityId ? "" : "disabled"}>发布</button>
        </form>`
      )}
    </section>`;
}

function renderGuild(state) {
  const identityId = state.profile.identityId;
  return `
    <section class="panel">
      <h2>加公会</h2>
      ${lockedBanner(
        Boolean(identityId),
        `<p class="lead">同时只能加入一个公会。入会消耗金币，之后发布作品会获得播放加成。</p>
        <div class="card-grid">
          ${guilds
            .map((guild) => {
              const active = state.profile.guildId === guild.id;
              return `
                <article class="choice-card ${active ? "is-selected" : ""}">
                  <div class="choice-card__mark"></div>
                  <h3>${escapeHtml(guild.name)}</h3>
                  <p>${escapeHtml(guild.desc)}</p>
                  <p class="meta">入会 ${guild.cost} 金币 · 加成 ${Math.round(guild.boost * 100)}%</p>
                  <button type="button" data-guild="${guild.id}" ${identityId && !active ? "" : "disabled"}>
                    ${active ? "已加入" : "加入公会"}
                  </button>
                </article>`;
            })
            .join("")}
        </div>`
      )}
    </section>`;
}

function renderTraffic(state) {
  const identityId = state.profile.identityId;
  return `
    <section class="panel">
      <h2>买流量</h2>
      ${lockedBanner(
        Boolean(identityId),
        `<p class="lead">金币不足会被拒绝。加热套餐作用于最近一条作品。</p>
        <div class="card-grid">
          ${trafficPacks
            .map(
              (pack) => `
              <article class="choice-card">
                <h3>${escapeHtml(pack.name)}</h3>
                <p>${escapeHtml(pack.desc)}</p>
                <p class="meta">${pack.cost} 金币${pack.exposure ? ` · 曝光 +${pack.exposure}` : ""}${pack.views ? ` · 播放 +${pack.views}` : ""}</p>
                <button type="button" data-pack="${pack.id}" ${identityId ? "" : "disabled"}>购买</button>
              </article>`
            )
            .join("")}
        </div>`
      )}
    </section>`;
}

const views = {
  home: renderHome,
  identity: renderIdentity,
  persona: renderPersona,
  tags: renderTags,
  publish: renderPublish,
  guild: renderGuild,
  traffic: renderTraffic,
};

export function render(state) {
  const identity = getIdentity(state.profile.identityId);
  const root = document.getElementById("app");
  const view = views[state.ui.view] ? state.ui.view : "home";

  root.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <span class="logo"></span>
        <div>
          <strong>创作者工作台</strong>
          <em>数据驱动 · 事件驱动</em>
        </div>
      </div>
      <div class="metrics">
        <span>身份 <b>${identity ? escapeHtml(identity.name) : "未选择"}</b></span>
        <span>金币 <b>${state.profile.coins}</b></span>
        <span>曝光 <b>${state.profile.exposure}</b></span>
      </div>
    </header>
    <div class="shell">
      <aside class="sidebar">
        ${navItem("home", view)}
        ${navItem("identity", view)}
        ${navItem("persona", view)}
        ${navItem("tags", view)}
        ${navItem("publish", view)}
        ${navItem("guild", view)}
        ${navItem("traffic", view)}
        <button class="nav-item nav-item--ghost" type="button" data-reset>重置数据</button>
      </aside>
      <main class="main">${views[view](state)}</main>
      <aside class="log">
        <h2>事件日志</h2>
        <p class="muted">每次操作都会发出事件，处理器改状态后再刷新界面。</p>
        <ol>
          ${
            state.log.length
              ? state.log
                  .map(
                    (item) => `<li class="${item.type}">
                      <span>${escapeHtml(item.text)}</span>
                      <time>${formatTime(item.t)}</time>
                    </li>`
                  )
                  .join("")
              : `<li class="muted">暂无事件。从「选择身份」开始。</li>`
          }
        </ol>
      </aside>
    </div>
    ${
      state.ui.toast
        ? `<div class="toast toast--${state.ui.toast.kind}" role="status">${escapeHtml(state.ui.toast.text)}</div>`
        : ""
    }
  `;
}
