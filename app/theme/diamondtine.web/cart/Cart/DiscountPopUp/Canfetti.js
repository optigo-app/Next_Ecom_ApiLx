import * as confetti from "canvas-confetti";

export const useConfetti = () => {
  const triggerConfetti = () => {
    const canvas = document.getElementById("confetti");
    const confettiInstance = confetti.create(canvas || undefined, {
      resize: true,
      useWorker: true,
    });
    confettiInstance({
      particleCount: 250,           // low particle count
      startVelocity: 40,           // fast initial speed
      spread: 130,                  // tighter spread for cannon feel
      gravity: 0.8,                // realistic fall
      ticks: 60,                   // short lifetime
      origin: { x: 0.5, y: 0.4 }, // center-ish of modal
      colors: ["#9333ea", "#3b82f6", "#f43f5e", "#10b981", "#facc15"],
      zIndex: 9999,
    });
  };

  return { triggerConfetti };
};

