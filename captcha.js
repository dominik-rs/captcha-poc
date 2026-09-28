(function() {
  const STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: flex; flex-direction: column; height: 100vh; min-height: 100vh;
  background-color: #fcfcfc; color: #333;
  margin: 0;
}
.main-wrapper { align-items: center; display: flex; flex: 1; flex-direction: column; }
.main-content { margin: 8rem auto; max-width: 60rem; padding-left: 1.5rem; padding-right: 1.5rem; width: 100%; }
.logo-container { display: flex; align-items: center; gap: 12px; }
.logo-img { width: 48px; height: 48px; border-radius: 4px; flex-shrink: 0; }
.domain-title { font-size: 2.5rem; font-weight: 500; line-height: 3.75rem; }
.text-container { font-size: 1.5rem; line-height: 2.25rem; margin-bottom: 2rem; min-height: 2rem; font-weight: 550; padding-top: 2px; }
.preloader { display: flex; align-items: center; justify-content: center; }
.lds-ring { display: inline-block; position: relative; height: 1.875rem; width: 1.875rem; }
.lds-ring div {
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border: 0.3rem solid transparent; border-radius: 50%;
  border-top-color: #313131; box-sizing: border-box;
  display: block; position: absolute; height: 1.875rem; width: 1.875rem;
}
.lds-ring div:nth-child(2) { animation-delay: -0.3s; }
.lds-ring div:nth-child(3) { animation-delay: -0.15s; }
@keyframes lds-ring {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.checkbox-window {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 300px; height: 74px;
  background-color: #fafafa; border: 1px solid #d9d9d9; border-radius: 4px;
  padding: 10px; overflow: hidden; margin: 20px auto 0;
  transition: width 0.5s ease-in-out, height 0.5s ease-in-out, opacity 0.3s;
  opacity: 0;
}
.checkbox-window-inner { display: flex; align-items: center; width: 100%; }
.checkbox-container {
  width: 28px; height: 28px; margin-left: 3px; margin-right: 12px; position: relative; flex-shrink: 0;
}
.checkbox {
  width: 100%; height: 100%; background-color: #fff; border-radius: 2px;
  border: 2px solid #888; cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.checkbox:hover { border-color: #4285f4; }
.checkbox.checked { border-color: #4285f4; background-color: #4285f4; }
.checkbox.checked i { color: #fff; font-size: 16px; }
.tettx { color: rgb(78, 78, 78); font-size: 14px; }
.tettx p { margin: 0 !important; }
#spinner { visibility: hidden; position: relative; margin: 0 auto; }
#spinner .lds-ring { width: 1.5rem; height: 1.5rem; }
#spinner .lds-ring div { width: 1.5rem; height: 1.5rem; border-width: 0.25rem; }
.widget-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
  gap: 2px;
}
.widget-footer .ts-logo svg {
  display: block;
  width: 73px;
  height: 24px;
}
.widget-footer .legal-links {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
}
.widget-footer .legal-links a {
  color: #888;
  text-decoration: none;
  cursor: pointer;
}
.widget-footer .legal-links a:hover { text-decoration: underline; }
.widget-footer .legal-links span { color: #ccc; }
.progress-area { display: none; margin-top: 24px; width: 100%; max-width: 300px; margin-left: auto; margin-right: auto; }
.progress-bar-track { width: 100%; height: 4px; background: #e5e5e5; border-radius: 4px; overflow: hidden; }
.progress-bar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #f38020, #f5a623); border-radius: 4px; transition: width 0.2s ease; }
.status-message { font-size: 14px; color: #666; margin-top: 10px; text-align: center; min-height: 20px; }
.domain-footer { font-size: 1rem; line-height: 1.5rem; padding-top: 33px; text-align: center; color: #666; }
.hidden { display: none !important; }
.step0, .step1, .step2, .step3 { display: none; }
.step0.active, .step1.active, .step2.active, .step3.active { display: block; }
.success-icon { width: 28px; height: 28px; display: block; margin: 0 auto; }
.success-icon circle { fill: #28a745; }
.success-icon path { stroke: white; stroke-width: 4; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.footer { font-size: 0.75rem; line-height: 1.125rem; margin: 0 auto; max-width: 60rem; padding-left: 1.5rem; padding-right: 1.5rem; width: 100%; }
.footer-inner { border-top: 1px solid #d9d9d9; padding-bottom: 1rem; padding-top: 1rem; text-align: center; }
.footer-inner > div:first-child { margin-bottom: 5px; }
.footer-inner code { font-family: monospace; }
@media (prefers-color-scheme: dark) {
  body { background-color: #1a1a1a; color: #ddd; }
  .checkbox-window { background-color: #2a2a2a; border-color: #444; }
  .checkbox { background-color: #333; border-color: #666; }
  .tettx { color: #ccc; }
  .lds-ring div { border-top-color: #ddd !important; }
  .domain-footer { color: #999; }
  .footer-inner { border-top-color: #444; }
  .status-message { color: #aaa; }
  .progress-bar-track { background: #444; }
}`;

  // ─── Helper to read config at call time ─────────────────────
  function getConfig(key, fallback) {
    const cfg = window.__cfCaptchaConfig || {};
    return cfg[key] !== undefined ? cfg[key] : fallback;
  }

  // ─── HTML Template ──────────────────────────────────────────
  function getHTML(domain, logoUrl) {
    const safeDomain = domain || window.location.hostname || 'example.com';
    const logoSrc = logoUrl || `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(safeDomain)}`;
    return `
<div class="main-wrapper">
  <div class="main-content">
    <div class="logo-container">
      <img class="logo-img" src="${logoSrc}" alt="Logo">
      <p class="domain-title"><span class="domain-name">${safeDomain}</span></p>
    </div>
    <div class="text-container">
      <p>
        <span class="preloader_text">Checking if you are human. This may take a few seconds.</span>
        <span class="textallstep" style="display: none;">Verify you are human by completing the action below.</span>
      </p>
    </div>
    <div class="intro">
      <div class="preloader"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
      <div id="checkbox-window" class="checkbox-window" style="display: none;">
        <div class="checkbox-window-inner">
          <div class="checkbox-container">
            <button type="button" id="checkbox" class="checkbox step1" style="display: none;"></button>
            <div class="spinner step2" id="spinner" style="visibility: hidden; display: none;">
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
            <div class="step3" style="display: none;">
              <svg class="success-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="23"/><path d="M15 25 L22 32 L35 18"/>
              </svg>
            </div>
          </div>
          <div class="tettx">
            <p class="step1" style="display: none;">I'm not a robot</p>
            <p class="step2" style="display: none;">Verifying...</p>
            <p class="step3" style="display: none;">Verified</p>
          </div>
          <div class="widget-footer">
            <div class="ts-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 163.34 25.73">
                <defs>
                  <style>
                    .cls-1 {
                      fill: #b9b9b9;
                    }

                    .cls-2 {
                      fill: #d9d9d9;
                    }

                    .cls-3 {
                      fill: #403f3e;
                    }

                    .cls-4 {
                      fill: #716f6a;
                      mix-blend-mode: screen;
                    }

                    .cls-5 {
                      isolation: isolate;
                    }
                  </style>
                </defs>
                <g class="cls-5">
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                      <g>
                        <rect class="cls-2" x="104.35" y="4.3" width="4.28" height="8.57"/>
                        <rect class="cls-2" x="104.35" y="17.14" width="4.28" height="8.59"/>
                        <rect class="cls-2" x="108.63" y="12.87" width="8.54" height="4.27"/>
                        <rect class="cls-2" x="95.81" y="12.87" width="8.54" height="4.27"/>
                        <rect class="cls-4" x="104.35" y="12.87" width="4.28" height="4.27"/>
                        <rect class="cls-1" x="104.35" y="12.87" width="4.28" height="4.27"/>
                        <polygon class="cls-3" points="117.17 0 117.17 12.89 134.24 12.89 134.24 17.14 117.17 17.14 117.17 21.43 138.52 21.43 138.52 8.59 121.44 8.59 121.44 4.3 159.06 4.3 159.06 8.59 146.27 8.59 146.27 12.89 159.06 12.89 159.06 17.14 141.99 17.14 141.99 21.43 163.34 21.43 163.34 0 117.17 0"/>
                        <g>
                          <path class="cls-3" d="m21.35,21.43H0V0h21.35v4.3H4.28v12.84h17.07v4.29Z"/>
                          <path class="cls-3" d="m46.17,21.43h-21.35V0h4.27v17.14h12.8V0h4.28v21.43Z"/>
                          <path class="cls-3" d="m70.99,4.3h-17.07v17.13h-4.28V0h21.35v4.3Z"/>
                          <polygon class="cls-3" points="78.74 12.89 78.74 8.59 78.74 6.97 78.74 4.3 91.54 4.3 91.54 8.59 82.21 8.59 82.21 12.89 95.81 12.89 95.81 0 74.46 0 74.46 21.43 95.81 21.43 95.81 17.14 78.74 17.14 78.74 13.92 78.74 12.89"/>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <div class="legal-links">
              <a target="_blank" rel="noopener noreferrer" href="https://cure53.de/datenschutz">Privacy</a>
              <span>•</span>
              <a target="_blank" rel="noopener noreferrer" href="#">Help</a>
            </div>
          </div>
        </div>
      </div>
      <div class="progress-area" id="progressArea">
        <div class="progress-bar-track">
          <div class="progress-bar-fill" id="progressFill"></div>
        </div>
        <div class="status-message" id="statusMsg"></div>
      </div>
      <p class="domain-footer">
        <span class="domain-name">${safeDomain}</span> needs to review the security of your connection before proceeding.
      </p>
    </div>
  </div>
</div>
<div class="footer" role="contentinfo">
  <div class="footer-inner">
    <div>
      <div>Trace ID: <code class="ray-id"></code></div>
    </div>
    <div>Platform performance and security <span style="color: #000000">Cure53</span></div>
  </div>
</div>`;
  }

  function generateRayId() {
    const chars = 'abcdef0123456789';
    return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  function mountPage(domain, logoUrl) {
    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.id = '__cf_captcha_styles';
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fa = document.createElement('link');
      fa.rel = 'stylesheet';
      fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
      document.head.appendChild(fa);
    }

    document.title = 'Just a moment...';
    document.body.innerHTML = getHTML(domain, logoUrl);

    const rayEl = document.querySelector('.ray-id');
    if (rayEl) rayEl.textContent = generateRayId();

    const preloader = document.querySelector('.preloader');
    const preloaderText = document.querySelector('.preloader_text');
    const textAllStep = document.querySelector('.textallstep');
    const checkboxWindow = document.getElementById('checkbox-window');
    const checkbox = document.getElementById('checkbox');
    const step1Els = document.querySelectorAll('.step1');
    const step2Els = document.querySelectorAll('.step2');
    const step3Els = document.querySelectorAll('.step3');
    const spinner = document.getElementById('spinner');
    const progressArea = document.getElementById('progressArea');
    const progressFill = document.getElementById('progressFill');
    const statusMsg = document.getElementById('statusMsg');

    setTimeout(() => {
      if (preloader) preloader.style.display = 'none';
      if (preloaderText) preloaderText.style.display = 'none';
      if (textAllStep) textAllStep.style.display = 'block';
      if (checkboxWindow) {
        checkboxWindow.style.display = 'flex';
        setTimeout(() => { checkboxWindow.style.opacity = '1'; }, 50);
      }
      step1Els.forEach(el => { el.style.display = 'block'; el.classList.add('active'); });
    }, 1500);

    if (checkbox) {
      checkbox.addEventListener('click', function() {
        const onClick = getConfig('onCheckboxClick', null);
        if (typeof onClick === 'function') {
          onClick();
        }

        this.classList.add('checked');
        this.innerHTML = '<i class="fas fa-check"></i>';
        this.style.pointerEvents = 'none';

        step1Els.forEach(el => { el.style.display = 'none'; el.classList.remove('active'); });
        step2Els.forEach(el => { el.style.display = 'block'; el.classList.add('active'); });
        if (spinner) spinner.style.visibility = 'visible';

        progressArea.style.display = 'block';
        statusMsg.textContent = 'Verifying connection...';

        let pct = 0;
        const interval = setInterval(() => {
          pct += Math.floor(Math.random() * 12) + 5;
          if (pct >= 100) { pct = 100; clearInterval(interval); complete(); }
          progressFill.style.width = pct + '%';
        }, 180);
      });
    }

    const verifiedData = {
      rayId: rayEl?.textContent || '',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      domain: domain || window.location.hostname
    };

    function complete() {
      step2Els.forEach(el => { el.style.display = 'none'; el.classList.remove('active'); });
      step3Els.forEach(el => { el.style.display = 'block'; el.classList.add('active'); });
      if (spinner) spinner.style.visibility = 'hidden';
      statusMsg.textContent = 'Verified ✓ Redirecting...';

      console.log('[POC] Captcha completed', verifiedData);

      window.__cf_captcha_completed = true;
      window.__cf_captcha_data = verifiedData;

      setTimeout(() => {
        const onComp = getConfig('onComplete', null);
        const redir = getConfig('redirectUrl', null);

        if (typeof onComp === 'function') {
          onComp(verifiedData);
        } else if (redir) {
          window.location.href = redir;
        } else {
          statusMsg.textContent = '✓ Verification complete';
        }
      }, 1200);
    }
  }

  // ─── Public API ──────────────────────────────────────────────
  function createCaptchaPage(userConfig) {
    if (userConfig) {
      window.__cfCaptchaConfig = window.__cfCaptchaConfig || {};
      Object.keys(userConfig).forEach(function(key) {
        window.__cfCaptchaConfig[key] = userConfig[key];
      });
    }

    const cfg = window.__cfCaptchaConfig || {};
    const params = new URLSearchParams(window.location.search);
    const site = cfg.siteParam || params.get('site');
    const logo = cfg.logoUrl || params.get('logo');

    let domain = site || window.location.hostname || 'example.com';
    try { domain = new URL(domain.startsWith('http') ? domain : 'https://' + domain).hostname; }
    catch (e) { /* use as-is */ }

    mountPage(domain, logo);
    return window.__cf_captcha_data;
  }

  createCaptchaPage();

  if (typeof window !== 'undefined') {
    window.__cfCaptcha = { createCaptchaPage };
  }
})();
