import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

type TimerData = {
  minutes: number;
  seconds: number;
};

type MessageType = 'start' | 'completion' | 'tooManyBreaks' | 'none';

interface PomodoroContextType {
  mode: 'focus' | 'break';
  timerActive: boolean;
  timeLeft: TimerData;
  cycles: number;
  breakCount: number;
  motivationMessage: string;
  messageType: MessageType;
  focusTime: number;
  breakTime: number;
  longBreakTime: number;
  showSettings: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipToNext: () => void;
  setShowSettings: (show: boolean) => void;
  updateSettings: (newFocusTime: number, newBreakTime: number, newLongBreakTime: number) => void;
  formatTime: (num: number) => string;
}

const PomodoroContext = createContext<PomodoroContextType>({
  mode: 'focus',
  timerActive: false,
  timeLeft: { minutes: 25, seconds: 0 },
  cycles: 0,
  breakCount: 0,
  motivationMessage: '',
  messageType: 'none',
  focusTime: 25,
  breakTime: 5,
  longBreakTime: 15,
  showSettings: false,
  toggleTimer: () => {},
  resetTimer: () => {},
  skipToNext: () => {},
  setShowSettings: () => {},
  updateSettings: () => {},
  formatTime: () => ''
});

export const usePomodoroContext = () => useContext(PomodoroContext);

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get current user
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;
  
  // Timer states
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimerData>({
    minutes: 25,
    seconds: 0,
  });
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
  const [cycles, setCycles] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [motivationMessage, setMotivationMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<MessageType>('none');

  // Settings
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [showSettings, setShowSettings] = useState(false);

  // Generate user-specific localStorage key
  const getStorageKey = () => {
    return `pomodoroState_${userId || 'guest'}`;
  };

  // Load saved state on mount or when user changes
  useEffect(() => {
    if (!userId) {
      // Reset to defaults for guest users or when logged out
      setMode('focus');
      setTimerActive(false);
      setTimeLeft({ minutes: 25, seconds: 0 });
      setCycles(0);
      setBreakCount(0);
      setFocusTime(25);
      setBreakTime(5);
      setLongBreakTime(15);
      return;
    }
    
    const savedState = localStorage.getItem(getStorageKey());
    if (savedState) {
      try {
        const {
          mode,
          timeLeft,
          cycles,
          breakCount,
          focusTime,
          breakTime,
          longBreakTime,
          lastTimestamp,
          timerActive
        } = JSON.parse(savedState);
        
        setMode(mode);
        setCycles(cycles);
        setBreakCount(breakCount);
        setFocusTime(focusTime);
        setBreakTime(breakTime);
        setLongBreakTime(longBreakTime);
        
        // Calculate time that passed since last activity if timer was active
        if (timerActive && lastTimestamp) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - lastTimestamp) / 1000);
          
          if (elapsedSeconds < timeLeft.minutes * 60 + timeLeft.seconds) {
            // Timer still has time left
            const totalSeconds = timeLeft.minutes * 60 + timeLeft.seconds - elapsedSeconds;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            setTimeLeft({ minutes, seconds });
            setTimerActive(true);
          } else {
            // Timer would have completed, reset to start of next segment
            if (mode === 'focus') {
              setMode('break');
              const isLongBreak = (cycles + 1) % 4 === 0;
              setTimeLeft({
                minutes: isLongBreak ? longBreakTime : breakTime,
                seconds: 0
              });
              setCycles(cycles + 1);
            } else {
              setMode('focus');
              setTimeLeft({
                minutes: focusTime,
                seconds: 0
              });
            }
            setTimerActive(false);
          }
        } else {
          setTimeLeft(timeLeft);
          setTimerActive(false);
        }
      } catch (error) {
        console.error('Failed to parse pomodoro state from localStorage', error);
        // Default values will be used
      }
    }
  }, [userId]);

  // Save state whenever it changes
  useEffect(() => {
    if (userId) {
      const state = {
        mode,
        timeLeft,
        cycles,
        breakCount,
        focusTime,
        breakTime,
        longBreakTime,
        lastTimestamp: timerActive ? Date.now() : null,
        timerActive
      };
      localStorage.setItem(getStorageKey(), JSON.stringify(state));
    }
  }, [mode, timeLeft, cycles, breakCount, focusTime, breakTime, longBreakTime, timerActive, userId]);

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

  // Effect for the timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive) {
      // Store current timestamp
      setLastTimestamp(Date.now());
      
      interval = setInterval(() => {
        setTimeLeft(prev => {
          // Calculate new time
          const newSeconds = prev.seconds > 0 ? prev.seconds - 1 : 59;
          const newMinutes = prev.seconds > 0 ? prev.minutes : prev.minutes - 1;
          
          // Store timestamp on each tick
          setLastTimestamp(Date.now());
          
          // Show near completion message when 2 minutes remaining in focus mode
          if (mode === 'focus' && newMinutes === 2 && newSeconds === 0) {
            const message = getRandomMessage('completion');
            setMotivationMessage(message);
            setMessageType('completion');
            
            // Clear message after 10 seconds
            setTimeout(() => {
              setMessageType('none');
            }, 10000);
          }
          
          if (newMinutes === 0 && newSeconds === 0) {
            // Timer finished
            const newCycles = mode === 'focus' ? cycles + 1 : cycles;
            setCycles(newCycles);
            
            // Play notification sound
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Error playing sound:', e));
            
            // Toggle between focus and break
            if (mode === 'focus') {
              // After focus period, start a break
              const isLongBreak = newCycles % 4 === 0;
              setMode('break');
              
              // Increment break count
              const newBreakCount = breakCount + 1;
              setBreakCount(newBreakCount);
              
              // Check if taking too many breaks
              if (newBreakCount > 3 && newBreakCount % 2 === 0) {
                const message = getRandomMessage('tooManyBreaks');
                setMotivationMessage(message);
                setMessageType('tooManyBreaks');
                
                // Clear message after 10 seconds
                setTimeout(() => {
                  setMessageType('none');
                }, 10000);
              }
              
              return {
                minutes: isLongBreak ? longBreakTime : breakTime,
                seconds: 0
              };
            } else {
              // After break, start focus period
              setMode('focus');
              
              // Show starting motivation
              const message = getRandomMessage('start');
              setMotivationMessage(message);
              setMessageType('start');
              
              // Clear message after 10 seconds
              setTimeout(() => {
                setMessageType('none');
              }, 10000);
              
              return {
                minutes: focusTime,
                seconds: 0
              };
            }
          }
          
          return { minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, mode, focusTime, breakTime, longBreakTime, cycles, breakCount]);

  // Handle start/pause
  const toggleTimer = () => {
    // If starting timer from inactive state and in focus mode
    if (!timerActive && mode === 'focus') {
      const message = getRandomMessage('start');
      setMotivationMessage(message);
      setMessageType('start');
      
      // Clear message after 10 seconds
      setTimeout(() => {
        setMessageType('none');
      }, 10000);
    }
    
    setTimerActive(!timerActive);
  };

  // Handle reset
  const resetTimer = () => {
    setTimerActive(false);
    setCycles(0);
    setBreakCount(0);
    setMode('focus');
    setMessageType('none');
    setTimeLeft({
      minutes: focusTime,
      seconds: 0
    });
  };

  // Handle skip to next segment
  const skipToNext = () => {
    setTimerActive(false);
    
    if (mode === 'focus') {
      const isLongBreak = (cycles + 1) % 4 === 0;
      setMode('break');
      setTimeLeft({
        minutes: isLongBreak ? longBreakTime : breakTime,
        seconds: 0
      });
      setCycles(cycles + 1);
      setBreakCount(breakCount + 1);
      
      // Check if taking too many breaks
      if (breakCount > 2) {
        const message = getRandomMessage('tooManyBreaks');
        setMotivationMessage(message);
        setMessageType('tooManyBreaks');
        
        // Clear message after 10 seconds
        setTimeout(() => {
          setMessageType('none');
        }, 10000);
      }
    } else {
      setMode('focus');
      setTimeLeft({
        minutes: focusTime,
        seconds: 0
      });
      
      // Show starting motivation
      const message = getRandomMessage('start');
      setMotivationMessage(message);
      setMessageType('start');
      
      // Clear message after 10 seconds
      setTimeout(() => {
        setMessageType('none');
      }, 10000);
    }
  };

  // Update settings
  const updateSettings = (newFocusTime: number, newBreakTime: number, newLongBreakTime: number) => {
    setFocusTime(newFocusTime);
    setBreakTime(newBreakTime);
    setLongBreakTime(newLongBreakTime);
    
    // Update current timer if needed
    if (!timerActive) {
      if (mode === 'focus') {
        setTimeLeft({
          minutes: newFocusTime,
          seconds: 0
        });
      } else {
        const isLongBreak = cycles % 4 === 0;
        setTimeLeft({
          minutes: isLongBreak ? newLongBreakTime : newBreakTime,
          seconds: 0
        });
      }
    }
  };

  // Format time as 2-digit string
  const formatTime = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  const value = {
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
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}; 