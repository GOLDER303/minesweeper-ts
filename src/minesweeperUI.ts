import { createBoard, revealTile, markTile, checkWin, GAME_STATE } from "./minesweeperLogic.js"

const boardElement = document.querySelector("#board")!

const BOARD_SIZE = 10
const MINES_COUNT = 5

const minesweeperBoard = createBoard(BOARD_SIZE, MINES_COUNT)

minesweeperBoard.tiles.forEach((row) => {
    row.forEach((tile) => {
        boardElement.appendChild(tile.element)

        tile.element.addEventListener("click", () => {
            revealTile(tile, minesweeperBoard)
            checkGameEnd()
        })

        tile.element.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            markTile(tile)
            checkGameEnd()
        })
    })
})

function checkGameEnd() {
    const gameState = checkWin(minesweeperBoard)
    switch (gameState) {
        case GAME_STATE.Win:

            // win
            break

        case GAME_STATE.Lose:

            // lost
            break

        case GAME_STATE.NotEnded:

            return
    }
}
