const ROW = 4;
const COL = 4;

// 游戏数据很小，存在主逻辑中就够了
let board = new Array();  // 此时board只是一维数组
let hasConflict = new Array();  // 記錄衝突情況，避免數字連續的合并
let score = 0;

// 移动端用手指滑动的方式操控，需要记录触摸的坐标
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

$(document).ready(() => {
    prepareForMobile();
    newGame();
});

function prepareForMobile() {
    if (deviceWidth > 500) {
        gridContainerWidth = 500;
        cellWidth = 100;
        cellGap = 20;
    }

    $(".grid-container").css('width', gridContainerWidth - 2 * cellGap);
    $(".grid-container").css('height', gridContainerWidth - 2 * cellGap);
    $(".grid-container").css('padding', cellGap);
    $(".grid-container").css('border-radius', 0.02 * gridContainerWidth);

    $(".grid-cell").css('width', cellWidth);
    $(".grid-cell").css('height', cellWidth);
    $(".grid-cell").css('border-radius', 0.02 * cellWidth);
}

function newGame() {
    // 初始化棋盘
    init();

    // 在随机两个格子里生成2或4
    generateOneNum();
    generateOneNum();
}

function init() {
    // grid-cell初始化，定位到各自的位置
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            const gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i));
            gridCell.css('left', getPosLeft(j));
        }
    }

    // board初始化，每个格子设为0
    for (let i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflict[i] = new Array();
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflict[i][j] = false;
        }
    }

    score = 0;
    updateScore(score);

    // 初始化后提示前端更新view
    updateBoardView();
}

function updateBoardView() {
    // 首先把旧的number-cell都移除
    $(".number-cell").remove();

    // 接着遍历board二维数组，插入新的number-cell
    // 再根据number-cell的数字大小判断是否显示
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            $(".grid-container").append(" <div class='number-cell' id='number-cell-" + i + "-" + j + "'" + "></div> ")

            let currentNumberCell = $("#number-cell-" + i + "-" + j);
            if (board[i][j] === 0) {
                currentNumberCell.css('width', '0px');
                currentNumberCell.css('height', '0px');
                // 把空的number-cell放在中心，方便生成新数字时动画的播放
                currentNumberCell.css('top', getPosTop(i) + cellWidth / 2);
                currentNumberCell.css('left', getPosLeft(j) + cellWidth / 2);
            } else {
                currentNumberCell.css('width', cellWidth);
                currentNumberCell.css('height', cellWidth);
                currentNumberCell.css('top', getPosTop(i));
                currentNumberCell.css('left', getPosLeft(j));
                currentNumberCell.css('background-color', getNumberBgColor(board[i][j]));
                currentNumberCell.css('color', getNumberColor(board[i][j]));
                currentNumberCell.text(board[i][j]);
            }

            hasConflict[i][j] = false;  // 刷新
        }
    }

    $(".number-cell").css('line-height', cellWidth + 'px');
    $(".number-cell").css('font-size', 0.6 * cellWidth + 'px');
}

function generateOneNum() {
    if (noSpace(board)) {
        return false;
    }

    // 随机生成一个位置，在0-3之间
    // Math.random()函数会生成一个0-1之间的浮点数
    // 注意，Math.floor()仍然保持浮点数的格式，作为坐标
    // 还要用parseInt()转成整型
    let randX = parseInt(Math.floor(Math.random() * 4));
    let randY = parseInt(Math.floor(Math.random() * 4));

    // 游戲進行到後面可能會在這部分耗時嚴重，所以盡量不用死循環
    let count = 0;
    while (count < 50) {
        if (board[randX][randY] === 0)
            break;
        randX = parseInt(Math.floor(Math.random() * 4));
        randY = parseInt(Math.floor(Math.random() * 4));
        count++;
    }
    if (count === 50) {
        for (let i = 0; i < ROW; i++) {
            for (let j = 0; j < COL; j++) {
                if (board[i][j] === 0) {
                    randX = i;
                    randY = j;
                }
            }
        }
        count = 0;
    }

    // 随机生成2或4
    let randNum = Math.random() < 0.5 ? 2 : 4;

    // 在随机位置显示随机数字
    board[randX][randY] = randNum;

    // 生成新数字有动画，所以用特别的函数
    showNumberWithAnimation(randX, randY, randNum);

    return true;
}

$(document).keydown((e) => {
    switch (e.keyCode) {
        case 37: // left
            e.preventDefault();
            // moveLeft()要判斷能否向左移動，
            // 如果不行的話，就break，不造成任何效果
            if (moveLeft()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 300);
            }
            break;
        case 38: // up
            e.preventDefault();
            if (moveUp()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 300);
            }
            break;
        case 39: // right
            e.preventDefault();
            if (moveRight()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 300);
            }
            break;
        case 40: // down
            e.preventDefault();
            if (moveDown()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 300);
            }
            break;
        default:
            break;
    }
})

document.addEventListener('touchstart', (e) => {
    // 单点触控
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
});

document.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;

    dx = endX - startX;
    dy = endY - startY;

    if (Math.abs(dx) < deviceWidth * 0.3 && Math.abs(dy) < deviceWidth * 0.3) {
        // 点击，没有滑动意图
        return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
        // 横向移动
        if (dx > 0) {
            // 右
            if (moveRight()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 300);
            }
        } else {
            // 左
            if (moveLeft()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 300);
            }
        }
    } else {
        // 纵向移动
        if (dy > 0) {
            // 下
            if (moveDown()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 300);
            }
        }
        else {
            // 上
            if (moveUp()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 300);
            }
        }
    }
});

function isGameOver() {
    if (noSpace(board) && noMove(board)) {
        gameOver();
    }
}

function gameOver() {
    alert("Game Over!");
    console.log("Game Over.")
}

function moveLeft() {
    if (!canMoveLeft(board))
        return false;

    // move left執行動作
    for (let i = 0; i < ROW; i++) {
        for (let j = 1; j < COL; j++) {
            // 不等於0，有可能向左移動
            if (board[i][j] !== 0) {
                for (let k = 0; k < j; k++) {
                    // 第一種可能，落脚點是空的且途中沒障礙
                    if (board[i][k] === 0 && noBlockHorizontal(i, k, j, board)) {
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    // 第二種可能，落脚點有個一樣的數字且途中沒障礙
                    if (board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflict[i][k]) {
                        // move and merge
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        // When merge happens, score increse
                        score += board[i][k];
                        updateScore(score); // update UI
                        hasConflict[i][k] = true;
                        break;
                    }
                }
            }
        }
    }

    // 循環太快，來不及顯示動畫，所以update函數要延遲執行
    setTimeout(updateBoardView, 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board))
        return false;

    // move right執行動作
    for (let i = 0; i < ROW; i++) {
        for (let j = COL - 2; j >= 0; j--) {
            // 不等於0，有可能向右移動
            if (board[i][j] !== 0) {
                for (let k = COL - 1; k > j; k--) {
                    // 第一種可能，落脚點是空的且途中沒障礙
                    if (board[i][k] === 0 && noBlockHorizontal(i, j, k, board)) {
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    // 第二種可能，落脚點有個一樣的數字且途中沒障礙
                    if (board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflict[i][k]) {
                        // move and merge
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        // When merge happens, score increse
                        score += board[i][k];
                        updateScore(score); // update UI
                        hasConflict[i][k] = true;
                        break;
                    }
                }
            }
        }
    }

    // 循環太快，來不及顯示動畫，所以update函數要延遲執行
    setTimeout(updateBoardView, 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board))
        return false;

    // move up執行動作
    for (let j = 0; j < COL; j++) {
        for (let i = 1; i < ROW; i++) {
            // 不等於0，有可能向上移動
            if (board[i][j] !== 0) {
                for (let k = 0; k < i; k++) {
                    // 第一種可能，落脚點是空的且途中沒障礙
                    if (board[k][j] === 0 && noBlockVertical(j, k, i, board)) {
                        // move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    // 第二種可能，落脚點有個一樣的數字且途中沒障礙
                    if (board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflict[i][k]) {
                        // move and merge
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        // When merge happens, score increse
                        score += board[k][j];
                        updateScore(score); // update UI
                        hasConflict[i][k] = true;
                        break;
                    }
                }
            }
        }
    }

    // 循環太快，來不及顯示動畫，所以update函數要延遲執行
    setTimeout(updateBoardView, 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board))
        return false;

    // move down執行動作
    for (let j = 0; j < COL; j++) {
        for (let i = ROW - 2; i >= 0; i--) {
            // 不等於0，有可能向下移動
            if (board[i][j] !== 0) {
                for (let k = ROW - 1; k > i; k--) {
                    // 第一種可能，落脚點是空的且途中沒障礙
                    if (board[k][j] === 0 && noBlockVertical(j, i, k, board)) {
                        // move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    // 第二種可能，落脚點有個一樣的數字且途中沒障礙
                    if (board[k][j] === board[i][j] && noBlockVertical(j, i, k, board) && !hasConflict[i][k]) {
                        // move and merge
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        // When merge happens, score increse
                        score += board[k][j];
                        updateScore(score); // update UI
                        hasConflict[i][k] = true;
                        break;
                    }
                }
            }
        }
    }

    // 循環太快，來不及顯示動畫，所以update函數要延遲執行
    setTimeout(updateBoardView, 200);
    return true;
}