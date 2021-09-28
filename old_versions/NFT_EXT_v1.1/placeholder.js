
(function() {
  "use strict";

  document.addEventListener('DOMContentLoaded', () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const name = params.name;

    if (name) {
      const msg = `@${name} Display your NFT collection directly on Twitter with Niftycase https://t.co/uQ1J3seBSb`;
      const html = `
        <p>This user has not yet signed up with Niftycase.</p>
        <p><a class="link" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}" target="_blank">Send invite to @${name}</a></p>
      `;
      const elem = document.getElementById('displayCase');
      elem.innerHTML = html;
    }
  });
})();
