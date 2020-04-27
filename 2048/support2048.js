const CELL_SIZE = 100;
const CELL_GAP = 20;

let deviceWidth = window.screen.availWidth;
let gridContainerWidth = 0.92 * deviceWidth;
let cellWidth = 0.18 * deviceWidth;
let cellGap = 0.04 * deviceWidth;

function getPosTop(row) {
    return cellGap + (cellWidth + cellGap) * row;
}

function getPosLeft(col) {
    return cellGap + (cellWidth + cellGap) * col;
}

function getNumberBgColor(number) {
    switch (number) {
        case 2:
            return '#eee4da';
        case 4:
            return '#ede0c8';
        case 8:
            return '#f2b179';
        case 16:
            return '#f59563';
        case 32:
            return '#f67e5f';
        case 64:
            return '#f65e3b';
        case 128:
            return '#edcf72';
        case 256:
            return '#edcc61';
        case 512:
            return '#9c0';
        case 1024:
            return '#33b5e5';
        case 2048:
            return '#09c';
        case 4096:
            return '#a6c';
        case 8192:
            return '#93c';
        default:
            return '#000';
    }
}

function getNumberColor(number) {
    if (number <= 4) {
        return '#776e56';
    }

    return '#fff';
}

function noSpace(board) {
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            if (board[i][j] === 0)
                return false;
        }
    }
    return true;
}

function canMoveLeft(board) {
    for (let i = 0; i < ROW; i++) {
        for (let j = 1; j < COL; j++) {
            if (board[i][j] !== 0) {
                if (board[i][j - 1] === 0 || board[i][j - 1] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(board) {
    for (let i = 0; i < ROW; i++) {
        for (let j = COL - 2; j >= 0; j--) {
            if (board[i][j] !== 0) {
                if (board[i][j + 1] === 0 || board[i][j + 1] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(board) {
    for (let j = 0; j < COL; j++) {
        for (let i = 1; i < ROW; i++) {
            if (board[i][j] !== 0) {
                if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board) {
    for (let j = 0; j < COL; j++) {
        for (let i = ROW - 2; i >= 0; i--) {
            if (board[i][j] !== 0) {
                if (board[i + 1][j] === 0 || board[i + 1][j] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockHorizontal(row, start, end, board) {
    for (let i = start + 1; i < end; i++) {
        if (board[row][i] !== 0)
            return false;
    }
    return true;
}

function noBlockVertical(col, start, end, board) {
    for (let i = start + 1; i < end; i++) {
        if (board[i][col] !== 0)
            return false;
    }
    return true;
}

function noMove(board) {
    if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board))
        return false;
    return true;
}