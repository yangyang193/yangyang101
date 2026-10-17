export const identities = [
  {
    id: "short-video",
    name: "短视频创作者",
    summary: "竖屏节奏、钩子与完播率",
    startCoins: 800,
    recommendedTagIds: ["hook", "trend", "edit"],
  },
  {
    id: "live",
    name: "直播主播",
    summary: "实时互动、礼物与场控节奏",
    startCoins: 900,
    recommendedTagIds: ["chat", "gift", "night"],
  },
  {
    id: "article",
    name: "图文博主",
    summary: "长文结构、封面与专栏沉淀",
    startCoins: 700,
    recommendedTagIds: ["essay", "cover", "column"],
  },
  {
    id: "musician",
    name: "音乐人",
    summary: "原声、翻唱与听觉人设",
    startCoins: 750,
    recommendedTagIds: ["original", "cover-song", "lofi"],
  },
];

export const tags = [
  { id: "hook", name: "前三秒钩子", identityId: "short-video" },
  { id: "trend", name: "热点二创", identityId: "short-video" },
  { id: "edit", name: "卡点剪辑", identityId: "short-video" },
  { id: "vlog", name: "日常 Vlog", identityId: "short-video" },
  { id: "chat", name: "弹幕互动", identityId: "live" },
  { id: "gift", name: "礼物玩法", identityId: "live" },
  { id: "night", name: "深夜场", identityId: "live" },
  { id: "game", name: "游戏陪玩", identityId: "live" },
  { id: "essay", name: "长文专栏", identityId: "article" },
  { id: "cover", name: "封面设计", identityId: "article" },
  { id: "column", name: "知识科普", identityId: "article" },
  { id: "review", name: "测评种草", identityId: "article" },
  { id: "original", name: "原创单曲", identityId: "musician" },
  { id: "cover-song", name: "翻唱", identityId: "musician" },
  { id: "lofi", name: "Lo-fi", identityId: "musician" },
  { id: "live-set", name: "现场 Live", identityId: "musician" },
];

export const guilds = [
  {
    id: "nova",
    name: "新星工坊",
    cost: 120,
    boost: 0.15,
    desc: "适合起步账号，提供基础投放与选题陪跑。",
  },
  {
    id: "pulse",
    name: "脉冲传媒",
    cost: 220,
    boost: 0.28,
    desc: "强运营公会，买量折扣与周更节奏更稳。",
  },
  {
    id: "orbit",
    name: "轨道厂牌",
    cost: 360,
    boost: 0.42,
    desc: "头部厂牌位，流量池更大，入会门槛更高。",
  },
];

export const trafficPacks = [
  {
    id: "spark",
    name: "火花曝光",
    cost: 80,
    exposure: 40,
    views: 0,
    desc: "提升账号曝光值，后续发布的基础播放更高。",
  },
  {
    id: "boost",
    name: "最近作品加热",
    cost: 140,
    exposure: 0,
    views: 1800,
    desc: "给最新一条作品追加播放量。",
  },
  {
    id: "storm",
    name: "风暴套餐",
    cost: 260,
    exposure: 90,
    views: 3200,
    desc: "同时加热账号曝光与最近作品。",
  },
];

export const styles = [
  { id: "casual", name: "轻松" },
  { id: "pro", name: "专业" },
  { id: "funny", name: "搞笑" },
];

export const audiences = [
  { id: "gen-z", name: "Z 世代" },
  { id: "office", name: "上班族" },
  { id: "hobby", name: "兴趣圈层" },
  { id: "family", name: "家庭向" },
];

export function getIdentity(id) {
  return identities.find((item) => item.id === id) ?? null;
}

export function getGuild(id) {
  return guilds.find((item) => item.id === id) ?? null;
}

export function getTag(id) {
  return tags.find((item) => item.id === id) ?? null;
}

export function getPack(id) {
  return trafficPacks.find((item) => item.id === id) ?? null;
}

export function tagsForIdentity(identityId) {
  if (!identityId) return tags;
  return tags.filter((tag) => tag.identityId === identityId);
}
