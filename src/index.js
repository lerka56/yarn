import './styles.css';
import { Board } from './components/Board.js';

document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.getElementById('board');
    const board = new Board(boardContainer);
    board.render();
});