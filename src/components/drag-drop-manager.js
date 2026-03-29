export class DragDropManager {
    constructor() {
        this.placeholder = null;
        this.draggedCard = null;
    }

    setupColumnDragAndDrop(container, columnId, onCardMove) {
        container.addEventListener('dragover', (e) => this.handleDragOver(e, container));
        container.addEventListener('dragleave', (e) => this.handleDragLeave(e, container));
        container.addEventListener('drop', (e) => this.handleDrop(e, container, columnId, onCardMove));
    }

    handleDragOver(e, container) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const draggingCard = document.querySelector('.card.dragging');
        if (!draggingCard) return;
        
        const afterElement = this.getDragAfterElement(container, e.clientY);
        
        // Удаляем старый placeholder
        if (this.placeholder) {
            this.placeholder.remove();
        }
        
        this.placeholder = document.createElement('div');
        this.placeholder.className = 'drag-placeholder';
        
        if (afterElement) {
            afterElement.parentNode.insertBefore(this.placeholder, afterElement);
        } else {
            container.appendChild(this.placeholder);
        }
    }

    handleDragLeave(e, container) {
        if (this.placeholder && !container.contains(e.relatedTarget)) {
            this.placeholder.remove();
            this.placeholder = null;
        }
    }

    handleDrop(e, container, targetColumnId, onCardMove) {
        e.preventDefault();
        
        if (!this.placeholder) return;
        
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        
        // Исправленное определение позиции
        let newIndex = this.calculateNewIndex(container, this.placeholder);
        
        if (data.columnId !== targetColumnId) {
            onCardMove(data.id, data.columnId, targetColumnId, null);
        } else {
            onCardMove(data.id, data.columnId, targetColumnId, newIndex);
        }
        
        this.placeholder.remove();
        this.placeholder = null;
    }

    calculateNewIndex(container, placeholder) {
        // Получаем все карточки в контейнере
        const cards = Array.from(container.children).filter(child => 
            child.classList && child.classList.contains('card')
        );
        
        // Находим индекс placeholder среди всех детей контейнера
        const placeholderIndex = Array.from(container.children).indexOf(placeholder);
        
        // Находим индекс первой карточки, которая находится после placeholder
        const newIndex = cards.findIndex(card => 
            Array.from(container.children).indexOf(card) > placeholderIndex
        );
        
        // Если карточка не найдена (placeholder в конце), возвращаем длину массива
        return newIndex === -1 ? cards.length : newIndex;
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    handleDragStart(card) {
        card.style.opacity = '0.5';
        this.draggedCard = card;
    }

    handleDragEnd() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '';
        });
        
        if (this.placeholder) {
            this.placeholder.remove();
            this.placeholder = null;
        }
        
        this.draggedCard = null;
    }
}