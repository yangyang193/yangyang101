import { Events } from "./events.js";
import { store } from "./store.js";
import { getGuild, getIdentity, getPack, getTag } from "./seed.js";

function now() {
  return new Date().toISOString();
}

function pushLog(state, type, text) {
  return [{ t: now(), type, text }, ...state.log].slice(0, 80);
}

function fail(message) {
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, toast: { kind: "error", text: message } },
    log: pushLog(state, "error", message),
  }));
}

function ok(patcher, message) {
  store.setState((state) => {
    const next = patcher(state);
    return {
      ...next,
      ui: { ...next.ui, toast: { kind: "ok", text: message } },
      log: pushLog(next, "ok", message),
    };
  });
}

function uid() {
  return `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function computeBaseViews(profile) {
  const guild = getGuild(profile.guildId);
  const boost = guild ? 1 + guild.boost : 1;
  const exposureFactor = 1 + profile.exposure / 200;
  return Math.round(420 * boost * exposureFactor);
}

export function registerHandlers(bus) {
  bus.on(Events.VIEW_CHANGED, ({ view }) => {
    store.setState((state) => ({
      ...state,
      ui: { ...state.ui, view },
    }));
  });

  bus.on(Events.TOAST, ({ kind, text }) => {
    store.setState((state) => ({
      ...state,
      ui: { ...state.ui, toast: { kind, text } },
    }));
  });

  bus.on(Events.IDENTITY_SELECTED, ({ identityId }) => {
    const identity = getIdentity(identityId);
    if (!identity) return fail("未知身份，无法选择。");

    ok((state) => {
      const same = state.profile.identityId === identityId;
      const tagIds = same
        ? state.profile.tagIds
        : identity.recommendedTagIds.filter((id) =>
            state.profile.tagIds.includes(id)
          );
      return {
        ...state,
        profile: {
          ...state.profile,
          identityId,
          coins: same ? state.profile.coins : identity.startCoins,
          tagIds: same ? tagIds : identity.recommendedTagIds.slice(0, 2),
        },
      };
    }, `已选择身份：${identity.name}`);
  });

  bus.on(Events.PERSONA_UPDATED, (persona) => {
    const nickname = String(persona.nickname ?? "").trim();
    const bio = String(persona.bio ?? "").trim();
    if (!nickname) return fail("请填写昵称后再保存人设。");
    if (nickname.length > 16) return fail("昵称最多 16 个字。");
    if (bio.length > 80) return fail("简介最多 80 个字。");

    ok(
      (state) => ({
        ...state,
        profile: {
          ...state.profile,
          persona: {
            nickname,
            bio,
            style: persona.style || "casual",
            audience: persona.audience || "gen-z",
          },
        },
      }),
      `人设已更新：${nickname}`
    );
  });

  bus.on(Events.TAGS_CHANGED, ({ tagIds }) => {
    const unique = [...new Set(tagIds)];
    if (unique.length > 5) return fail("标签最多选择 5 个。");
    const names = unique.map((id) => getTag(id)?.name).filter(Boolean);
    ok(
      (state) => ({
        ...state,
        profile: { ...state.profile, tagIds: unique },
      }),
      unique.length ? `已选择标签：${names.join("、")}` : "已清空标签"
    );
  });

  bus.on(Events.WORK_PUBLISHED, ({ title, body, tagIds }) => {
    const state = store.getState();
    if (!state.profile.identityId) return fail("请先选择身份后再发布作品。");
    const cleanTitle = String(title ?? "").trim();
    const cleanBody = String(body ?? "").trim();
    const selected = [...new Set(tagIds ?? [])];
    if (!cleanTitle) return fail("作品标题不能为空。");
    if (cleanTitle.length > 40) return fail("标题最多 40 个字。");
    if (!cleanBody) return fail("请填写作品正文。");
    if (selected.length < 1 || selected.length > 5) {
      return fail("发布时请选择 1–5 个标签。");
    }

    const views = computeBaseViews(state.profile);
    ok((prev) => ({
      ...prev,
      works: [
        {
          id: uid(),
          title: cleanTitle,
          body: cleanBody,
          tagIds: selected,
          views,
          boosted: false,
          createdAt: now(),
        },
        ...prev.works,
      ],
    }), `作品已发布「${cleanTitle}」，初始播放 ${views}`);
  });

  bus.on(Events.GUILD_JOINED, ({ guildId }) => {
    const guild = getGuild(guildId);
    if (!guild) return fail("公会不存在。");
    const state = store.getState();
    if (!state.profile.identityId) return fail("请先选择身份再加入公会。");
    if (state.profile.guildId === guildId) return fail("你已经在该公会中。");
    if (state.profile.coins < guild.cost) {
      return fail(`金币不足，加入「${guild.name}」需要 ${guild.cost} 金币。`);
    }

    ok(
      (prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          guildId,
          coins: prev.profile.coins - guild.cost,
        },
      }),
      `已加入「${guild.name}」，流量加成 ${Math.round(guild.boost * 100)}%`
    );
  });

  bus.on(Events.TRAFFIC_PURCHASED, ({ packId }) => {
    const pack = getPack(packId);
    if (!pack) return fail("套餐不存在。");
    const state = store.getState();
    if (!state.profile.identityId) return fail("请先选择身份再购买流量。");
    if (state.profile.coins < pack.cost) {
      return fail(`金币不足，购买「${pack.name}」需要 ${pack.cost} 金币。`);
    }
    if (pack.views > 0 && state.works.length === 0) {
      return fail("还没有作品，无法加热最近一条内容。请先发布。");
    }

    ok((prev) => {
      const works = [...prev.works];
      if (pack.views > 0 && works[0]) {
        works[0] = {
          ...works[0],
          views: works[0].views + pack.views,
          boosted: true,
        };
      }
      return {
        ...prev,
        profile: {
          ...prev.profile,
          coins: prev.profile.coins - pack.cost,
          exposure: prev.profile.exposure + pack.exposure,
        },
        works,
      };
    }, `已购买「${pack.name}」`);
  });

  bus.on(Events.STATE_RESET, () => {
    store.reset();
    store.setState((state) => ({
      ...state,
      ui: { ...state.ui, toast: { kind: "ok", text: "已重置全部本地数据。" } },
      log: pushLog(state, "ok", "状态已重置"),
    }));
  });
}
