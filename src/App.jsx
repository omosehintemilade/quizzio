import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar";
import { Tabs } from "./components/Tabs";
import questionsJson from "../questions.json";
import Sidebar from "./components/Sidebar";
import QuestionTab from "./components/QuestionTab";
import SelectQuestionTab from "./components/SelectQuestionTab";

function persistState(state) {
  console.log("syncing current state for backup...");
  localStorage.setItem("quizzio", JSON.stringify(state));
  console.log("Done! 🎉🎉");
}

function fetchState() {
  return localStorage.getItem("quizzio");
}

function App() {
  const [defaultState, _] = useState(JSON.parse(fetchState()));

  const [currentTab, setCurrentTab] = useState(0);

  const [questionsRange, setQuestionsRange] = useState({
    start: defaultState?.questionsRange.start ?? 1,
    end: defaultState?.questionsRange.end ?? 10
  });
  const [numberOfQuestions, setNumberOfQuestions] = useState([]);

  useEffect(() => {
    const { start, end } = questionsRange;
    setNumberOfQuestions(() =>
      Array.from({ length: end - start + 1 }, (_, index) => index + start)
    );
  }, [questionsRange]);

  const [defaultTime, setDefaultTime] = useState(
    defaultState?.defaultTime ?? 10
  );

  const [seconds, setSeconds] = useState(defaultTime);

  // This stores the index of questions answered
  const [answeredQuestions, setAnsweredQuestions] = useState(
    defaultState?.answeredQuestions || []
  );
  const [questionIndex, setQuestionIndex] = useState(null);

  const [showAnswer, setShowAnswer] = useState(false);

  // sync state every 10 seconds
  useEffect(() => {
    persistState({
      questionsRange,
      defaultTime,
      answeredQuestions
    });
  }, [questionsRange, defaultTime, answeredQuestions]);

  return (
    <>
      <div className="relative">
        <Navbar time={seconds} />

        <div className="fixed left-0 right-0 bottom-[68px] top-[64px] flex overflow-hidden">
          <div className="w-2/3 px-8 py-10 overflow-y-auto">
            {currentTab === 0 ? (
              <SelectQuestionTab
                questions={numberOfQuestions}
                answeredQuestions={answeredQuestions}
                setAnsweredQuestions={setAnsweredQuestions}
                setQuestionIndex={setQuestionIndex}
                setCurrentTab={setCurrentTab}
              />
            ) : (
              <QuestionTab
                questionIndex={questionIndex}
                showAnswer={showAnswer}
              />
            )}
          </div>

          <div className="w-1/3 border-l border-gray-500 px-2 pt-10 pb-4 flex flex-col justify-between">
            <Sidebar
              questionsRange={questionsRange}
              setQuestionsRange={setQuestionsRange}
              time={seconds}
              defaultTime={defaultTime}
              setTime={setSeconds}
              setDefaultTime={setDefaultTime}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              questionIndex={questionIndex}
            />
          </div>
        </div>
        <Tabs activeTab={currentTab} onChangeCb={setCurrentTab} />
      </div>
    </>
  );
}

export default App;
