
(function() {
  "use strict";

document.addEventListener('DOMContentLoaded', () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const name = params.name;
    const templ = params.templ;
    if (name) {
      const msg = `@${name} Display your NFT collection directly on Twitter with Niftycase https://chrome.google.com/niftycase`;
      const html = `
        <p>This user does not have Niftycase installed.</p>
        <p><a class="link" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}" target="_blank">Send invite to @${name}</a></p>
      `;
      const elem = document.getElementById('displayCase');
      elem.innerHTML = html;
    }
    document.body.classList.remove('light', 'dark', 'darker');
    if (templ) {
      document.body.classList.add(templ);
    }
  });
})();
