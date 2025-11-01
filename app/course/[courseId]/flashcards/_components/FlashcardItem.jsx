import React from "react";
import ReactCardFlip from "react-card-flip";

function FlashcardItem({ isFlipped, handleClick, flashcard }) {
  return (
    <div className="flex items-center justify-center mt-10">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        {/* Front side of the card (red → blue gradient) */}
        <div>
          <h2
            className="p-4 bg-gradient-to-r from-red-500 to-blue-600 text-white flex items-center justify-center rounded-lg cursor-pointer shadow-lg h-[250px] w-[200px] md:h-[350px] md:w-[300px]"
            onClick={handleClick}
          >
            {flashcard?.front}
          </h2>
        </div>

        {/* Back side of the card (soft red → blue background) */}
        <div>
          <h2
            className="p-4 bg-gradient-to-r from-red-100 to-blue-100 shadow-lg text-primary flex items-center justify-center rounded-lg cursor-pointer h-[250px] w-[200px] md:h-[350px] md:w-[300px]"
            onClick={handleClick}
          >
            {flashcard?.back}
          </h2>
        </div>
      </ReactCardFlip>
    </div>
  );
}

export default FlashcardItem;
