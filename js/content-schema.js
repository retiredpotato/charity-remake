/* ============================================================
   Shared content schema for the portfolio + admin.
   Loaded as a plain script (no modules) so it works on
   file:// and GitHub Pages alike. Exposes window.PORTFOLIO.
   ============================================================ */
(function () {
  "use strict";

  // localStorage key holding the editable content overrides.
  var STORAGE_KEY = "cf_portfolio_content_v1";

  // Field definitions. `key` matches data-edit="<key>" in index.html.
  // type: text | textarea | tags (comma separated) | email
  var FIELDS = [
    // --- Identity ---
    { key: "brandName",     group: "Identity", label: "Name / wordmark",      type: "text" },
    { key: "navCta",        group: "Identity", label: "Nav button label",     type: "text" },

    // --- Hero ---
    { key: "heroEyebrow",   group: "Hero", label: "Eyebrow / availability",   type: "text" },
    { key: "heroLede",      group: "Hero", label: "Hero intro paragraph",     type: "textarea" },

    // --- About ---
    { key: "aboutStatement", group: "About", label: "Big statement",          type: "textarea" },
    { key: "aboutText1",     group: "About", label: "About paragraph 1",      type: "textarea" },
    { key: "aboutText2",     group: "About", label: "About paragraph 2",      type: "textarea" },

    // --- Featured project 1 ---
    { key: "proj1Name", group: "Project 1", label: "Title",        type: "text" },
    { key: "proj1Tags", group: "Project 1", label: "Tags (comma)", type: "tags" },
    { key: "proj1Desc", group: "Project 1", label: "Description",  type: "textarea" },
    { key: "proj1Year", group: "Project 1", label: "Year / meta",  type: "text" },

    // --- Featured project 2 ---
    { key: "proj2Name", group: "Project 2", label: "Title",        type: "text" },
    { key: "proj2Tags", group: "Project 2", label: "Tags (comma)", type: "tags" },
    { key: "proj2Desc", group: "Project 2", label: "Description",  type: "textarea" },
    { key: "proj2Year", group: "Project 2", label: "Year / meta",  type: "text" },

    // --- Featured project 3 ---
    { key: "proj3Name", group: "Project 3", label: "Title",        type: "text" },
    { key: "proj3Tags", group: "Project 3", label: "Tags (comma)", type: "tags" },
    { key: "proj3Desc", group: "Project 3", label: "Description",  type: "textarea" },
    { key: "proj3Year", group: "Project 3", label: "Year / meta",  type: "text" },

    // --- Contact ---
    { key: "contactEmail",    group: "Contact", label: "Email",        type: "email" },
    { key: "contactLocation", group: "Contact", label: "Based in",     type: "text" },
    { key: "contactAvail",    group: "Contact", label: "Availability", type: "text" },
  ];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  window.PORTFOLIO = {
    STORAGE_KEY: STORAGE_KEY,
    FIELDS: FIELDS,
    load: load,
    save: save,
    clear: clear,
  };
})();
