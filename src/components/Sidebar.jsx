import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import questionsJson from "../../questions.json";

function resetState() {
  localStorage.removeItem("quizzio");
}

export default function Sidebar({
  questionIndex,
  setQuestionsRange,
  time,
  setTime,
  defaultTime,
  setDefaultTime,
  questionsRange,
  showAnswer,
  setShowAnswer
}) {
  const [range, setRange] = useState(questionsRange);

  const [isPlayingTimer, setIsPlayingTimer] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [defaultTimerValue, setDefaultTimerValue] = useState(defaultTime);

  // USE EFFECTS
  useEffect(() => {
    console.log({ time }, "changing");
    // if time is up
    if (time <= 0) {
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
    // don't start timer if value is <= 0
    if (time <= 0) setIsPlayingTimer(false);
    else {
      const timerInterval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);

      setTimerIntervalId(timerInterval);
    }
  };

  // Function to stop the timer
  const stopTimeCountdown = () => clearInterval(timerIntervalId);

  // Function to reset the timer
  const resetTimer = () => {
    setIsPlayingTimer(false);
    stopTimeCountdown();
    setTime(defaultTime);
  };

  return (
    <>
      <div>
        <div className="shadow px-3 py-4 rounded-sm mb-7">
          <h3 className="text-sm mb-2">Enter Questions Range:</h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              className="border-2 border-blue-400 outline-none rounded-md p-0.5 focus:border-blue-500 w-20"
              value={range.start}
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
              value={range.end}
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
                // If there are no figures
                if (!range.start || !range.end) {
                  toast.error("Range is not nullable!");
                  return;
                }

                // If end value is greater than start value e.g 100 => 50
                if (range.end < range.start) {
                  toast.error("Invalid Range! Please enter a valid range");
                  return;
                }

                // If end value is greater than questions length
                if (range.end > questionsJson.length) {
                  toast.error(
                    `End range exceeds total number of questions (${questionsJson.length})`
                  );
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
              value={defaultTimerValue}
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
              setIsPlayingTimer(!isPlayingTimer);
              if (isPlayingTimer) stopTimeCountdown();
              else startTimeCountdown();
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

      <div className="">
        {
          // Display on Questions tab
          questionIndex && (
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
          )
        }

        <button
          className="w-full text-center bg-red-600 text-white rounded-md py-2 hover:bg-red-700"
          onClick={() => {
            resetState();
            window.location.reload();
          }}
        >
          Reset State
        </button>
      </div>
    </>
  );
}
