import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { usePomodoroContext } from '../contexts/PomodoroContext';
import { useAuth } from '../contexts/AuthContext';

// Motivational messages based on different states
const MOTIVATION_MESSAGES = {
  startFocus: [
    "Time to enter the zone! Your future self will thank you for this focused effort.",
    "Starting strong is half the battle. Let's crush this task together!",
    "Clear mind, full focus, can't lose. You've got this!",
    "The next 25 minutes are yours to conquer. Make them count!",
    "Embrace the deep work. This is where your best ideas will emerge."
  ],
  nearCompletion: [
    "Final stretch! You've almost made it through this focused session!",
    "Just a few more minutes of brilliance to go! Keep pushing!",
    "The finish line is in sight. Maintain that incredible focus!",
    "Your discipline is inspiring! Just a little longer now.",
    "Nearly there! This is when the magic happens, keep going!"
  ],
  tooManyBreaks: [
    "Another break? I'm starting to think your keyboard needs a vacation more than you do.",
    "If procrastination were an Olympic sport, you'd be taking home the gold right now.",
    "Breaking news: Your task isn't going to complete itself while you're on your 5th break.",
    "I've seen glaciers move faster than your progress today. Maybe try actually working?",
    "At this rate, future civilizations will discover your unfinished tasks in archaeological digs.",
    "Your productivity today is like a solar eclipse - rare and brief.",
    "Is your focus battery permanently set to low power mode?",
    "Plot twist: Work actually requires... you know... working."
  ]
};

const PomodoroPage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    mode,
    timerActive,
    timeLeft,
    cycles,
    breakCount,
    motivationMessage,
    messageType,
    focusTime,
    breakTime,
    longBreakTime,
    showSettings,
    toggleTimer,
    resetTimer,
    skipToNext,
    setShowSettings,
    updateSettings,
    formatTime
  } = usePomodoroContext();

  // Settings state
  const [tempFocusTime, setTempFocusTime] = useState(focusTime);
  const [tempBreakTime, setTempBreakTime] = useState(breakTime);
  const [tempLongBreakTime, setTempLongBreakTime] = useState(longBreakTime);

  // Get a random message based on type
  const getRandomMessage = (type: 'start' | 'completion' | 'tooManyBreaks') => {
    let messages: string[] = [];
    
    switch (type) {
      case 'start':
        messages = MOTIVATION_MESSAGES.startFocus;
        break;
      case 'completion':
        messages = MOTIVATION_MESSAGES.nearCompletion;
        break;
      case 'tooManyBreaks':
        messages = MOTIVATION_MESSAGES.tooManyBreaks;
        break;
    }
    
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  // Create flip digit component
  const FlipDigit: React.FC<{ digit: string }> = ({ digit }) => {
    return (
      <div className="flip-unit-container">
        <div className="digit-card">
          <span className="digit-value">{digit}</span>
        </div>
      </div>
    );
  };

  const getMessageBoxStyle = () => {
    switch (messageType) {
      case 'start':
        return 'message-box start';
      case 'completion':
        return 'message-box completion';
      case 'tooManyBreaks':
        return 'message-box roast';
      default:
        return 'hidden';
    }
  };

  const handleSettingsSave = () => {
    updateSettings(tempFocusTime, tempBreakTime, tempLongBreakTime);
    setShowSettings(false);
  };

  const minutesStr = formatTime(timeLeft.minutes);
  const secondsStr = formatTime(timeLeft.seconds);

  return (
    <Layout>
      <div className="pomodoro-page">
        <section className="pomodoro-header">
          <h1>Pomodoro Timer</h1>
          <p>Boost your productivity with focused work intervals and restorative breaks.</p>
        </section>

        <div className="pomodoro-container">
          {messageType !== 'none' && (
            <div className={getMessageBoxStyle()}>
              {motivationMessage}
            </div>
          )}

          <div className="timer-mode">
            <div className={`mode-indicator ${mode === 'focus' ? 'active' : ''}`}>
              Focus Mode
            </div>
            <div className={`mode-indicator ${mode === 'break' ? 'active' : ''}`}>
              Break Mode
            </div>
          </div>

          <div className="timer-display">
            <div className="flip-clock">
              <FlipDigit digit={minutesStr[0]} />
              <FlipDigit digit={minutesStr[1]} />
              <span className="separator">:</span>
              <FlipDigit digit={secondsStr[0]} />
              <FlipDigit digit={secondsStr[1]} />
            </div>
          </div>

          <div className="timer-controls">
            <button
              className={`control-btn ${timerActive ? 'pause' : 'start'}`}
              onClick={toggleTimer}
            >
              {timerActive ? 'Pause' : 'Start'}
            </button>
            <button
              className="control-btn reset"
              onClick={resetTimer}
            >
              Reset
            </button>
            <button
              className="control-btn skip"
              onClick={skipToNext}
            >
              Skip
            </button>
          </div>

          <div className="stat-container">
            <div className="cycle-info">
              <div className="cycle-count">{cycles}</div>
              <div>Completed Cycles</div>
            </div>
            <div className="break-info">
              <div className="break-count">{breakCount}</div>
              <div>Breaks Taken</div>
            </div>
          </div>

          <div className="timer-settings">
            <button
              className="settings-toggle"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>

            {showSettings && (
              <div className="settings-panel">
                <h3>Timer Settings</h3>
                <div className="form-group">
                  <label htmlFor="focusTime">Focus Duration (minutes)</label>
                  <input
                    type="number"
                    id="focusTime"
                    min="1"
                    max="60"
                    value={tempFocusTime}
                    onChange={(e) => setTempFocusTime(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="breakTime">Short Break Duration (minutes)</label>
                  <input
                    type="number"
                    id="breakTime"
                    min="1"
                    max="30"
                    value={tempBreakTime}
                    onChange={(e) => setTempBreakTime(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longBreakTime">Long Break Duration (minutes)</label>
                  <input
                    type="number"
                    id="longBreakTime"
                    min="1"
                    max="60"
                    value={tempLongBreakTime}
                    onChange={(e) => setTempLongBreakTime(parseInt(e.target.value) || 1)}
                  />
                </div>

                <button
                  className="submit-btn"
                  onClick={handleSettingsSave}
                >
                  Save Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PomodoroPage; 