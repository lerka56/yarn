import { Card } from './Card.js';

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
        
        this.setupDragAndDrop(column, cardsContainer);
        
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
                this.handleDragStart.bind(this),
                this.handleDragEnd.bind(this)
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
            }
        };
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '✕';
        cancelBtn.onclick = () => {
            form.remove();
            this.isAdding = false;
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
    
    setupDragAndDrop(column, container) {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const draggingCard = document.querySelector('.card.dragging');
            if (!draggingCard) return;
            
            const afterElement = this.getDragAfterElement(container, e.clientY);
            const currentCard = container.querySelector('.card:not(.dragging)');
            
            if (!container.querySelector('.drag-placeholder')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'drag-placeholder';
                
                if (afterElement) {
                    afterElement.parentNode.insertBefore(placeholder, afterElement);
                } else {
                    container.appendChild(placeholder);
                }
            }
        });
        
        container.addEventListener('dragleave', (e) => {
            const placeholder = container.querySelector('.drag-placeholder');
            if (placeholder) {
                placeholder.remove();
            }
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            
            const placeholder = container.querySelector('.drag-placeholder');
            if (!placeholder) return;
            
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const targetColumnId = this.id;
            
            if (data.columnId !== targetColumnId) {
                this.onCardMove(data.id, data.columnId, targetColumnId, null);
            } else {
                const cards = Array.from(container.children).filter(child => 
                    child.classList && child.classList.contains('card')
                );
                const newIndex = cards.indexOf(placeholder.nextElementSibling);
                this.onCardMove(data.id, data.columnId, targetColumnId, newIndex);
            }
            
            placeholder.remove();
        });
    }
    
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    handleDragStart(e, card) {
        card.style.opacity = '0.5';
    }
    
    handleDragEnd(e) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '';
        });
        
        const placeholders = document.querySelectorAll('.drag-placeholder');
        placeholders.forEach(p => p.remove());
    }
}