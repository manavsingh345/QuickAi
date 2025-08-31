import "./Sidebar.css"
export default function Sidebar(){
    return(
        <section className="Sidebar flex flex-col justify-between h-screen">
            <button className="flex justify-between items-center cursor-pointer">
                <img src="src\assets\blacklogo.png" alt="chatgptLogo" className="logo"/>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                <li>History1</li>
                <li>History2</li>
                <li>History3</li>
            </ul>

            <div className="sign">
                <p>Apna College</p>
            </div>
        </section>
    )
};