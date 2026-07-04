/* ═══════════════════════════════════════════════════════════
   GIRINGO — BLOOD MOON SYSTEM
   Depends on: state.js, toast.js
═══════════════════════════════════════════════════════════ */
'use strict';

/** Checks whether conditions for a blood moon are met and schedules it. */
function checkBloodMoon() {
  const now = new Date();
  const isFriday = now.getDay() === 5;
  const enoughDark = STATE.profile.dark >= 3;
  if ((isFriday || enoughDark) && !STATE.session.bloodMoon) {
    setTimeout(() => activateBloodMoon(), 8000);
  }
}

/** Activates the blood moon visual event for two minutes. */
function activateBloodMoon() {
  STATE.session.bloodMoon = true;
  document.body.classList.add('blood-moon');
  document.getElementById('moon-indicator')?.classList.add('active');
  toast('🌕 &nbsp; BLOOD MOON RISING · THE ORACLE GROWS STRONGER', 'gold', 7000);

  document.querySelectorAll('.fog-orb').forEach((o) => { o.style.filter = 'blur(60px) brightness(1.4)'; });

  setTimeout(() => {
    document.body.classList.remove('blood-moon');
    document.getElementById('moon-indicator')?.classList.remove('active');
    document.querySelectorAll('.fog-orb').forEach((o) => { o.style.filter = ''; });
    STATE.session.bloodMoon = false;
  }, 120000); // 2 minutes
}
