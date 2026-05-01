import "./CircularButton.css"

function CircularButton({text, onClick, type = "button"}){
    return(
        <button className= "circular-btn" type={type} onClick={onClick}>
            {text}
        </button>
    );
}

export default CircularButton; 