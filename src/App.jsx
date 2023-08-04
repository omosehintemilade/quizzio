import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar";
import { Tabs } from "./components/Tabs";

function App() {
  const [currentTab, setCurrentTab] = useState(1);

  const [questionsRange, setQuestionsRange] = useState({
    start: 1,
    end: 10
  });
  const [numberOfQuestions, setNumberOfQuestions] = useState([]);

  console.log("questionsRange", questionsRange.start, questionsRange.end);
  useEffect(() => {
    console.log("Changed");
    const { start, end } = questionsRange;
    setNumberOfQuestions(() =>
      Array.from({ length: end - start + 1 }, (_, index) => index + start)
    );
  }, [questionsRange]);

  const [defaultTime, setDefaultTime] = useState(10);

  const [seconds, setSeconds] = useState(defaultTime);

  // This stores the index of questions answered
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  console.log({ seconds });

  return (
    <>
      <div className="relative">
        <Navbar time={seconds} />

        <div className="fixed left-0 right-0 bottom-[68px] top-[64px] flex overflow-hidden">
          {currentTab === 0 ? (
            <SelectQuestionTabPane
              questions={numberOfQuestions}
              setQuestionsRange={setQuestionsRange}
              time={seconds}
              defaultTime={defaultTime}
              setTime={setSeconds}
              setDefaultTime={setDefaultTime}
              answeredQuestions={answeredQuestions}
              setAnsweredQuestions={setAnsweredQuestions}
            />
          ) : (
            <QuestionTabPane />
          )}
        </div>
        <Tabs activeTab={currentTab} onChangeCb={setCurrentTab} />
      </div>
    </>
  );
}

const Button = ({ value, answered, setSelected }) => {
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
      }}
    >
      {value}
    </div>
  );
};

const SelectQuestionTabPane = ({
  questions,
  setQuestionsRange,
  time,
  setTime,
  defaultTime,
  setDefaultTime,
  answeredQuestions,
  setAnsweredQuestions
}) => {
  const [range, setRange] = useState({
    start: 0,
    end: 0
  });

  const [isPlayingTimer, setIsPlayingTimer] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [defaultTimerValue, setDefaultTimerValue] = useState(defaultTime);

  console.log({ time });

  // USE EFFECTS
  useEffect(() => {
    // if time is up
    console.log("line80", defaultTime, time);
    if (time === 0) {
      setIsPlayingTimer(false);
      stopTimeCountdown();
    }
  }, [time]);

  // When default timer value is updated
  useEffect(() => {
    resetTimer();
  }, [defaultTime]);

  // FUNCTIONS

  // Function to start the timer
  const startTimeCountdown = () => {
    const timerInterval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    setTimerIntervalId(timerInterval);
  };

  // Function to stop the timer
  const stopTimeCountdown = () => clearInterval(timerIntervalId);

  // Function to reset the timer
  const resetTimer = () => {
    setIsPlayingTimer(false);
    stopTimeCountdown();
    setTime(defaultTime);
  };
  console.log({ answeredQuestions });
  return (
    <>
      <div className="w-2/3 px-8 py-10 overflow-y-auto">
        <div className="flex gap-5 flex-wrap">
          {questions.map((val) => (
            <Button
              key={val}
              value={val}
              answered={answeredQuestions.includes(val)}
              setSelected={setAnsweredQuestions}
            />
          ))}
        </div>
      </div>
      <div className="w-1/3 border-l border-gray-500 px-2 pt-10 pb-4 flex flex-col justify-between">
        <div>
          <div className="shadow px-3 py-4 rounded-sm mb-7">
            <h3 className="text-sm mb-2">Enter Questions Range:</h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                className="border-2 border-blue-400 outline-none rounded-md p-0.5 focus:border-blue-500 w-20"
                onChange={({ target }) =>
                  setRange((prev) => ({
                    ...prev,
                    start: target.valueAsNumber
                  }))
                }
              />
              <p>=&gt;</p>
              <input
                type="number"
                className="border-2 border-blue-400 outline-none rounded-md p-0.5 focus:border-blue-500 w-20"
                onChange={({ target }) =>
                  setRange((prev) => ({
                    ...prev,
                    end: target.valueAsNumber
                  }))
                }
              />
              <button
                className="w-2/4 text-center bg-green-500 text-white rounded-md py-1.5 hover:bg-green-600 mt-1 mb-2 text-sm"
                onClick={() => {
                  console.log(range.start, range.end);
                  // If there are no figures
                  if (!range.start || !range.end) {
                    toast.error("Range cannot be blank!");
                    return;
                  }

                  // If end value is greater than start value e.g 100 => 50
                  if (range.end < range.start) {
                    toast.error("Invalid Range! Please enter a valid range");
                    return;
                  }

                  setQuestionsRange(range);
                }}
              >
                Enter
              </button>
            </div>
          </div>
          <div className="shadow px-3 py-4 rounded-sm mb-4">
            <h3 className="text-sm mb-2">Start Timer Countdown At:</h3>
            <div className="flex items-center">
              <input
                type="number"
                className="border-2 border-blue-400 outline-none rounded-md p-0.5 focus:border-blue-500 w-full"
                onChange={({ target }) =>
                  setDefaultTimerValue(target.valueAsNumber)
                }
              />
              <p className="text-sm ml-1">seconds</p>
            </div>

            <button
              className="w-full text-center text-white rounded-md py-2 mt-3 mb-1 text-sm bg-green-500 hover:bg-green-600"
              onClick={() => {
                // If there are no figures
                if (!defaultTimerValue) {
                  toast.error("Default Timer Value cannot be blank!");
                  return;
                }

                console.log({ defaultTimerValue });

                // reset timer
                setDefaultTime(defaultTimerValue);
              }}
            >
              Update Default Timer Value
            </button>

            <button
              className={`w-full text-center text-white rounded-md py-2 mt-3 mb-1 text-sm ${
                isPlayingTimer
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-500 hover:bg-green-600"
              }}`}
              onClick={() => {
                if (isPlayingTimer) {
                  stopTimeCountdown();
                } else {
                  startTimeCountdown();
                }
                setIsPlayingTimer(!isPlayingTimer);
              }}
            >
              {isPlayingTimer ? "Pause Timer" : "Start Timer"}
            </button>

            <button
              className="w-full text-center bg-red-600 text-white rounded-md py-2 hover:bg-red-700 mt-3 mb-1 text-sm"
              onClick={() => resetTimer()}
            >
              Reset Timer
            </button>
          </div>
        </div>

        <button className="w-full text-center bg-red-600 text-white rounded-md py-2 hover:bg-red-700">
          Reset State
        </button>
      </div>
    </>
  );
};

const QuestionTabPane = ({ questionIndex }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  console.log({ showAnswer });

  return (
    <>
      <div className="w-3/4 px-8 py-10 overflow-y-auto">
        <div className="text-justify">
          <div className="mb-8">
            <h3 className="font-bold text-2xl mb-4">Question:</h3>
            <p className="text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
              odit sed? Dolorem, non fuga! Deleniti accusamus maiores dolores
              provident pariatur sed nesciunt atque quos praesentium et
              excepturi illum mollitia vitae delectus, animi quod, quam non
              aspernatur necessitatibus veritatis error natus!
            </p>
          </div>

          {showAnswer && (
            <div className="pl-6 text-green-600">
              <h3 className="font-semibold text-xl mb-2.5">Answer:</h3>
              <p className="text-gray-700s">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
                odit sed? Dolorem, non fuga! Deleniti accusamus maiores dolores
                provident pariatur sed nesciunt atque quos praesentium et
                excepturi illum mollitia vitae delectus, animi quod, quam non
                aspernatur necessitatibus veritatis error natus!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-1/4 border-l-2 border-gray-500 px-2 pt-10 pb-4 flex items-end">
        <button
          className={`w-60 text-center text-white rounded-md py-2 mt-3 mb-1 text-sm ${
            showAnswer
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
      </div>
    </>
  );
};

export default App;
