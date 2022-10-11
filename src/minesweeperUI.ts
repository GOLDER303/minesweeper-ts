import {TILE_STATUSES, createBoard, revealTile, markTile} from "./minesweeperLogic.js"

const boardElement = document.querySelector("#board")!

const BOARD_SIZE = 10
const MINES_COUNT = 5

const board = createBoard(BOARD_SIZE, MINES_COUNT)

board.forEach((row) => {
    row.forEach((tile) => {
        boardElement.appendChild(tile.element)

        tile.element.addEventListener("click", () => {
            revealTile(tile, board)
        })

        tile.element.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            markTile(tile)
        })
    })
})

