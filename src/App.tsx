import "./App.css";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import Score from "./components/Score";
import { useState } from "react";
import { GameState, Player } from "./types";
import classNames from "classnames";

const players: Player[] = [
    {
        id: 1,
        name: "Player 1",
        iconClass: "fa-x",
        colorClass: "yellow",
    },
    {
        id: 2,
        name: "Player 2",
        iconClass: "fa-o",
        colorClass: "turquoise",
    }
];

function deriveGame(state: GameState) {
    const currentPlayer = players[state.currentGameMoves.length % 2];
    const winningPatterns = [
        [1, 2, 3],
        [1, 5, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 5, 7],
        [3, 6, 9],
        [4, 5, 6],
        [7, 8, 9],
    ];
    let winner = null;

    for (const player of players) {
        const selectedSquaredId = state.currentGameMoves.filter(
            (move) => move.player.id === player.id
        ).map(move => move.squareId);

        for (const pattern of winningPatterns) {
            if (pattern.every(v => selectedSquaredId.includes(v))) {
                winner = player;
            }
        }
    }
    return {
        moves: state.currentGameMoves,
        currentPlayer,
        status: {
            isComplete: winner != null || state.currentGameMoves.length === 9,
            winner,
        }
    };
}

function deriveStats(state: GameState) {
    return {
        playerWithStats: players.map(player => {
            const wins = state.history.currentRoundGames.filter((game) => game.status.winner?.id === player.id).length;
            return {
                ...player,
                wins
            }
        }),
        ties: state.history.currentRoundGames.filter(game => game.status.winner === null).length,
    };
}


export default function App() {

    const [state, setState] = useState<GameState>({
        currentGameMoves: [],
        history: {
            currentRoundGames: [],
            allGames: [],
        },
    });


    function resetGame(isNewRound: boolean) {
        setState((prev) => {
            const stateClone = structuredClone(prev);
            const { status, moves } = game;
            if (status.isComplete) {
                stateClone.history.currentRoundGames.push({
                    moves,
                    status,
                });
            }
            stateClone.currentGameMoves = [];
            if (isNewRound) {
                stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
                stateClone.history.currentRoundGames = [];
            }
            return stateClone;
        })
    }

    function handlePlayerMove(squareId: number, player: Player) {

        setState((prev) => {

            const stateClone = structuredClone(prev);

            stateClone.currentGameMoves.push({
                squareId,
                player,
            });
            return stateClone;
        })
    }

    const game = deriveGame(state);
    const stats = deriveStats(state);






    return (
        <>
            <main>
                <div className="grid">
                    <div className={classNames("turn", game.currentPlayer.colorClass)}>
                        <i className={classNames("fa-solid", game.currentPlayer.colorClass, game.currentPlayer.iconClass)}></i>
                        <p>{game.currentPlayer.name}, you're up!</p>
                    </div>

                    <Menu onReset={() => resetGame(false)} onNewRound={() => resetGame(true)} />

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(squareId => {

                        const existingMove = game.moves.find(
                            (move) => move.squareId === squareId
                        );

                        return (
                            <div key={squareId} className="square shadow" onClick={() => {
                                if (existingMove) return
                                handlePlayerMove(squareId, game.currentPlayer)
                            }}>
                                {existingMove && <i className={classNames("fa-solid", existingMove.player.colorClass, existingMove.player.iconClass)}></i>}
                            </div>
                        );
                    })}


                    <Score id="Player 1" backgroundColorValue="var(--turquoise)" win={stats.playerWithStats[0].wins} />
                    <Score id="Tie" backgroundColorValue="var(--light-gray)" win={stats.ties} textScore="" />
                    <Score id="Player 2" backgroundColorValue="var(--yellow)" win={stats.playerWithStats[1].wins} />

                </div>
            </main >
            <Footer />

            {game.status.isComplete && <Modal message={game.status.winner ? `${game.status.winner.name}` : "Tie"} onClick={() => resetGame(false)} />}

        </>)
}