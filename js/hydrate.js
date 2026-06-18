/* ============================================================
   Applies admin-saved content (localStorage) to the public
   site by targeting elements marked with data-edit="<key>".
   Runs before main.js animations. No-ops if nothing is saved.
   ============================================================ */
(function () {
  "use strict";
  if (!window.PORTFOLIO) return;

  var data = window.PORTFOLIO.load();
  if (!data || !Object.keys(data).length) return;

  var fieldType = {};
  window.PORTFOLIO.FIELDS.forEach(function (f) { fieldType[f.key] = f.type; });

  Object.keys(data).forEach(function (key) {
    var value = data[key];
    if (value == null || value === "") return;

    var els = document.querySelectorAll('[data-edit="' + key + '"]');
    els.forEach(function (el) {
      if (fieldType[key] === "tags") {
        // Rebuild <li> children for a tag list.
        var items = String(value).split(",").map(function (s) { return s.trim(); }).filter(Boolean);
        el.innerHTML = items.map(function (t) {
          return "<li>" + escapeHtml(t) + "</li>";
        }).join("");
      } else if (el.tagName === "A" && fieldType[key] === "email") {
        el.textContent = value;
        el.setAttribute("href", "mailto:" + value);
      } else {
        el.textContent = value;
      }
    });
  });

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();
