const IMAGE_BASE = 'assets/products/raw/';

const state = {
  pages: [],
  index: 0,
  data: null,
  touchStartX: 0,
};

const bookEl = document.getElementById('book');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const footerPhone = document.getElementById('footerPhone');

function buildPages(data) {
  const pages = [
    {
      type: 'cover',
      title: '封面',
    },
    {
      type: 'menu',
      title: '品类',
    },
  ];

  data.categories.forEach((cat) => {
    cat.items.forEach((item, itemIndex) => {
      pages.push({
        type: 'product',
        categoryId: cat.id,
        categoryName: cat.name,
        item,
        itemIndex,
        totalInCategory: cat.items.length,
      });
    });
  });

  return pages;
}

function createCoverPage() {
  const page = document.createElement('section');
  page.className = 'page page-cover';
  page.dataset.type = 'cover';
  page.innerHTML = `
    <img class="cover-photo" src="assets/cover.jpg" alt="贝焙面包封面" />
    <div class="cover-overlay">
      <p>轻触下方按钮 · 翻阅甜蜜菜单</p>
      <button class="btn-primary" id="enterMenuBtn" type="button">进入菜单</button>
    </div>
  `;
  return page;
}

function createMenuPage(data) {
  const page = document.createElement('section');
  page.className = 'page';
  page.dataset.type = 'menu';
  const cards = data.categories
    .map(
      (cat, idx) => `
      <button class="category-card" type="button" data-category="${cat.id}" data-index="${idx}">
        <div class="emoji">${cat.id === 'desserts' ? '🧁' : '🎂'}</div>
        <h2>${cat.name}</h2>
        <span>${cat.items.length} 款精选</span>
      </button>
    `,
    )
    .join('');

  page.innerHTML = `
    <header class="page-header">
      <h1>${data.shop.name}</h1>
      <p>${data.shop.slogan}</p>
    </header>
    <div class="category-grid">${cards}</div>
    <p class="footer-contact">联系电话：<a href="tel:${data.shop.phone}">${data.shop.phone}</a></p>
  `;
  return page;
}

function createProductPage(meta) {
  const page = document.createElement('section');
  page.className = 'page';
  page.dataset.type = 'product';
  page.dataset.category = meta.categoryId;
  page.innerHTML = `
    <div class="top-bar">
      <span class="badge">${meta.categoryName}</span>
      <button class="ghost-btn" type="button" data-action="back-menu">返回品类</button>
    </div>
    <div class="product-body">
      <div class="product-image-wrap">
        <img src="${IMAGE_BASE}${meta.item.image}" alt="${meta.item.name}" loading="lazy" />
      </div>
      <article class="product-meta">
        <h2>${meta.item.name}</h2>
        <p class="price">${meta.item.price}</p>
        <p class="tag">第 ${meta.itemIndex + 1} / ${meta.totalInCategory} 款</p>
      </article>
    </div>
  `;
  return page;
}

function renderBook(data) {
  state.pages = buildPages(data);
  bookEl.replaceChildren();

  state.pages.forEach((meta) => {
    let el;
    if (meta.type === 'cover') el = createCoverPage();
    else if (meta.type === 'menu') el = createMenuPage(data);
    else el = createProductPage(meta);
    bookEl.appendChild(el);
  });

  footerPhone.textContent = data.shop.phone;
  bindEvents();
  showPage(0, 'init', true);
}

function showPage(nextIndex, direction = 'next', force = false) {
  const prevIndex = state.index;
  if (!force && nextIndex === prevIndex) return;
  if (nextIndex < 0 || nextIndex >= state.pages.length) return;

  const nodes = [...bookEl.querySelectorAll('.page')];
  nodes[prevIndex]?.classList.remove('is-active', 'is-leaving-next', 'is-leaving-prev');
  nodes[nextIndex]?.classList.remove('is-leaving-next', 'is-leaving-prev');

  if (direction === 'next') nodes[prevIndex]?.classList.add('is-leaving-next');
  else if (direction === 'prev') nodes[prevIndex]?.classList.add('is-leaving-prev');

  nodes[nextIndex]?.classList.add('is-active');
  nodes.forEach((node, i) => {
    node.setAttribute('aria-hidden', i === nextIndex ? 'false' : 'true');
  });
  state.index = nextIndex;
  updateControls();
}

function findFirstProductIndex(categoryId) {
  return state.pages.findIndex(
    (p) => p.type === 'product' && p.categoryId === categoryId,
  );
}

function updateControls() {
  const page = state.pages[state.index];
  const productOnlyIndex = state.pages
    .slice(0, state.index + 1)
  .filter((p) => p.type === 'product').length;

  prevBtn.disabled = state.index <= 0;
  nextBtn.disabled = state.index >= state.pages.length - 1;

  if (page.type === 'cover') {
    pageIndicator.textContent = '封面';
  } else if (page.type === 'menu') {
    pageIndicator.textContent = '品类选择';
  } else {
    const productCount = state.pages.filter((p) => p.type === 'product').length;
    pageIndicator.textContent = `${productOnlyIndex} / ${productCount}`;
  }

}

function bindEvents() {
  bookEl.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.id === 'enterMenuBtn' || target.closest('#enterMenuBtn')) {
      showPage(1, 'next');
      return;
    }

    const categoryCard = target.closest('[data-category]');
    if (categoryCard instanceof HTMLElement) {
      const categoryId = categoryCard.dataset.category;
      const idx = findFirstProductIndex(categoryId);
      if (idx >= 0) showPage(idx, 'next');
      return;
    }

    const actionEl = target.closest('[data-action]');
    if (actionEl instanceof HTMLElement) {
      const action = actionEl.dataset.action;
      if (action === 'prev') showPage(state.index - 1, 'prev');
      if (action === 'next') showPage(state.index + 1, 'next');
      if (action === 'back-menu') showPage(1, 'prev');
    }
  });

  prevBtn.addEventListener('click', () => showPage(state.index - 1, 'prev'));
  nextBtn.addEventListener('click', () => showPage(state.index + 1, 'next'));

  bookEl.addEventListener(
    'touchstart',
    (e) => {
      state.touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );

  bookEl.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - state.touchStartX;
      if (Math.abs(dx) < 55) return;
      if (dx < 0) showPage(state.index + 1, 'next');
      else showPage(state.index - 1, 'prev');
    },
    { passive: true },
  );
}

async function init() {
  const response = await fetch('data/products.json');
  const data = await response.json();
  state.data = data;
  renderBook(data);
}

init().catch((err) => {
  console.error(err);
  bookEl.innerHTML =
    '<p style="padding:24px;text-align:center">菜单加载失败，请刷新后重试。</p>';
});
