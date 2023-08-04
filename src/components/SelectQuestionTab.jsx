import React from "react";

export default function SelectQuestionTab({
  questions,
  answeredQuestions,
  setAnsweredQuestions,
  setQuestionIndex,
  setCurrentTab
}) {
  return (
    <div className="flex gap-5 flex-wrap">
      {questions.map((val) => (
        <Question
          key={val}
          value={val}
          answered={answeredQuestions.includes(val)}
          setSelected={setAnsweredQuestions}
          onSelectCb={() => {
            setQuestionIndex(val);
            setCurrentTab(1);
          }}
        />
      ))}
    </div>
  );
}

const Question = ({ value, answered, setSelected, onSelectCb }) => {
  return (
    <div
      className={`basis-24 text-center py-2 rounded-md text-white w-24 cursor-pointer ${
        answered ? "bg-red-600" : "bg-green-500 hover:bg-green-600"
      }`}
      onClick={() => {
        // Deselect if answered
        if (answered)
          setSelected((prev) => prev.filter((item) => item !== value));
        else setSelected((prev) => [...prev, value]);

        // call onSelect callback
        onSelectCb();
      }}
    >
      {value}
    </div>
  );
};
