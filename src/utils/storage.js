const STORAGE_KEY = 'trello_board';

const defaultBoard = {
    columns: [
        { id: 'todo', title: 'To Do', cards: [] },
        { id: 'in-progress', title: 'In Progress', cards: [] },
        { id: 'done', title: 'Done', cards: [] }
    ]
};

export function loadBoard() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultBoard;
}

export function saveBoard(board) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}