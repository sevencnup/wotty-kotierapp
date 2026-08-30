import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root was not found')
}

app.innerHTML = `
  <header class="site-header" id="top">
    <div class="shell nav-shell">
      <a class="brand" href="#top" aria-label="Kotier 首页">
        <span class="brand-mark" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </span>
        <span>Kotier<span class="brand-sub">内网穿透</span></span>
      </a>
      <button class="menu-toggle" type="button" aria-label="打开导航" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="main-nav" aria-label="主导航">
        <a class="nav-link is-active" href="#home">首页</a>
        <a class="nav-link" href="#features">产品特性</a>
        <a class="nav-link" href="#scenarios">使用场景</a>
        <a class="nav-link" href="#docs">文档中心</a>
        <a class="nav-link" href="#pricing">价格</a>
        <a class="nav-link" href="#help">帮助中心</a>
      </nav>
      <div class="nav-actions">
        <button class="button button-ghost button-small" data-feedback="登录入口即将开放">登录</button>
        <button class="button button-light button-small" data-feedback="注册入口即将开放">注册</button>
      </div>
    </div>
  </header>

  <main>
    <section class="hero" id="home">
      <div class="hero-glow hero-glow-one" aria-hidden="true"></div>
      <div class="hero-glow hero-glow-two" aria-hidden="true"></div>
      <div class="shell hero-grid">
        <div class="hero-copy">
          <p class="eyebrow eyebrow-light">KOTIER / OPENSTAR</p>
          <h1>Kotier <strong>内网穿透</strong></h1>
          <p class="hero-lead">让内网服务安全、高效地被外网访问</p>
          <ul class="hero-points">
            <li><span class="check-icon">✓</span>无需公网 IP，轻松穿透内网</li>
            <li><span class="check-icon">✓</span>高效稳定，低延迟连接</li>
            <li><span class="check-icon">✓</span>多平台支持，简单易用</li>
          </ul>
          <div class="hero-actions">
            <button class="button button-light button-download" data-download>立即下载 <span aria-hidden="true">↓</span></button>
            <a class="button button-outline" href="#docs">查看文档 <span aria-hidden="true">↗</span></a>
          </div>
          <div class="hero-meta"><span>v4.2.45</span><b></b><span>稳定版已发布</span></div>
        </div>
        <div class="hero-visual" aria-label="Kotier 产品界面预览">
          <div class="visual-orbit orbit-one" aria-hidden="true"></div>
          <div class="visual-orbit orbit-two" aria-hidden="true"></div>
          <div class="visual-label label-latency"><span class="pulse-dot"></span>实时连接</div>
          <div class="visual-label label-security"><span class="shield-mini">✓</span>数据加密传输</div>
          <img src="/assets/web.png" alt="Kotier 网络管理界面" />
        </div>
      </div>
      <a class="scroll-cue" href="#features" aria-label="查看产品特性"><span></span></a>
    </section>

    <section class="feature-strip" id="features">
      <div class="shell feature-grid">
        <article class="feature-item">
          <div class="feature-icon icon-shield">✓</div>
          <div><h2>安全可靠</h2><p>多重加密传输，保障数据安全，让访问更安心。</p></div>
        </article>
        <article class="feature-item">
          <div class="feature-icon icon-bolt">↯</div>
          <div><h2>高速稳定</h2><p>全球优质节点加速，智能路由，保证低延迟访问。</p></div>
        </article>
        <article class="feature-item">
          <div class="feature-icon icon-grid">四</div>
          <div><h2>多平台支持</h2><p>支持 Windows、macOS、Linux、Android 等多平台。</p></div>
        </article>
        <article class="feature-item">
          <div class="feature-icon icon-cloud">↑</div>
          <div><h2>简单易用</h2><p>可视化界面，一键配置，新手也能快速上手。</p></div>
        </article>
      </div>
    </section>

    <section class="section principle-section" id="scenarios">
      <div class="shell">
        <div class="section-heading">
          <p class="eyebrow">HOW IT WORKS</p>
          <h2>工作原理</h2>
          <p>通过中转节点建立安全隧道，实现内网服务的外网访问</p>
        </div>
        <div class="flow-diagram">
          <article class="flow-card">
            <span class="flow-kicker">INTRANET</span>
            <div class="flow-visual device-visual"><span>▣</span><span>▤</span><span>▥</span></div>
            <h3>内网设备</h3><p>10.0.0.0/8</p>
          </article>
          <div class="flow-link"><span class="lock">⌑</span><i></i><b>›</b></div>
          <article class="flow-card flow-card-client">
            <span class="flow-kicker">CLIENT</span>
            <div class="flow-visual client-visual"><span class="brand-mark small"><i></i><i></i><i></i><i></i><i></i><i></i></span></div>
            <h3>Kotier 客户端</h3><p>身份认证 · 加密连接</p>
          </article>
          <div class="flow-link"><span class="lock">⌑</span><i></i><b>›</b></div>
          <article class="flow-card flow-card-node">
            <span class="flow-kicker">RELAY NODE</span>
            <div class="flow-visual node-visual"><span class="node-cloud">☁</span><span class="node-stack">▤</span></div>
            <h3>中转节点</h3><p>智能路由 · 稳定加速</p>
          </article>
          <div class="flow-link"><span class="lock">⌑</span><i></i><b>›</b></div>
          <article class="flow-card">
            <span class="flow-kicker">INTERNET</span>
            <div class="flow-visual web-visual"><span>◎</span></div>
            <h3>外网访问</h3><p>example.com</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section platform-section" id="docs">
      <div class="shell">
        <div class="section-heading section-heading-left">
          <p class="eyebrow">ONE APP, EVERYWHERE</p>
          <h2>多平台支持，随时随地使用</h2>
          <p>支持主流操作系统，满足不同设备需求</p>
        </div>
        <div class="platform-grid">
          <article class="platform-card">
            <div class="platform-logo windows-logo">⊞</div><div><h3>Windows</h3><p>Windows 7 及以上</p><a href="#pricing" data-feedback="Windows 客户端下载即将开放">下载客户端 <span>→</span></a></div>
          </article>
          <article class="platform-card">
            <div class="platform-logo apple-logo">●</div><div><h3>macOS</h3><p>macOS 10.12 及以上</p><a href="#pricing" data-feedback="macOS 客户端下载即将开放">下载客户端 <span>→</span></a></div>
          </article>
          <article class="platform-card">
            <div class="platform-logo linux-logo">▲</div><div><h3>Linux</h3><p>主流发行版支持</p><a href="#pricing" data-feedback="Linux 客户端下载即将开放">下载客户端 <span>→</span></a></div>
          </article>
          <article class="platform-card">
            <div class="platform-logo android-logo">♟</div><div><h3>Android</h3><p>Android 5.0 及以上</p><a href="#pricing" data-feedback="Android 客户端下载即将开放">下载客户端 <span>→</span></a></div>
          </article>
        </div>
      </div>
    </section>

    <section class="section cta-section" id="pricing">
      <div class="shell cta-panel">
        <div><p class="eyebrow">READY WHEN YOU ARE</p><h2>立即体验 Kotier 内网穿透</h2><p>注册账号，下载客户端，快速开启内网穿透之旅</p></div>
        <div class="cta-actions"><button class="button button-primary" data-feedback="注册入口即将开放">立即注册</button><button class="button button-outline-blue button-download" data-download>下载客户端 <span>↓</span></button></div>
      </div>
    </section>
  </main>

  <footer class="site-footer" id="help">
    <div class="shell footer-grid">
      <div class="footer-brand"><a class="brand brand-dark" href="#top"><span class="brand-mark"><i></i><i></i><i></i><i></i><i></i><i></i></span><span>Kotier<span class="brand-sub">内网穿透</span></span></a><p>专业、安全、稳定的内网穿透解决方案，<br />让远程联网更简单。</p></div>
      <div class="footer-column"><h3>产品</h3><a href="#features">产品特性</a><a href="#scenarios">使用场景</a><a href="#pricing">价格</a></div>
      <div class="footer-column"><h3>资源</h3><a href="#docs">文档中心</a><a href="#docs">API 文档</a><a href="#docs">更新日志</a></div>
      <div class="footer-column"><h3>支持</h3><a href="#help">帮助中心</a><a href="#help">常见问题</a><a href="#help">工单系统</a></div>
      <div class="footer-column"><h3>关于我们</h3><a href="#top">公司介绍</a><a href="#top">联系我们</a><a href="#top">隐私政策</a></div>
      <div class="footer-follow"><div class="qr-placeholder" aria-label="关注 Kotier 的二维码"><span></span><span></span><span></span><span></span><b>◎</b></div><p>关注我们<br />获取最新动态</p></div>
    </div>
    <div class="shell footer-bottom"><span>© 2024 Kotier. All rights reserved.</span><span>粤ICP备XXXXXXX号 <a href="#top">↗</a></span></div>
  </footer>
  <div class="toast" role="status" aria-live="polite"></div>
`

const toast = document.querySelector<HTMLDivElement>('.toast')
let toastTimer: number | undefined

function showToast(message: string) {
  if (!toast) return
  window.clearTimeout(toastTimer)
  toast.textContent = message
  toast.classList.add('is-visible')
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400)
}

document.querySelectorAll<HTMLElement>('[data-feedback]').forEach((element) => {
  element.addEventListener('click', () => showToast(element.dataset.feedback ?? '功能即将开放'))
})

document.querySelectorAll<HTMLElement>('[data-download]').forEach((button) => {
  button.addEventListener('click', () => {
    const originalLabel = button.innerHTML
    button.innerHTML = '准备下载 <span aria-hidden="true">✓</span>'
    showToast('客户端下载即将开放，敬请期待')
    window.setTimeout(() => { button.innerHTML = originalLabel }, 1800)
  })
})

const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle')
const mainNav = document.querySelector<HTMLElement>('.main-nav')

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('is-open') ?? false
  menuToggle.setAttribute('aria-expanded', String(isOpen))
  menuToggle.setAttribute('aria-label', isOpen ? '关闭导航' : '打开导航')
})

document.querySelectorAll<HTMLAnchorElement>('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('is-active'))
    link.classList.add('is-active')
    mainNav?.classList.remove('is-open')
    menuToggle?.setAttribute('aria-expanded', 'false')
  })
})

const sections = document.querySelectorAll<HTMLElement>('main section[id]')
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const activeLink = document.querySelector<HTMLAnchorElement>(`.nav-link[href="#${entry.target.id}"]`)
      if (activeLink) {
        document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('is-active'))
        activeLink.classList.add('is-active')
      }
    }
  })
}, { rootMargin: '-35% 0px -55% 0px' })

sections.forEach((section) => observer.observe(section))
