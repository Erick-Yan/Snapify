import './SpotifyButton.css'

interface SpotifyButtonProps {
    text: string;
    className?: string;
    clickButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    color: string;
}

function SpotifyButton({ text, clickButton, className, color }: SpotifyButtonProps) {
    return (
        <button 
            onClick={clickButton} 
            className={`${className} ${color === "green" ? "other2" : "other"}`}
        >{text}</button>
    );
}

export default SpotifyButton;
