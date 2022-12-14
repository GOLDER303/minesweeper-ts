export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    REVEALED: "revealed",
    MARKED: "marked",
}

export enum GAME_STATE {
    WIN,
    LOSS,
    NOT_ENDED
}

class Mine {
    constructor(public row: number, public col: number) {}
}

class Tile {
    row: number
    col: number
    element: HTMLDivElement
    status: string
    hasMine: boolean

    constructor(row: number, col: number, element: HTMLDivElement, status: string) {
        this.row = row
        this.col = col
        this.element = element
        this.status = status
        this.hasMine = false
    }
}

class MinesweeperBoard {
    tiles: Tile[][]
    minesSet: boolean
    size: number
    minesCount: number

    constructor(size: number, minesCount: number) {
        this.tiles = []
        this.minesSet = false
        this.size = size
        this.minesCount = minesCount
    }

    setMinesPositions(playerClick: { row: number; col: number }) {
        const mines = createMinesPositions(this.minesCount, playerClick)
        mines.forEach((mine) => {
            this.tiles[mine.row][mine.col].hasMine = true
        })
        this.minesSet = true
    }
}

export function createBoard(boardSize: number, minesCount: number) {
    document.querySelector("#minesCount")!.innerHTML = minesCount.toString()

    const board = new MinesweeperBoard(boardSize, minesCount)

    for (let row = 0; row < boardSize; row++) {
        let rowArr: Tile[] = []
        for (let col = 0; col < boardSize; col++) {
            const tileElement = document.createElement("div")

            const tile = new Tile(row, col, tileElement, TILE_STATUSES.HIDDEN)

            rowArr.push(tile)
        }

        board.tiles.push(rowArr)
    }

    return board
}

export function revealTile(tile: Tile, board: MinesweeperBoard) {
    if (!board.minesSet) {
        board.setMinesPositions(tile)
    }

    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return
    }

    if (tile.hasMine) {
        tile.status = TILE_STATUSES.MINE
        tile.element.classList.add("revealed")
        tile.element.classList.add("mine")
        tile.element.classList.add("red-bg")
        return
    }

    tile.status = TILE_STATUSES.REVEALED
    tile.element.classList.add("revealed")

    const adjacentTiles = getAdjacentTiles(board, { row: tile.row, col: tile.col })
    const adjacentMines = adjacentTiles.filter((tile) => tile.hasMine)

    if (adjacentMines.length == 0) {
        adjacentTiles.forEach((tile) => revealTile(tile, board))
    } else {
        tile.element.textContent = adjacentMines.length.toString()
    }
}

export function markTile(tile: Tile) {
    const markedTilesCounter = document.querySelector("#minesCount")!

    if(tile.status === TILE_STATUSES.HIDDEN) {
        tile.status = TILE_STATUSES.MARKED
        tile.element.classList.add("marked")
        markedTilesCounter.innerHTML = (+markedTilesCounter.innerHTML - 1).toString()
    }
    else if(tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN
        tile.element.classList.remove("marked")
        markedTilesCounter.innerHTML = (+markedTilesCounter.innerHTML + 1).toString()
    }

}

function createMinesPositions(mineCount: number, clickedTile: { row: number; col: number }) {
    let minesPositions: Mine[] = []

    while (minesPositions.length < mineCount) {
        const mine = new Mine(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10))

        if (!minesPositions.includes(mine) && mine != clickedTile) {
            minesPositions.push(mine)
        }
    }

    return minesPositions
}

function getAdjacentTiles(board: MinesweeperBoard, { row, col }: Mine) {
    let tiles: Tile[] = []

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
            const tile = board.tiles[row + rowOffset]?.[col + colOffset]
            if (tile) {
                tiles.push(tile)
            }
        }
    }

    return tiles
}

export function checkWin(board: MinesweeperBoard) {
    let lost = false
    let win = false

    lost = board.tiles.some(row => {
        return row.some( tile => {
            return tile.status == TILE_STATUSES.MINE
        })
    })

    win = board.tiles.every(row => {
        return row.every(tile => {
            return (tile.status == TILE_STATUSES.REVEALED || (tile.hasMine && (tile.status === TILE_STATUSES.MARKED || tile.status === TILE_STATUSES.HIDDEN)))
           
        })
    })

    if(win) {
        return GAME_STATE.WIN
    }
    else if(lost) {
        return GAME_STATE.LOSS
    }
    else {
        return GAME_STATE.NOT_ENDED
    }
}

function positionMatch(a: Mine | Tile, b: Mine | Tile) {
    return a.row == b.row && a.col == b.col
}
