(function () {
  var dlg = document.getElementById('reader');
  var title = document.getElementById('reader-title');
  var meta = document.getElementById('reader-meta');
  var text = document.getElementById('reader-text');
  var lastBtn = null;

  document.querySelectorAll('.read').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lastBtn = btn;
      title.textContent = btn.dataset.title;
      meta.textContent = btn.dataset.meta;
      text.innerHTML = btn.parentElement.querySelector('template').innerHTML;
      dlg.showModal();
      dlg.querySelector('.sheet').scrollTop = 0;
    });
  });

  dlg.querySelector('.close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { if (lastBtn) lastBtn.focus(); });
})();
