import "./Score.css";

type Props = {
    id: string;
    backgroundColorValue: string;
    win: number;
    textScore?: string;
}
export default function Score({ id, backgroundColorValue, win, textScore = "Wins" }: Props) {

    return (
        <div className="score shadow" style={{ backgroundColor: backgroundColorValue }}>
            <p>{id}</p>
            <span >{win} {textScore}</span>
        </div>
    )
}

