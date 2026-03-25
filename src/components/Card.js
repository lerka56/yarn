export class Card {
    constructor(id, text, columnId, onDelete, onDragStart, onDragEnd) {
        this.id = id;
        this.text = text;
        this.columnId = columnId;
        this.onDelete = onDelete;
        this.onDragStart = onDragStart;
        this.onDragEnd = onDragEnd;
        this.element = null;
    }

    render() {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', this.id);
        card.setAttribute('data-column', this.columnId);
        card.setAttribute('draggable', 'true');
        
        const textSpan = document.createElement('span');
        textSpan.textContent = this.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-card';
        deleteBtn.innerHTML = '✕';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            this.onDelete(this.id, this.columnId);
        };
        
        card.appendChild(textSpan);
        card.appendChild(deleteBtn);
        
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                id: this.id,
                text: this.text,
                columnId: this.columnId
            }));
            e.dataTransfer.effectAllowed = 'move';
            card.classList.add('dragging');
            this.onDragStart(e, card);
        });
        
        card.addEventListener('dragend', (e) => {
            card.classList.remove('dragging');
            this.onDragEnd(e);
        });
        
        this.element = card;
        return card;
    }
}