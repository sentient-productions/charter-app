import NewChat from "./NewChat";
import NavPrompt from "./NavPrompt";

const Menu = ({ chatLog, setChatLog, setShowMenu }) => {
  return (
    <div>
      {" "}
      <header>
        <div className="menu">
          <button onClick={() => setShowMenu(true)}>
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="#d9d9e3"
              strokeLinecap="round"
            >
              <path d="M21 18H3M21 12H3M21 6H3" />
            </svg>
          </button>
        </div>
        <h1>Charter</h1>
      </header>
      <nav>
        <div className="navItems">
          <NewChat setChatLog={setChatLog} setShowMenu={setShowMenu} />
          {chatLog.map(
            (chat, idx) =>
              chat.botMessage && (
                <NavPrompt chatPrompt={chat.chatPrompt} key={idx} />
              )
          )}
        </div>
        <div className="navCloseIcon">
          <svg
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            xmlSpace="preserve"
            stroke="#fff"
            width={42}
            height={42}
            onClick={() => setShowMenu(false)}
          >
            <path d="m53.691 50.609 13.467-13.467a2 2 0 1 0-2.828-2.828L50.863 47.781 37.398 34.314a2 2 0 1 0-2.828 2.828l13.465 13.467-14.293 14.293a2 2 0 1 0 2.828 2.828l14.293-14.293L65.156 67.73c.391.391.902.586 1.414.586s1.023-.195 1.414-.586a2 2 0 0 0 0-2.828L53.691 50.609z" />
          </svg>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
