import { BOARD_LENGTH } from "../constants/constants";
import { Board } from "./types";

export const getBlankBoard = (): Board => Array.from(
    { length: BOARD_LENGTH },
    () => Array<0>(BOARD_LENGTH).fill(0),
);

export const boardToString = (board: Board): string => {
    return board.map((row) => row.join("")).join("");
};

export const stringToBoard = (str: string): Board => {
    if (str.length !== BOARD_LENGTH * BOARD_LENGTH) {
        throw new Error("Invalid parameter");
    }

    const board: Board = [];
    for (let i = 0; i < BOARD_LENGTH; ++i) {
        const row: (0 | 1)[] = [];
        for (let j = 0; j < BOARD_LENGTH; ++j) {
            const val = Number(str[i * BOARD_LENGTH + j]);
            if (val !== 0 && val !== 1) {
                return getBlankBoard();
            }

            row.push(val);
        }

        board.push(row);
    }

    return board;
};

export const stepBoard = (board: Board): Board => {
    const newBoard: Board = [];

    /**
     * @todo [Step 1] 请在下面两条注释之间的区域填写你的代码完成该游戏的核心逻辑
     * @note 你可以使用命令 yarn test step 来运行我们编写的单元测试与我们提供的参考实现对拍
     */
    // Step 1 BEGIN
    for(let i = 0; i < BOARD_LENGTH; i++){
        const row: (0|1)[] = [];
        for(let j = 0; j < BOARD_LENGTH; j++){
            let aliveNeibor = 0;
            const up = i===0 ? BOARD_LENGTH-1 : i-1;
            const down = i===BOARD_LENGTH-1 ? 0 : i+1;
            const left = j===0 ? BOARD_LENGTH-1 : j-1;
            const right = j===BOARD_LENGTH-1 ? 0 : j+1;
            const neibors = [
                [up , left],[up , j],[up , right],
                [i ,  left],         [i ,  right],
                [down,left],[down,j],[down,right]
            ];
            neibors.forEach((neibor) => {
                if(board[neibor[0]][neibor[1]] === 1){
                    aliveNeibor++;
                }
            });
            if(board[i][j] === 1){
                row.push((aliveNeibor === 2 || aliveNeibor === 3) ? 1 : 0);
            }
            else{
                row.push(aliveNeibor===3 ? 1 : 0);
            }
        }
        newBoard.push(row);
    }
    // Step 1 END

    return newBoard;
};

export const flipCell = (board: Board, i: number, j: number): Board => {
    /**
     * @todo [Step 3] 请在下面两条注释之间的区域填写你的代码完成切换细胞状态的任务
     * @note 你可以使用命令 yarn test flip 来运行我们编写的单元测试以检验自己的实现
     */
    // Step 3 BEGIN
    const newBoard: Board = [];
    for(let x = 0; x < BOARD_LENGTH; x++){
        const row: (0|1)[] = [];
        for(let y = 0; y < BOARD_LENGTH; y++){
            if(x===i && y===j){
                row.push(board[x][y] === 0 ? 1 : 0);
            }
            else{
                row.push(board[x][y]);
            }
        }
        newBoard.push(row);
    }
    return newBoard;
    // Step 3 END

    /**
     * @note 该 return 语句是为了在填入缺失代码前也不至于触发 ESLint Error
     */
    throw new Error("This line should be unreachable.");
    return board;
};
