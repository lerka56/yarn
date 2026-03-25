import { Column } from './Column.js';
import { loadBoard, saveBoard } from '../utils/storage.js';

export class Board {
    constructor(container) {
        this.container = container;
        this.board = loadBoard();
        this.nextCardId = this.getNextCardId();
    }
    
    getNextCardId() {
        let maxId = 0;
        this.board.columns.forEach(column => {
            column.cards.forEach(card => {
                if (card.id > maxId) maxId = card.id;
            });
        });
        return maxId + 1;
    }
    
    render() {
        this.container.innerHTML = '';
        
        this.board.columns.forEach(column => {
            const columnComponent = new Column(
                column.id,
                column.title,
                column.cards,
                this.deleteCard.bind(this),
                this.moveCard.bind(this),
                this.addCard.bind(this)
            );
            this.container.appendChild(columnComponent.render());
        });
    }
    
    deleteCard(cardId, columnId) {
        const column = this.board.columns.find(col => col.id === columnId);
        if (column) {
            column.cards = column.cards.filter(card => card.id !== cardId);
            this.saveAndRender();
        }
    }
    
    addCard(columnId, text) {
        const column = this.board.columns.find(col => col.id === columnId);
        if (column) {
            column.cards.push({
                id: this.nextCardId++,
                text: text
            });
            this.saveAndRender();
        }
    }
    
    moveCard(cardId, sourceColumnId, targetColumnId, targetIndex) {
        const sourceColumn = this.board.columns.find(col => col.id === sourceColumnId);
        const targetColumn = this.board.columns.find(col => col.id === targetColumnId);
        
        if (!sourceColumn || !targetColumn) return;
        
        const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
        if (cardIndex === -1) return;
        
        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        
        if (targetIndex !== null && targetIndex !== undefined && sourceColumnId === targetColumnId) {
            targetColumn.cards.splice(targetIndex, 0, card);
        } else {
            targetColumn.cards.push(card);
        }
        
        this.saveAndRender();
    }
    
    saveAndRender() {
        saveBoard(this.board);
        this.render();
    }
}