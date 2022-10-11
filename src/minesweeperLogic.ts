export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    REVEALED: "revealed",
    MARKED: "marked",
}

type tileType = {
    row: number;
    col: number;
    element: HTMLDivElement;
    hasMine: boolean;
    status: string;
}

type boardType = tileType[][]

type mineType = {
    row: number,
    col: number
} 

export function createBoard(boardSize: number, minesCount: number) {
    const mines = createMinesPositions(minesCount)
    let board: boardType = []

    for (let row = 0; row < boardSize; row++) {
        let rowArr: tileType[] = []
        for (let col = 0; col < boardSize; col++) {
            const tileElement = document.createElement("div")

            const tile: tileType = {
                row,
                col,
                element: tileElement,
                hasMine: mines.some((mine) => positionMatch(mine, { row, col })),
                status: TILE_STATUSES.HIDDEN,
            }

            rowArr.push(tile)
        }

        board.push(rowArr)
    }

    return board
}

export function revealTile(tile: tileType,  board: boardType) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return
    }

    if (tile.hasMine) {
        tile.status = TILE_STATUSES.MINE
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

export function markTile(tile: tileType) {}

function createMinesPositions(mineCount: number) {
    let minesPositions: mineType[]  = []

    while (minesPositions.length < mineCount) {
        const mine: mineType = {
            row: Math.floor(Math.random() * 10),
            col: Math.floor(Math.random() * 10),
        }

        if (!minesPositions.includes(mine)) {
            minesPositions.push(mine)
        }
    }

    return minesPositions
}

function getAdjacentTiles(board: boardType, { row, col }: mineType) {
    let tiles = []

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
            const tile = board[row + rowOffset]?.[col + colOffset]
            if (tile) {
                tiles.push(tile)
            }
        }
    }

    return tiles
}

function positionMatch(a: mineType | tileType, b: mineType | tileType) {
    return a.row == b.row && a.col == b.col
}
