"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

interface Team {
  id: number;
  name: string;
  color: string;
  bgColor: string;
  score: number;
  captain: string;
  buzzedIn: boolean;
  answer: string;
}

interface GamePrompt {
  category: string;
  question: string;
  correctAnswer: string;
  emoji: string;
}

const WORKPLACE_PROMPTS: GamePrompt[] = [
  {
    category: "Office Slang",
    question: "What does 'circle back' really mean? 🔄",
    correctAnswer: "We'll never talk about this again",
    emoji: "🔄"
  },
  {
    category: "Meeting Mysteries",
    question: "What's the real purpose of a 'quick sync'? ⚡",
    correctAnswer: "To schedule another meeting",
    emoji: "⚡"
  },
  {
    category: "Email Etiquette",
    question: "What does 'per my last email' actually mean? 📧",
    correctAnswer: "Can you please read what I already wrote",
    emoji: "📧"
  },
  {
    category: "Corporate Culture",
    question: "What's a 'fun team building activity'? 🎯",
    correctAnswer: "Mandatory awkward bonding time",
    emoji: "🎯"
  },
  {
    category: "Office Life",
    question: "What happens during 'flexible work hours'? ⏰",
    correctAnswer: "Work all the time, just from different places",
    emoji: "⏰"
  },
  {
    category: "Performance Reviews", 
    question: "What does 'growth opportunity' mean? 🌱",
    correctAnswer: "You're about to get more work for the same pay",
    emoji: "🌱"
  },
  {
    category: "Tech Talk",
    question: "What's the difference between 'that's interesting' and 'that's... interesting'? 🤔",
    correctAnswer: "The pause means your idea is terrible",
    emoji: "🤔"
  },
  {
    category: "Meeting Room",
    question: "What does 'let's take this offline' really mean? 📱",
    correctAnswer: "This conversation is getting too real for this crowd",
    emoji: "📱"
  }
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 1,
    name: "Red Rockets",
    color: "text-red-600",
    bgColor: "bg-red-100 border-red-500",
    score: 0,
    captain: "",
    buzzedIn: false,
    answer: ""
  },
  {
    id: 2,
    name: "Blue Blazers", 
    color: "text-blue-600",
    bgColor: "bg-blue-100 border-blue-500",
    score: 0,
    captain: "",
    buzzedIn: false,
    answer: ""
  },
  {
    id: 3,
    name: "Green Giants",
    color: "text-green-600", 
    bgColor: "bg-green-100 border-green-500",
    score: 0,
    captain: "",
    buzzedIn: false,
    answer: ""
  }
];

export default function Game2() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'buzzed' | 'revealing' | 'finished'>('setup');
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [currentPrompt, setCurrentPrompt] = useState<GamePrompt | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [buzzerLocked, setBuzzerLocked] = useState(false);
  const [firstBuzzer, setFirstBuzzer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showAnswer, setShowAnswer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('revealing');
      setShowAnswer(true);
      toast.info("⏰ Time's up! No one buzzed in!");
    }
  }, [timeLeft, gameState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState !== 'playing' || buzzerLocked) return;
      
      let teamId: number | null = null;
      switch (event.key.toLowerCase()) {
        case '1':
        case 'q':
          teamId = 1;
          break;
        case '2': 
        case 'w':
          teamId = 2;
          break;
        case '3':
        case 'e':
          teamId = 3;
          break;
      }
      
      if (teamId) {
        buzzIn(teamId);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, buzzerLocked]);

  const updateTeamCaptain = (teamId: number, captain: string) => {
    setTeams(teams.map((team: Team) => 
      team.id === teamId ? { ...team, captain } : team
    ));
  };

  const startGame = () => {
    if (teams.every((team: Team) => team.captain.trim())) {
      setCurrentPrompt(WORKPLACE_PROMPTS[0]);
      setGameState('playing');
      setTimeLeft(15);
      setShowAnswer(false);
      setBuzzerLocked(false);
      setFirstBuzzer(null);
      toast.success("🎮 Game started! First to buzz wins!");
    } else {
      toast.error("Please enter captain names for all teams!");
    }
  };

  const buzzIn = (teamId: number) => {
    if (buzzerLocked || gameState !== 'playing') return;
    
    setBuzzerLocked(true);
    setFirstBuzzer(teamId);
    setGameState('buzzed');
    
    // Buzz sound effect (ASCII representation)
    const team = teams.find((t: Team) => t.id === teamId);
    toast.success(`🚨 ${team?.name} BUZZED IN! 🚨`);
    
    setTeams(teams.map((team: Team) => ({
      ...team,
      buzzedIn: team.id === teamId
    })));
  };

  const submitAnswer = (teamId: number, answer: string) => {
    setTeams(teams.map((team: Team) => 
      team.id === teamId ? { ...team, answer } : team
    ));
  };

  const scoreAnswer = (correct: boolean) => {
    if (firstBuzzer) {
      setTeams(teams.map((team: Team) => 
        team.id === firstBuzzer 
          ? { ...team, score: team.score + (correct ? 10 : -5) }
          : team
      ));
      
      const team = teams.find((t: Team) => t.id === firstBuzzer);
      if (correct) {
        toast.success(`🎉 Correct! +10 points to ${team?.name}!`);
      } else {
        toast.error(`❌ Incorrect! -5 points to ${team?.name}`);
      }
    }
    
    setShowAnswer(true);
    setGameState('revealing');
  };

  const nextQuestion = () => {
    if (promptIndex < WORKPLACE_PROMPTS.length - 1) {
      const nextIndex = promptIndex + 1;
      setPromptIndex(nextIndex);
      setCurrentPrompt(WORKPLACE_PROMPTS[nextIndex]);
      setGameState('playing');
      setTimeLeft(15);
      setShowAnswer(false);
      setBuzzerLocked(false);
      setFirstBuzzer(null);
      setTeams(teams.map((team: Team) => ({ ...team, buzzedIn: false, answer: '' })));
    } else {
      setGameState('finished');
      const winner = teams.reduce((prev: Team, current: Team) => 
        prev.score > current.score ? prev : current
      );
      toast.success(`🏆 Game Over! ${winner.name} wins with ${winner.score} points!`);
    }
  };

  const resetGame = () => {
    setTeams(INITIAL_TEAMS);
    setGameState('setup');
    setPromptIndex(0);
    setCurrentPrompt(null);
    setTimeLeft(15);
    setShowAnswer(false);
    setBuzzerLocked(false);
    setFirstBuzzer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            🎯 Workplace Buzz Battle 🎯
          </h1>
          <p className="text-lg text-purple-600">
            Three Teams • Race to Buzz • Workplace Humor Edition
          </p>
        </div>

        {/* Rules Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">⚡ Quick Rules ⚡</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-purple-600 mb-2">🔥 How to Play</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• First team to buzz in gets to answer</li>
                <li>• Correct = +10 points</li>
                <li>• Wrong = -5 points</li>
                <li>• 15 seconds per question</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-2">⌨️ Controls</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Team 1: Press "1" or "Q"</li>
                <li>• Team 2: Press "2" or "W"</li>
                <li>• Team 3: Press "3" or "E"</li>
                <li>• Captain presses the keys!</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-600 mb-2">🎪 Features</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Lockout after first buzz</li>
                <li>• ASCII confetti effects</li>
                <li>• Workplace humor prompts</li>
                <li>• No storage needed!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Setup */}
        {gameState === 'setup' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">👥 Team Setup</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {teams.map((team) => (
                <div key={team.id} className={`p-4 rounded-lg border-2 ${team.bgColor}`}>
                  <h3 className={`font-bold text-lg ${team.color} mb-2`}>
                    Team {team.id}: {team.name}
                  </h3>
                  <input
                    type="text"
                    placeholder="Captain Name"
                    className="w-full p-2 rounded border border-gray-300"
                    value={team.captain}
                    onChange={(e) => updateTeamCaptain(team.id, e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Captain presses the buzzer!
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button
                onClick={startGame}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-lg"
              >
                🚀 Start Workplace Buzz Battle! 🚀
              </Button>
            </div>
          </div>
        )}

        {/* Game Board */}
        {(gameState === 'playing' || gameState === 'buzzed' || gameState === 'revealing') && currentPrompt && (
          <div className="space-y-6">
            {/* Score Board */}
            <div className="grid grid-cols-3 gap-4">
              {teams.map((team) => (
                <div 
                  key={team.id} 
                  className={`p-4 rounded-lg border-2 ${team.bgColor} ${
                    team.buzzedIn ? 'ring-4 ring-yellow-400 animate-pulse' : ''
                  }`}
                >
                  <div className={`font-bold text-lg ${team.color}`}>
                    {team.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Captain: {team.captain}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {team.score} pts
                  </div>
                  {team.buzzedIn && (
                    <div className="text-yellow-600 font-bold animate-bounce">
                      🚨 BUZZED IN! 🚨
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Question Display */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">{currentPrompt.emoji}</div>
              <div className="text-sm text-purple-600 font-semibold mb-2">
                {currentPrompt.category}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-4">
                {currentPrompt.question}
              </div>
              
              {gameState === 'playing' && (
                <div className="text-3xl font-bold text-red-600">
                  ⏰ {timeLeft}s
                </div>
              )}

              {gameState === 'buzzed' && firstBuzzer && (
                <div className="space-y-4">
                  <div className="text-lg text-gray-700">
                    <span className={teams.find((t: Team) => t.id === firstBuzzer)?.color}>
                      {teams.find((t: Team) => t.id === firstBuzzer)?.name}
                    </span> buzzed in first!
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => scoreAnswer(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                    >
                      ✅ Correct (+10)
                    </Button>
                    <Button
                      onClick={() => scoreAnswer(false)}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                    >
                      ❌ Wrong (-5)
                    </Button>
                  </div>
                </div>
              )}

              {showAnswer && (
                <div className="mt-6 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-400">
                  <div className="text-lg font-bold text-yellow-800 mb-2">
                    💡 Sample Answer:
                  </div>
                  <div className="text-gray-700 italic">
                    "{currentPrompt.correctAnswer}"
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {gameState === 'revealing' && (
              <div className="text-center">
                <Button
                  onClick={nextQuestion}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-lg"
                >
                  {promptIndex < WORKPLACE_PROMPTS.length - 1 ? '➡️ Next Question' : '🏁 Finish Game'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Game Over */}
        {gameState === 'finished' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-purple-800 mb-4">
              Game Complete!
            </h2>
            <div className="text-xl mb-6">Final Scores:</div>
            <div className="space-y-2 mb-6">
              {teams
                .sort((a: Team, b: Team) => b.score - a.score)
                .map((team, index) => (
                  <div 
                    key={team.id}
                    className={`flex justify-between items-center p-3 rounded ${
                      index === 0 
                        ? 'bg-yellow-100 border-2 border-yellow-400' 
                        : 'bg-gray-100'
                    }`}
                  >
                    <span className={`font-bold ${team.color}`}>
                      {index === 0 ? '🏆 ' : ''}{team.name} ({team.captain})
                    </span>
                    <span className="font-bold text-lg">
                      {team.score} points
                    </span>
                  </div>
                ))}
            </div>
            <div className="text-center text-yellow-600 text-4xl mb-4">
              ✨ ⭐ 🎊 ASCII CONFETTI! 🎊 ⭐ ✨
            </div>
            <Button
              onClick={resetGame}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-lg"
            >
              🔄 Play Again
            </Button>
          </div>
        )}

        {/* Cheat Sheet for Host */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="font-bold text-gray-800 mb-2">📋 Host Cheat Sheet (30-second read-aloud):</h3>
          <p className="text-sm text-gray-600">
            "Welcome to Workplace Buzz Battle! Three teams compete in workplace humor trivia. 
            Captains use keyboard shortcuts to buzz in first. Correct answers = +10 points, wrong = -5 points. 
            15 seconds per question. First team to buzz locks out others. Let the workplace comedy begin!"
          </p>
        </div>
      </div>
    </div>
  );
}