function showNumberWithAnimation(randX, randY, randNum) {
    const numberCell = $("#number-cell-" + randX + "-" + randY);

    numberCell.css('background-color', getNumberBgColor(randNum));
    numberCell.css('color', getNumberColor(randNum));
    numberCell.text(randNum);

    numberCell.animate({
        width: cellWidth,
        height: cellWidth,
        top: getPosTop(randX),
        left: getPosLeft(randY)
    }, 50) // animation duration 50ms
}

function showMoveAnimation(fromX, fromY, toX, toY) {
    const numberCell = $('#number-cell-' + fromX + '-' + fromY);
    numberCell.animate({
        top: getPosTop(toX),
        left: getPosLeft(toY)
    }, 200)
}

function updateScore(score) {
    $("#score").text(score);
}