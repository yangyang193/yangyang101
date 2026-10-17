import { eventBus } from "./eventBus.js";
import { Events } from "./events.js";
import { registerHandlers } from "./handlers.js";
import { render } from "./render.js";
import { store } from "./store.js";

registerHandlers(eventBus);

let toastTimer = 0;

function bind(root) {
  root.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      eventBus.emit(Events.VIEW_CHANGED, { view: btn.dataset.view });
    });
  });

  root.querySelector("[data-reset]")?.addEventListener("click", () => {
    if (confirm("确定清空本地身份、作品与金币？")) {
      eventBus.emit(Events.STATE_RESET);
    }
  });

  root.querySelectorAll("[data-identity]").forEach((btn) => {
    btn.addEventListener("click", () => {
      eventBus.emit(Events.IDENTITY_SELECTED, { identityId: btn.dataset.identity });
    });
  });

  root.querySelector("#persona-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    eventBus.emit(Events.PERSONA_UPDATED, {
      nickname: data.get("nickname"),
      bio: data.get("bio"),
      style: data.get("style"),
      audience: data.get("audience"),
    });
  });

  root.querySelector("#tags-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    eventBus.emit(Events.TAGS_CHANGED, { tagIds: data.getAll("tag") });
  });

  root.querySelector("#publish-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    eventBus.emit(Events.WORK_PUBLISHED, {
      title: data.get("title"),
      body: data.get("body"),
      tagIds: data.getAll("tag"),
    });
    event.currentTarget.reset();
  });

  root.querySelectorAll("[data-guild]").forEach((btn) => {
    btn.addEventListener("click", () => {
      eventBus.emit(Events.GUILD_JOINED, { guildId: btn.dataset.guild });
    });
  });

  root.querySelectorAll("[data-pack]").forEach((btn) => {
    btn.addEventListener("click", () => {
      eventBus.emit(Events.TRAFFIC_PURCHASED, { packId: btn.dataset.pack });
    });
  });

  root.querySelectorAll(".tag input").forEach((input) => {
    input.addEventListener("change", () => {
      input.closest(".tag")?.classList.toggle("is-on", input.checked);
    });
  });
}

function draw(state) {
  render(state);
  bind(document.getElementById("app"));
  window.clearTimeout(toastTimer);
  if (state.ui.toast) {
    toastTimer = window.setTimeout(() => {
      store.setState((prev) => ({
        ...prev,
        ui: { ...prev.ui, toast: null },
      }));
    }, 2800);
  }
}

store.subscribe(draw);
draw(store.getState());
