import {TILE_STATUSES, createBoard, revealTile, markTile} from "./minesweeperLogic.js"

const boardElement = document.querySelector("#board")!

const BOARD_SIZE = 10
const MINES_COUNT = 5

const minesweeperBoard = createBoard(BOARD_SIZE, MINES_COUNT)

minesweeperBoard.tiles.forEach((row) => {
    row.forEach((tile) => {
        boardElement.appendChild(tile.element)

        tile.element.addEventListener("click", () => {
            revealTile(tile, minesweeperBoard)
        })

        tile.element.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            markTile(tile)
        })
    })
})

