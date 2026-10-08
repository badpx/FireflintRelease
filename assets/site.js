'use strict';
const releasePage = 'https://github.com/badpx/FireflintRelease/releases/latest';
const translations = [...document.querySelectorAll('[data-en]')].map(element => ({element, zh: element.innerHTML, en: element.dataset.en}));
const accessibleTranslations = ['alt', 'label'].flatMap(kind => [...document.querySelectorAll(`[data-en-${kind}]`)].map(element => ({element, attribute: kind === 'alt' ? 'alt' : 'aria-label', zh: element.getAttribute(kind === 'alt' ? 'alt' : 'aria-label'), en: element.getAttribute(`data-en-${kind}`)})));
const demos = {
  translate: {poster:'assets/translation-poster.png', animation:'screenshot/translation_bar.gif', zh:['本地处理','随手选中，原地理解。','翻译一段文字、解释一个概念，或提炼选中内容的重点。结果在浮动窗口中呈现，支持复制和继续提问。','划词使用辅助功能权限','划词翻译操作演示'], en:['LOCAL INFERENCE','Select it. Understand it.','Translate a passage, explain a concept, or pull out the key points. Results appear in a floating window, ready to copy or explore further.','Text selection uses Accessibility permission.','Text selection and translation demo']},
  capture: {poster:'assets/capture-poster.png', animation:'screenshot/snapshot_ask_ai.gif', zh:['本地 OCR','屏幕上的疑问，直接问。','选择一个窗口或框选屏幕区域，提取文字、翻译内容，或把图片交给 AI 理解。无需反复复制与切换应用。','首次截图时申请屏幕录制权限','截图并向 AI 提问的操作演示'], en:['LOCAL OCR','See something? Ask about it.','Capture a window or a screen region. Extract and translate text, or ask AI to explain the image—without switching back and forth.','Screen recording is requested on first capture.','Screen capture and AI question demo']},
  document: {poster:'screenshot/file_read.png', zh:['PDF · WORD · EXCEL · POWERPOINT','从厚文档里，找到重点。','定位相关内容、提取关键信息，让 AI 帮你阅读。扫描 PDF 可通过本地 OCR 辅助读取，文档图片也能按需查看。','添加文档，围绕内容继续追问','Fireflint 阅读 PDF 论文并提炼核心思想'], en:['PDF · WORD · EXCEL · POWERPOINT','Find the signal in your files.','Locate the passages that matter and extract key information. Local OCR helps with scanned PDFs; embedded images can be inspected on demand.','Add a document and ask follow-up questions.','Fireflint reading a PDF paper and explaining its main ideas']}
};
let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
let activeDemo = 'translate';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let playing = !reducedMotion.matches;
let rotationEnabled = !reducedMotion.matches;
let inView = false;
let hovered = false;
let focused = false;
let rotationTimer;
const rotationDelay = 20000;
const showcase = document.getElementById('demo-showcase');
const rotationButton = document.getElementById('demo-rotation');
const demoImage = document.getElementById('demo-image');
const playButton = document.getElementById('demo-play');
function updateDemo() {
  const demo = demos[activeDemo];
  const content = demo[lang];
  ['demo-tag','demo-title','demo-description','demo-note'].forEach((id,index) => {document.getElementById(id).textContent = content[index];});
  const source = playing && inView && !document.hidden && demo.animation ? demo.animation : demo.poster;
  if (demoImage.getAttribute('src') !== source) demoImage.src = source;
  demoImage.alt = content[4];
  document.getElementById('demo-image-button').dataset.image = source;
  playButton.hidden = !demo.animation;
  playButton.setAttribute('aria-pressed', String(playing));
  playButton.querySelector('span').textContent = lang === 'en' ? (playing ? 'Stop demo' : 'Play demo') : (playing ? '停止演示' : '播放操作演示');
  playButton.lastElementChild.textContent = playing ? '■' : '▶';
  rotationButton.textContent = lang === 'en' ? (rotationEnabled ? 'Pause auto-advance' : 'Resume auto-advance') : (rotationEnabled ? '暂停自动轮播' : '继续自动轮播');
  rotationButton.setAttribute('aria-pressed', String(rotationEnabled));
}
function setLanguage(next, updateURL = false) {
  lang = next;
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  translations.forEach(({element,zh,en}) => { if(lang === 'en') element.textContent = en; else element.innerHTML = zh; });
  accessibleTranslations.forEach(({element,attribute,zh,en}) => element.setAttribute(attribute,lang === 'en' ? en : zh));
  document.getElementById('language').textContent = lang === 'en' ? '中文' : 'EN';
  document.getElementById('language').setAttribute('aria-label', lang === 'en' ? '切换为中文' : 'Switch to English');
  document.title = lang === 'en' ? 'Fireflint — Local AI. No token fees. Privacy you control.' : 'Fireflint 火石 — 本地 AI，Token 自由，隐私可控。';
  document.querySelector('meta[name="description"]').content = lang === 'en' ? 'Local AI. No token fees. Privacy you control. Fireflint brings local inference to your Mac without per-token charges, with translation, screen capture, and document reading.' : 'Fireflint 火石：本地 AI，Token 自由，隐私可控。面向 macOS 的 AI 助手，本地推理不按 Token 计费，支持划词翻译、截图即问与文档阅读。';
  document.querySelectorAll('[data-doc]').forEach(link => {link.href = `https://github.com/badpx/FireflintRelease/blob/main/${lang === 'en' ? 'README.md' : 'README_CN.md'}`;});
  if (updateURL) {const url = new URL(location.href);if(lang === 'en') url.searchParams.set('lang','en');else url.searchParams.delete('lang');history.replaceState(null,'',url);}
  updateDemo();
}
document.getElementById('language').addEventListener('click', () => setLanguage(lang === 'en' ? 'zh' : 'en', true));
const tabs = [...document.querySelectorAll('[data-demo]')];
function selectDemo(tab) {
  activeDemo = tab.dataset.demo;
  tabs.forEach(button => {const selected = button === tab; button.setAttribute('aria-selected',String(selected));button.tabIndex = selected ? 0 : -1;});
  document.getElementById('demo-panel').setAttribute('aria-labelledby',tab.id);
  updateDemo();
  scheduleRotation();
}
tabs.forEach((tab,index) => {
  tab.addEventListener('click',() => selectDemo(tab));
  tab.addEventListener('keydown',event => {
    let target;
    if(event.key === 'ArrowRight') target = tabs[(index + 1) % tabs.length];
    if(event.key === 'ArrowLeft') target = tabs[(index + tabs.length - 1) % tabs.length];
    if(event.key === 'Home') target = tabs[0];
    if(event.key === 'End') target = tabs[tabs.length - 1];
    if(target){event.preventDefault();selectDemo(target);target.focus();}
  });
});
playButton.addEventListener('click',() => {
  playing = !playing;
  if (!playing) rotationEnabled = false;
  updateDemo(); scheduleRotation();
});
rotationButton.addEventListener('click',() => {
  rotationEnabled = !rotationEnabled;
  updateDemo(); scheduleRotation();
});
function scheduleRotation() {
  clearTimeout(rotationTimer);
  if (!rotationEnabled || !inView || !demoImage.complete || hovered || focused || document.hidden || dialog.open) return;
  rotationTimer = setTimeout(() => {
    const index = tabs.findIndex(tab => tab.dataset.demo === activeDemo);
    selectDemo(tabs[(index + 1) % tabs.length]);
  }, rotationDelay);
}
demoImage.addEventListener('load', scheduleRotation);
showcase.addEventListener('mouseenter',() => {hovered = true; scheduleRotation();});
showcase.addEventListener('mouseleave',() => {hovered = false; scheduleRotation();});
showcase.addEventListener('focusin',() => {focused = true; scheduleRotation();});
showcase.addEventListener('focusout',event => {
  focused = showcase.contains(event.relatedTarget);
  scheduleRotation();
});
new IntersectionObserver(entries => {
  inView = entries[0].isIntersecting;
  updateDemo(); scheduleRotation();
}, {threshold:0.25}).observe(document.getElementById('demo-panel'));
document.addEventListener('visibilitychange',() => {updateDemo(); scheduleRotation();});
reducedMotion.addEventListener('change',event => {
  if (event.matches) {playing = false; rotationEnabled = false; updateDemo(); scheduleRotation();}
});
const dialog = document.getElementById('image-dialog');
const largeImage = document.getElementById('large-image');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click',() => {largeImage.src = button.dataset.image;largeImage.alt = button.querySelector('img').alt;dialog.showModal();scheduleRotation();}));
document.getElementById('close-image').addEventListener('click',() => dialog.close());
dialog.addEventListener('click',event => {if(event.target === dialog) dialog.close();});
dialog.addEventListener('close',() => {largeImage.removeAttribute('src');scheduleRotation();});
setLanguage(lang);
// GitHub is also the download host. No analytics, external fonts, or cookies.
// If the API is unavailable or rate limited, the links still open Latest Release.
fetch('https://api.github.com/repos/badpx/FireflintRelease/releases/latest', {signal:AbortSignal.timeout(6000)})
  .then(response => {if(!response.ok) throw new Error('Release metadata unavailable');return response.json();})
  .then(data => {
    const asset = data.assets?.find(item => /^Fireflint-.*\.dmg$/i.test(item.name));
    if(!asset) return;
    const url = new URL(asset.browser_download_url);
    if(url.origin !== 'https://github.com' || !url.pathname.startsWith('/badpx/FireflintRelease/releases/download/')) return;
    document.querySelectorAll('[data-download]').forEach(link => {link.href = url.href;});
  }).catch(() => {document.querySelectorAll('[data-download]').forEach(link => {link.href = releasePage;});});
