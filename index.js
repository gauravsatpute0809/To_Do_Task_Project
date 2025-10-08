(function () {
  if (typeof window === "undefined" || !window.document) return;

  document.addEventListener("DOMContentLoaded", () => {
    "use strict";
  
    const addBtn = document.getElementById("addBtn");
    const input = document.getElementById("taskInput");
    const listArea = document.getElementById("listArea");
    const countInfo = document.getElementById("countInfo");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");
    const resetBtn = document.getElementById("resetBtn");
    const filterAll = document.getElementById("filterAll");
    const filterActive = document.getElementById("filterActive");
    const filterDone = document.getElementById("filterDone");
gi
    let tasks = [
      { id: 1, text: "Finish the project report", done: false, meta: "Due: Today • 2h" },
      { id: 2, text: "Morning workout — 30 min", done: true, meta: "Completed" },
      { id: 3, text: "Read 20 pages of book", done: false, meta: "Due: Oct 5" },
    ];

    let nextId = 4;
    let filter = "all";

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
      );
    }

    function updateCounts() {
      if (!countInfo) return;
      const total = tasks.length;
      const done = tasks.filter((t) => t.done).length;
      countInfo.textContent = `${total} task${total !== 1 ? "s" : ""} • ${done} completed`;
    }

    function render() {
      if (!listArea) return;
      listArea.innerHTML = "";

      const filtered = tasks.filter((t) => {
        if (filter === "all") return true;
        if (filter === "active") return !t.done;
        return t.done; // for 'done'
      });

      if (filtered.length === 0) {
        listArea.innerHTML = '<div class="empty">No tasks here. Add your first task!</div>';
      } else {
        for (const t of filtered) {
          const node = document.createElement("div");
          node.className = "task" + (t.done ? " completed" : "");
          node.dataset.id = t.id;
          node.innerHTML = `
            <input type="checkbox" ${t.done ? "checked" : ""} />
            <div class="meta">
              <div>
                <div class="text">${escapeHtml(t.text)}</div>
                <div class="text small">${escapeHtml(t.meta || "")}</div>
              </div>
              <div class="actions">
                <button class="icon-btn edit" title="Edit">✎</button>
                <button class="icon-btn del" title="Delete">🗑</button>
              </div>
            </div>
          `;
          listArea.appendChild(node);
        }
      }

      updateCounts();
    }

    // ➤ Add Task
    if (addBtn && input) {
      addBtn.addEventListener("click", () => {
        const v = input.value.trim();
        if (!v) {
          input.focus();
          return;
        }
        tasks.unshift({ id: nextId++, text: v, done: false, meta: "" });
        input.value = "";
        render();
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addBtn.click();
      });
    }

    // ➤ Handle List Clicks (checkbox/edit/delete)
    if (listArea) {
      listArea.addEventListener("click", (e) => {
        const tnode = e.target.closest(".task");
        if (!tnode) return;
        const id = Number(tnode.dataset.id);

        if (e.target.matches('input[type="checkbox"]')) {
          const task = tasks.find((x) => x.id === id);
          if (task) {
            task.done = e.target.checked;
            if (task.done) tnode.classList.add("completed");
            else tnode.classList.remove("completed");
            updateCounts();
          }
        } else if (e.target.classList.contains("del")) {
          tasks = tasks.filter((x) => x.id !== id);
          render();
        } else if (e.target.classList.contains("edit")) {
          const task = tasks.find((x) => x.id === id);
          if (!task) return;
          const newText = prompt("Edit task", task.text);
          if (newText !== null) {
            const trimmed = newText.trim();
            if (trimmed) {
              task.text = trimmed;
              render();
            }
          }
        }
      });
    }

    // ➤ Clear Completed
    if (clearCompletedBtn) {
      clearCompletedBtn.addEventListener("click", () => {
        tasks = tasks.filter((t) => !t.done);
        render();
      });
    }

    // ➤ Reset to Default Tasks
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        tasks = [
          { id: 1, text: "Finish the project report", done: false, meta: "Due: Today • 2h" },
          { id: 2, text: "Morning workout — 30 min", done: true, meta: "Completed" },
          { id: 3, text: "Read 20 pages of book", done: false, meta: "Due: Oct 5" },
        ];
        nextId = 4;
        filter = "all";
        render();
      });
    }

    // ➤ Filter Buttons
    if (filterAll) filterAll.addEventListener("click", () => { filter = "all"; render(); });
    if (filterActive) filterActive.addEventListener("click", () => { filter = "active"; render(); });
    if (filterDone) filterDone.addEventListener("click", () => { filter = "done"; render(); });

    // ➤ Initial Render
    render();
  });
})();
