import { Card } from './Card.js';
import { DragDropManager } from './drag-drop-manager.js';

export class Column {
    constructor(id, title, cards, onCardDelete, onCardMove, onCardAdd) {
        this.id = id;
        this.title = title;
        this.cards = cards;
        this.onCardDelete = onCardDelete;
        this.onCardMove = onCardMove;
        this.onCardAdd = onCardAdd;
        this.element = null;
        this.isAdding = false;
        this.dragDropManager = new DragDropManager();
    }

    render() {
        const column = document.createElement('div');
        column.className = 'column';
        column.setAttribute('data-column-id', this.id);
        
        const header = document.createElement('div');
        header.className = 'column-header';
        header.textContent = this.title;
        
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
        cardsContainer.setAttribute('data-container-id', this.id);
        
        this.renderCards(cardsContainer);
        
        const addButton = document.createElement('button');
        addButton.className = 'add-card-btn';
        addButton.textContent = '+ Add another card';
        addButton.onclick = () => this.showAddForm(column, cardsContainer);
        
        column.appendChild(header);
        column.appendChild(cardsContainer);
        column.appendChild(addButton);
        
        // Используем менеджер Drag and Drop
        this.dragDropManager.setupColumnDragAndDrop(
            cardsContainer, 
            this.id, 
            this.onCardMove
        );
        
        this.element = column;
        return column;
    }
    
    renderCards(container) {
        container.innerHTML = '';
        this.cards.forEach(card => {
            const cardComponent = new Card(
                card.id,
                card.text,
                this.id,
                this.onCardDelete,
                (e, cardElement) => this.dragDropManager.handleDragStart(cardElement),
                () => this.dragDropManager.handleDragEnd()
            );
            container.appendChild(cardComponent.render());
        });
    }
    
    showAddForm(column, container) {
        if (this.isAdding) return;
        this.isAdding = true;
        
        const form = document.createElement('div');
        form.className = 'card-form';
        
        const textarea = document.createElement('textarea');
        textarea.rows = 3;
        textarea.placeholder = 'Enter a title for this card...';
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'card-form-buttons';
        
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add Card';
        addBtn.onclick = () => {
            const text = textarea.value.trim();
            if (text) {
                this.onCardAdd(this.id, text);
                form.remove();
                this.isAdding = false;
                const addButton = column.querySelector('.add-card-btn');
                addButton.style.display = 'flex';
            }
        };
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '✕';
        cancelBtn.onclick = () => {
            form.remove();
            this.isAdding = false;
            const addButton = column.querySelector('.add-card-btn');
            addButton.style.display = 'flex';
        };
        
        buttonsDiv.appendChild(addBtn);
        buttonsDiv.appendChild(cancelBtn);
        form.appendChild(textarea);
        form.appendChild(buttonsDiv);
        
        const addButton = column.querySelector('.add-card-btn');
        addButton.style.display = 'none';
        column.insertBefore(form, addButton);
        
        textarea.focus();
    }
}