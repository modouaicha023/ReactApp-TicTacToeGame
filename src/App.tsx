import "./App.css";
import Menu from "./Menu";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
export default function App() {
    const showModal = false;
    return (
        <>
            <main>
                <div className="grid">
                    <div className="turn" data-id="turn">
                        <i className="fa-solid fa-x  yellow"></i>
                        <p className="yellow">Player 1, you're up!</p>
                    </div>
                    <Menu onReset={() => console.log("")} onNewRound={() => console.log("")} />

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(squareId => {
                        return (
                            <div key={squareId} className="square shadow">
                                <i className="fa-solid fa-x yellow"></i>
                            </div>
                        );
                    })}


                    <div className="score shadow" style={{ backgroundColor: "var(--turquoise)" }}>
                        <p>Player 1</p>
                        <span data-id="p1-wins">0 Wins</span>
                    </div>
                    <div className="score shadow" style={{ backgroundColor: "var(--light-gray)" }}>
                        <p>Ties</p>
                        <span data-id="ties">0</span>
                    </div>
                    <div className="score shadow" style={{ backgroundColor: "var(--yellow)" }}>
                        <p>Player 2</p>
                        <span data-id="p2-wins">0 Wins</span>
                    </div>
                </div>
            </main>
            <Footer />

            {showModal && <Modal message="Player 1 wins!" />}

        </>)
}