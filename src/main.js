import './style.css'

const platforms = [
  { id: 'douyin', name: '抖音', tag: 'DOU YIN', icon: '抖', shade: 'red', connected: true },
  { id: 'xiaohongshu', name: '小红书', tag: 'RED', icon: '红', shade: 'coral', connected: true },
  { id: 'kuaishou', name: '快手', tag: 'KUAISHOU', icon: '快', shade: 'orange', connected: true },
]

let selected = new Set(platforms.map(({ id }) => id))
let media = null

const app = document.querySelector('#app')

function render() {
  app.innerHTML = `
    <aside class="sidebar">
      <a class="brand" href="#"><span class="brand-mark">⇧</span><span>UPFLOW</span></a>
      <nav>
        <a class="nav-item active" href="#"><span>✦</span>发布内容</a>
        <a class="nav-item" href="#"><span>▣</span>内容库</a>
        <a class="nav-item" href="#"><span>◷</span>发布记录</a>
      </nav>
      <div class="sidebar-bottom">
        <a class="nav-item" href="#"><span>⚙</span>设置</a>
        <div class="user"><div class="avatar">林</div><div><b>林小姐</b><small>个人工作台</small></div><button>⌄</button></div>
      </div>
    </aside>
    <main>
      <header><div><p class="eyebrow">CONTENT STUDIO</p><h1>创建新内容</h1></div><div class="header-actions"><button class="draft">存为草稿</button><button class="help">?</button></div></header>
      <section class="layout">
        <div class="editor-column">
          <section class="card compose-card">
            <div class="section-title"><span class="num">01</span><div><h2>内容素材</h2><p>上传视频或图片，支持拖拽上传</p></div></div>
            <label class="upload ${media ? 'has-media' : ''}" id="upload-area">
              <input id="file-input" type="file" accept="image/*,video/*" hidden />
              <div class="upload-icon">${media ? '✓' : '↑'}</div>
              <strong>${media ? media.name : '点击上传素材'}</strong>
              <span>${media ? '素材已就绪，点击可替换' : '或将文件拖放到这里'}</span>
              <small>${media ? `${Math.round(media.size / 1024)} KB` : '支持 MP4、MOV、JPG、PNG · 最大 5GB'}</small>
            </label>
          </section>
          <section class="card copy-card">
            <div class="section-title"><span class="num">02</span><div><h2>文案与话题</h2><p>一份内容，适配多个平台</p></div></div>
            <div class="field"><label for="title">标题 <em>选填</em></label><input id="title" maxlength="30" placeholder="给内容起一个吸引人的标题" /><span class="counter" id="title-count">0 / 30</span></div>
            <div class="field"><label for="caption">正文</label><textarea id="caption" maxlength="1000" placeholder="分享此刻的灵感与故事…"></textarea><span class="counter" id="caption-count">0 / 1000</span></div>
            <div class="tags" id="tags"><span class="tag">#生活记录 <button>×</button></span><span class="tag">#今日分享 <button>×</button></span><input id="tag-input" placeholder="输入话题后按回车" /></div>
          </section>
        </div>
        <aside class="publish-column">
          <section class="card platform-card">
            <div class="section-title"><span class="num">03</span><div><h2>发布平台</h2><p>选择要同步发布的平台</p></div></div>
            <div class="platform-list">${platforms.map(p => `<button class="platform ${selected.has(p.id) ? 'selected' : ''}" data-id="${p.id}"><span class="platform-logo ${p.shade}">${p.icon}</span><span class="platform-name"><b>${p.name}</b><small>${p.connected ? '账号已连接' : '未连接'}</small></span><span class="check">${selected.has(p.id) ? '✓' : ''}</span></button>`).join('')}</div>
            <button class="connect">+ 连接更多平台</button>
          </section>
          <section class="card schedule-card"><div class="schedule-head"><div><h2>定时发布</h2><p>选择合适的发布时间</p></div><label class="switch"><input id="schedule" type="checkbox"><span></span></label></div><div class="time-choice disabled" id="time-choice"><span>◷</span><input type="datetime-local" aria-label="发布时间" /></div></section>
          <button class="publish" id="publish" ${selected.size ? '' : 'disabled'}><span>向上箭头</span> 立即发布到 ${selected.size} 个平台</button>
          <p class="notice">发布即表示你同意各平台的内容规范</p>
        </aside>
      </section>
    </main>
    <div class="toast" id="toast"></div>`
  bind()
}

function bind() {
  const title = document.querySelector('#title'), caption = document.querySelector('#caption')
  ;[[title, '#title-count', 30], [caption, '#caption-count', 1000]].forEach(([input, count, max]) => input.addEventListener('input', () => document.querySelector(count).textContent = `${input.value.length} / ${max}`))
  document.querySelectorAll('.platform').forEach(button => button.addEventListener('click', () => {
    const { id } = button.dataset
    selected.has(id) ? selected.delete(id) : selected.add(id)
    render()
  }))
  const upload = document.querySelector('#upload-area'), file = document.querySelector('#file-input')
  file.addEventListener('change', e => { media = e.target.files[0]; render() })
  ;['dragenter', 'dragover'].forEach(type => upload.addEventListener(type, e => { e.preventDefault(); upload.classList.add('dragging') }))
  ;['dragleave', 'drop'].forEach(type => upload.addEventListener(type, e => { e.preventDefault(); upload.classList.remove('dragging') }))
  upload.addEventListener('drop', e => { media = e.dataTransfer.files[0]; render() })
  const schedule = document.querySelector('#schedule')
  schedule.addEventListener('change', () => document.querySelector('#time-choice').classList.toggle('disabled', !schedule.checked))
  document.querySelector('#tag-input').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.value.trim()) { e.preventDefault(); const tag = document.createElement('span'); tag.className = 'tag'; tag.innerHTML = `#${e.target.value.trim().replace(/^#/, '')} <button>×</button>`; e.target.before(tag); e.target.value = ''; tag.querySelector('button').onclick = () => tag.remove() } })
  document.querySelectorAll('.tag button').forEach(btn => btn.onclick = () => btn.parentElement.remove())
  document.querySelector('#publish').addEventListener('click', () => { const toast = document.querySelector('#toast'); toast.textContent = '正在将内容发布到已选平台…'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2800) })
}
render()
