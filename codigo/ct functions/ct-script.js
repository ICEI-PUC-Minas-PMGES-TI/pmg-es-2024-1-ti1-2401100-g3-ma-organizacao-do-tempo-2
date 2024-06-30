document.addEventListener("DOMContentLoaded", () => {
    class Kanban {
        constructor(root) {
            this.root = root;
            this.load();
            this.currentColumn = null;
  
            this.root.querySelectorAll(".kanban__add-item").forEach(button => {
                button.addEventListener("click", () => {
                    const columnEl = button.closest(".kanban__column");
                    this.currentColumn = columnEl;
                    this.openModal();
                });
            });
  
            this.root.querySelectorAll(".kanban__column-items").forEach(itemsEl => {
                itemsEl.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    itemsEl.classList.add("kanban__column-items--over");
                });
  
                itemsEl.addEventListener("dragleave", () => {
                    itemsEl.classList.remove("kanban__column-items--over");
                });
  
                itemsEl.addEventListener("drop", (e) => {
                    e.preventDefault();
                    const itemId = e.dataTransfer.getData("text/plain");
                    const itemEl = document.querySelector(`[data-id="${itemId}"]`);
  
                    const sourceColumnId = itemEl.closest(".kanban__column").dataset.id;
                    const targetColumnId = itemsEl.closest(".kanban__column").dataset.id;
  
                    if (sourceColumnId !== targetColumnId) {
                        itemsEl.appendChild(itemEl);
                        itemsEl.classList.remove("kanban__column-items--over");
                        this.save();
                    }
                });
            });
  
            document.getElementById("add-task-button").addEventListener("click", () => {
                this.addItem(this.currentColumn);
                this.closeModal();
            });
  
            document.getElementById("close-button").addEventListener("click", () => {
                this.closeModal();
            });
  
            window.addEventListener("click", (event) => {
                const modal = document.getElementById("modal");
                if (event.target == modal) {
                    this.closeModal();
                }
            });
        }
  
        openModal() {
            document.getElementById("modal").style.display = "block";
        }
  
        closeModal() {
            document.getElementById("modal").style.display = "none";
            document.getElementById("task-title").value = "";
            document.getElementById("task-desc").value = "";
        }
  
        load() {
            const data = JSON.parse(localStorage.getItem("kanban-data")) || [
                { id: "1", items: [] },
                { id: "2", items: [] },
                { id: "3", items: [] }
            ];
  
            data.forEach(column => {
                const columnEl = this.root.querySelector(`.kanban__column[data-id="${column.id}"]`);
                column.items.forEach(item => {
                    const itemEl = this.createItemElement(item.id, item.title, item.text);
                    columnEl.querySelector(".kanban__column-items").appendChild(itemEl);
                });
            });
        }
  
        save() {
            const data = Array.from(this.root.querySelectorAll(".kanban__column")).map(columnEl => {
                return {
                    id: columnEl.dataset.id,
                    items: Array.from(columnEl.querySelectorAll(".kanban__item")).map(itemEl => {
                        return {
                            id: itemEl.dataset.id,
                            title: itemEl.querySelector(".kanban__item-title").textContent,
                            text: itemEl.querySelector(".kanban__item-text").textContent
                        };
                    })
                };
            });
  
            localStorage.setItem("kanban-data", JSON.stringify(data));
        }
  
        addItem(columnEl) {
            const itemId = Date.now().toString();
            const title = document.getElementById("task-title").value;
            const text = document.getElementById("task-desc").value;
  
            const itemEl = this.createItemElement(itemId, title, text);
            columnEl.querySelector(".kanban__column-items").appendChild(itemEl);
            this.save();
        }
  
        createItemElement(id, title, text) {
            const itemEl = document.createElement("div");
            itemEl.classList.add("kanban__item");
            itemEl.draggable = true;
            itemEl.dataset.id = id;
  
            const titleEl = document.createElement("div");
            titleEl.classList.add("kanban__item-title");
            titleEl.textContent = title;
  
            const textEl = document.createElement("div");
            textEl.classList.add("kanban__item-text");
            textEl.textContent = text;
  
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("kanban__delete-item");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                itemEl.remove();
                this.save();
            });
  
            itemEl.appendChild(titleEl);
            itemEl.appendChild(textEl);
            itemEl.appendChild(deleteButton);
  
            itemEl.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", id);
            });
  
            itemEl.addEventListener("dblclick", () => {
                const newTitle = prompt("Editar o título", title);
                const newText = prompt("Editar a descrição", text);
                if (newTitle && newText) {
                    titleEl.textContent = newTitle;
                    textEl.textContent = newText;
                    this.save();
                }
            });
  
            return itemEl;
        }
    }
  
    const kanbanRoot = document.querySelector(".kanban");
    new Kanban(kanbanRoot);
  });
  