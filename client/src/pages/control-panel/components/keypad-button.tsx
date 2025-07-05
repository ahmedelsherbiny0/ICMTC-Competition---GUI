export default function KeypadButton({
  isClicked = false,
  buttonCharacter,
}: {
  isClicked?: boolean;
  buttonCharacter: string;
}) {
  return (
    <div className="relative h-13 w-13 rounded-xl border border-[#6E6E6E] flex items-center justify-center">
      <div
        className={`w-8 h-8 rounded-full ${
          isClicked ? "bg-active" : "bg-keypad-button"
        }  flex items-center justify-center`}
      >
        <span className="text-black font-extrabold text-xl">
          {buttonCharacter}
        </span>
      </div>
    </div>
  );
}
