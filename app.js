/* 디지털 시계 */
function updateClock() {
  const el = document.getElementById("digitalClock");
  const now = new Date();
  el.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}
setInterval(updateClock, 1000);
updateClock();

/* 테마 정보 */
const themeInfo = {
  fire: {
    emoji: "🔥",
    name: "불멍",
    subtitle: "장작불 앞에서 조용히 호흡만 느껴보세요.",
    bg: "radial-gradient(circle at bottom, #ffb347 0%, #ff7a3c 20%, #0d1117 70%)",
  },
  water: {
    emoji: "💧",
    name: "물멍",
    subtitle: "잔잔한 물결과 수면 파동을 상상해 보세요.",
    bg: "radial-gradient(circle at bottom, #5bbcff 0%, #2f6ddb 30%, #0d1117 75%)",
  },
  rain: {
    emoji: "🌧",
    name: "빗소리",
    subtitle: "창 밖으로 떨어지는 빗방울만 바라보는 시간.",
    bg: "radial-gradient(circle at bottom, #9bb5c9 0%, #4c6d8f 30%, #0d1117 70%)",
  },
  bubble: {
    emoji: "🫧",
    name: "버블",
    subtitle: "위로 둥둥 떠오르는 기포를 따라가 보세요.",
    bg: "radial-gradient(circle at bottom, #d7b1ff 0%, #8a55d6 26%, #0d1117 70%)",
  },
  snow: {
    emoji: "❄️",
    name: "눈",
    subtitle: "천천히 내리는 눈송이 사이로 생각을 흘려보내세요.",
    bg: "radial-gradient(circle at bottom, #f1f6ff 0%, #96b7f8 22%, #0d1117 75%)",
  },
  leaf: {
    emoji: "🍂",
    name: "낙엽",
    subtitle: "가을 바람에 흩날리는 낙엽처럼 내려놓는 연습.",
    bg: "radial-gradient(circle at bottom, #ffca85 0%, #b8763a 25%, #0d1117 75%)",
  },
  frost: {
    emoji: "🧊",
    name: "성애",
    subtitle: "서리 낀 창문 사이로 들어오는 차분한 빛.",
    bg: "radial-gradient(circle at bottom, #d1edff 0%, #5da8d6 24%, #0d1117 75%)",
  },
};

const sceneEmoji = document.getElementById("currentThemeEmoji");
const sceneName = document.getElementById("currentThemeName");
const sceneSub = document.getElementById("currentThemeSubtitle");
const sceneCanvas = document.getElementById("sceneCanvas");

function applyThemeByKey(key) {
  const t = themeInfo[key];
  if (!t) return;

  sceneEmoji.textContent = t.emoji;
  sceneName.textContent = t.name;
  sceneSub.textContent = t.subtitle;
  sceneCanvas.style.background = t.bg;

  document
    .querySelectorAll(".side-theme-btn")
    .forEach((btn) => btn.classList.toggle("active", btn.dataset.key === key));
}

// 사이드바 버튼 클릭 이벤트
document.querySelectorAll(".side-theme-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyThemeByKey(btn.dataset.key);
  });
});

// 초기 테마: 불멍
applyThemeByKey("fire");

/* =========================
   디톡스 모달 요소
   ========================= */
const detoxOverlay = document.getElementById("detoxOverlay");
const detoxOverlayTime = document.getElementById("detoxOverlayTime");
const detoxEndBtn = document.getElementById("detoxEndBtn");

/* =========================
   타이머 로직
   ========================= */
const timerMinInput = document.getElementById("timerMin");
const timerSecInput = document.getElementById("timerSec");
const timerDisplay = document.getElementById("timerDisplay");

const timerStartBtn = document.getElementById("timerStartBtn");
const timerPauseBtn = document.getElementById("timerPauseBtn");
const timerResetBtn = document.getElementById("timerResetBtn");

let timerInterval = null;
let timerRemainingMs = 0;
let timerRunning = false;

function formatTimer(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerDisplay() {
  const text = formatTimer(timerRemainingMs);
  if (timerDisplay) timerDisplay.textContent = text;
  // 모달 안의 큰 타이머도 함께 갱신
  if (detoxOverlayTime) detoxOverlayTime.textContent = text;
}

function readTimerFromInput() {
  const m = parseInt(timerMinInput.value || "0", 10);
  const s = parseInt(timerSecInput.value || "0", 10);
  const total = (m * 60 + s) * 1000;
  return isNaN(total) ? 0 : total;
}

function startTimer() {
  if (timerRunning) return;

  if (timerRemainingMs <= 0) {
    timerRemainingMs = readTimerFromInput();
    if (timerRemainingMs <= 0) {
      alert("분/초를 입력한 뒤 시작을 눌러주세요.");
      return;
    }
  }

  timerRunning = true;
  const startTime = Date.now();
  const startRemaining = timerRemainingMs;

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    timerRemainingMs = startRemaining - elapsed;

    if (timerRemainingMs <= 0) {
      timerRemainingMs = 0;
      clearInterval(timerInterval);
      timerRunning = false;
      onTimerFinished();
    } else {
      updateTimerDisplay();
    }
  }, 200);

  updateTimerDisplay();
}

function pauseTimer() {
  if (!timerRunning) return;
  timerRunning = false;
  clearInterval(timerInterval);
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerRemainingMs = 0;
  updateTimerDisplay();
}

// 버튼 이벤트 연결
timerStartBtn.addEventListener("click", startTimer);
timerPauseBtn.addEventListener("click", pauseTimer);
timerResetBtn.addEventListener("click", resetTimer);

// 초기 표시
updateTimerDisplay();

/* =========================
   디톡스 잠금(세션 모달) 로직
   ========================= */
const detoxLockBtn = document.getElementById("detoxLockBtn");
const lockStatus = document.getElementById("lockStatus");

let detoxLockMode = false; // 세션 진행중인지 여부

function updateLockStatus(text) {
  if (lockStatus) {
    lockStatus.textContent = text;
  }
}

// 타이머 끝났을 때 호출되는 함수
function onTimerFinished() {
  // 남은 시간을 0으로 맞춰 표시
  updateTimerDisplay();

  // 모달 닫기
  if (detoxOverlay) {
    detoxOverlay.classList.remove("show");
  }

  detoxLockMode = false;
  updateLockStatus("상태: 완료 (타이머 종료)");
  alert("디톡스 시간이 끝났습니다!");
}

// 디톡스 잠금 시작 버튼 → 모달 띄우고 타이머 스타트
detoxLockBtn.addEventListener("click", () => {
  // 타이머 남은 시간이 없으면, 입력값으로 새로 설정
  if (!timerRunning && timerRemainingMs <= 0) {
    timerRemainingMs = readTimerFromInput();
    if (timerRemainingMs <= 0) {
      alert("디톡스 잠금 전에 타이머 시간을 먼저 설정해 주세요.");
      return;
    }
  }

  // 모달 표시
  if (detoxOverlay) {
    detoxOverlay.classList.add("show");
  }

  detoxLockMode = true;
  updateLockStatus("상태: 진행 중 (디톡스 세션)");

  // 타이머가 아직 안 돌고 있으면 시작
  if (!timerRunning) {
    startTimer();
  }
});

// 세션 종료 버튼 (사용자가 중간에 끝내고 싶을 때)
if (detoxEndBtn) {
  detoxEndBtn.addEventListener("click", () => {
    resetTimer();
    if (detoxOverlay) {
      detoxOverlay.classList.remove("show");
    }
    detoxLockMode = false;
    updateLockStatus("상태: 사용자가 세션 종료");
  });
}
