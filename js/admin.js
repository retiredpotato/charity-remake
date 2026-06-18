/* ============================================================
   Portfolio Admin — client-side content manager.

   NOTE: This is a static, front-end-only admin. The passcode
   gate is convenience, NOT real security (anyone can read this
   file). Content is stored in the browser's localStorage and
   drives the public site on the same origin. Use "Export JSON"
   to hand the final content over for committing to the repo.
   ============================================================ */
(function () {
  "use strict";

  var PASSCODE = "charity2026";          // change me
  var AUTH_KEY = "cf_admin_authed";

  var P = window.PORTFOLIO;
  var loginView = document.getElementById("loginView");
  var dashView  = document.getElementById("dashView");

  /* ---------------- Auth ---------------- */
  function showDash() {
    loginView.classList.add("hidden");
    dashView.classList.remove("hidden");
    buildForm();
  }
  if (sessionStorage.getItem(AUTH_KEY) === "1") showDash();

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var val = document.getElementById("passcode").value;
    if (val === PASSCODE) {
      sessionStorage.setItem(AUTH_KEY, "1");
      showDash();
    } else {
      document.getElementById("loginErr").textContent = "Incorrect passcode. Try again.";
    }
  });
  document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.removeItem(AUTH_KEY);
    location.reload();
  });

  /* ---------------- Build the form ---------------- */
  var defaults = {}; // current site text, read from index.html if reachable

  function buildForm() {
    var saved = P.load();

    // Try to read current defaults from index.html (same origin).
    fetch("index.html")
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        P.FIELDS.forEach(function (f) {
          var el = doc.querySelector('[data-edit="' + f.key + '"]');
          if (!el) return;
          if (f.type === "tags") {
            var lis = el.querySelectorAll("li");
            defaults[f.key] = Array.prototype.map.call(lis, function (li) { return li.textContent.trim(); }).join(", ");
          } else {
            defaults[f.key] = el.textContent.trim().replace(/\s+/g, " ");
          }
        });
        document.getElementById("originNote").textContent =
          "Tip: placeholders show the current live text. Edits are saved per-browser — export the JSON when you're done so the changes can be committed to the repo for everyone.";
      })
      .catch(function () {
        document.getElementById("originNote").textContent =
          "Heads up: couldn't read the live defaults (you may be on file://). You can still type new values — anything you save overrides the site.";
      })
      .finally(function () { render(saved); });
  }

  function render(saved) {
    var form = document.getElementById("contentForm");
    form.innerHTML = "";

    // Group fields by `group`, preserving order.
    var groups = [];
    var byName = {};
    P.FIELDS.forEach(function (f) {
      if (!byName[f.group]) { byName[f.group] = []; groups.push(f.group); }
      byName[f.group].push(f);
    });

    groups.forEach(function (groupName, gi) {
      var wrap = document.createElement("div");
      wrap.className = "group" + (gi === 0 ? " open" : "");

      var head = document.createElement("div");
      head.className = "group__head";
      head.innerHTML = "<h3>" + groupName + "</h3><span class='chev'>▾</span>";
      head.addEventListener("click", function () { wrap.classList.toggle("open"); });

      var body = document.createElement("div");
      body.className = "group__body";

      byName[groupName].forEach(function (f) {
        var field = document.createElement("div");
        field.className = "field";

        var id = "f_" + f.key;
        var label = document.createElement("label");
        label.setAttribute("for", id);
        label.textContent = f.label;

        var input;
        if (f.type === "textarea") {
          input = document.createElement("textarea");
        } else {
          input = document.createElement("input");
          input.type = f.type === "email" ? "email" : "text";
        }
        input.id = id;
        input.dataset.key = f.key;
        if (saved[f.key] != null) input.value = saved[f.key];
        if (defaults[f.key]) input.placeholder = defaults[f.key];

        field.appendChild(label);
        field.appendChild(input);
        if (f.type === "tags") {
          var hint = document.createElement("div");
          hint.className = "hint";
          hint.textContent = "Separate tags with commas.";
          field.appendChild(hint);
        }
        body.appendChild(field);
      });

      wrap.appendChild(head);
      wrap.appendChild(body);
      form.appendChild(wrap);
    });
  }

  /* ---------------- Save / export / import / reset ---------------- */
  function gather() {
    var data = {};
    document.querySelectorAll("#contentForm [data-key]").forEach(function (input) {
      var v = input.value.trim();
      if (v !== "") data[input.dataset.key] = v;
    });
    return data;
  }

  document.getElementById("saveBtn").addEventListener("click", function () {
    var data = gather();
    P.save(data);
    var n = Object.keys(data).length;
    document.getElementById("saveStatus").textContent = "Saved " + n + " field" + (n === 1 ? "" : "s") + " ✓";
    toast("Saved. Open the site to see your changes.");
  });

  document.getElementById("exportBtn").addEventListener("click", function () {
    var data = gather();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-content.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("Exported portfolio-content.json");
  });

  document.getElementById("importBtn").addEventListener("click", function () {
    document.getElementById("importFile").click();
  });
  document.getElementById("importFile").addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        P.save(data);
        render(data);
        toast("Imported. Review and Save.");
      } catch (err) {
        toast("That file isn't valid JSON.");
      }
    };
    reader.readAsText(file);
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!confirm("Clear all saved overrides and revert to the built-in defaults?")) return;
    P.clear();
    render({});
    document.getElementById("saveStatus").textContent = "Reset to defaults ✓";
    toast("Cleared. The site now shows its defaults.");
  });

  /* ---------------- Toast ---------------- */
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
})();
