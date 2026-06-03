@import "tailwindcss";

:root {
  color: #14213d;
  background: #f7fbff;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
}

button,
input,
textarea,
select {
  font: inherit;
}

.animate-correct {
  animation: correct-pulse 650ms ease;
}

.animate-shake {
  animation: wrong-shake 520ms ease;
}

.confetti-piece {
  position: absolute;
  top: -24px;
  width: 12px;
  height: 18px;
  border: 2px solid #14213d;
  animation: confetti-fall 1.8s ease-in forwards;
}

@keyframes correct-pulse {
  0% {
    box-shadow: 6px 6px 0 #2a9d8f;
  }

  45% {
    box-shadow: 6px 6px 0 #1b7f5a;
    background: #d8f3dc;
  }

  100% {
    box-shadow: 6px 6px 0 #2a9d8f;
  }
}

@keyframes wrong-shake {
  0%,
  100% {
    transform: translateX(0);
  }

  20%,
  60% {
    transform: translateX(-8px);
  }

  40%,
  80% {
    transform: translateX(8px);
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-24px) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translateY(110vh) rotate(520deg);
    opacity: 0;
  }
}
