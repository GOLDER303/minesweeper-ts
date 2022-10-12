export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    REVEALED: "revealed",
    MARKED: "marked",
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
        board.setMinesPositions({ ...tile })
    }

    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return
    }

    if (tile.hasMine) {
        tile.status = TILE_STATUSES.MINE
        tile.element.textContent = "X"
        return
    }

    tile.status = TILE_STATUSES.REVEALED

    const adjacentTiles = getAdjacentTiles(board, { row: tile.row, col: tile.col })
    const adjacentMines = adjacentTiles.filter((tile) => tile.hasMine)

    if (adjacentMines.length == 0) {
        adjacentTiles.forEach((tile) => revealTile(tile, board))
    } else {
        tile.element.textContent = adjacentMines.length.toString()
    }
}

export function markTile(tile: Tile) {}

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

function positionMatch(a: Mine | Tile, b: Mine | Tile) {
    return a.row == b.row && a.col == b.col
}
