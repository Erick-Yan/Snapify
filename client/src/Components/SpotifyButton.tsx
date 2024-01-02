import './SpotifyButton.css'

interface SpotifyButtonProps {
    text: string;
    className?: string;
    clickButton?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    color: string;
    href?: string
}

function SpotifyButton({ text, clickButton, className, color, href }: SpotifyButtonProps) {
    return (
        <a href={href}>
            <button 
                onClick={clickButton} 
                className={`${className} ${color === "green" ? "other2" : "other"}`}
            >{text}</button>
        </a>
        
    );
}

export default SpotifyButton;
