import { createBoard, revealTile, markTile, checkWin, GAME_STATE, TILE_STATUSES } from "./minesweeperLogic.js"

const boardElement = document.querySelector("#board")!
const gameResultElement = document.querySelector("#gameResult")!

const BOARD_SIZE = 10
const MINES_COUNT = 5

let gameNotEnded = true

const minesweeperBoard = createBoard(BOARD_SIZE, MINES_COUNT)

minesweeperBoard.tiles.forEach((row) => {
    row.forEach((tile) => {
        boardElement.appendChild(tile.element)

        tile.element.addEventListener("click", () => {
            if (gameNotEnded) {
                revealTile(tile, minesweeperBoard)
                checkGameEnd()
            }
        })

        tile.element.addEventListener("contextmenu", (e) => {
            if (gameNotEnded) {
                e.preventDefault()
                markTile(tile)
                checkGameEnd()
            }
        })
    })
})

function checkGameEnd() {
    const gameState = checkWin(minesweeperBoard)
    if (gameState === GAME_STATE.NOT_ENDED) {
        return
    }

    gameNotEnded = false

    if (gameState === GAME_STATE.WIN) {
        gameResultElement.textContent = "You Won!"
        gameResultElement.classList.add("game-won")

        minesweeperBoard.tiles.forEach((row) => {
            row.forEach((tile) => {
                if (tile.hasMine) {
                    tile.element.classList.add("marked")
                }
            })
        })
    } else {
        gameResultElement.textContent = "You Lost!"
        gameResultElement.classList.add("game-lost")

        minesweeperBoard.tiles.forEach((row) => {
            row.forEach((tile) => {
                if (tile.status === TILE_STATUSES.MARKED) {
                    markTile(tile)
                }
                if (tile.hasMine) {
                    tile.element.classList.add("mine", "revealed")
                }
            })
        })
    }
}
