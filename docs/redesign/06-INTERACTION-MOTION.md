# 6. Interaction and animation guidelines

* Motion explains state change, never decorates: backdrop cross-fade (600 ms), sheet slide-in (260 ms), progress fill (400–600 ms), pop-in for dialogs/feedback (200–240 ms), stamp press (700 ms), pulse on the current pin and current stop.
* Nothing blocks input. The stamp modal is dismissible with Esc or "Keep going"; completion screens show their primary action immediately; confetti is 22 paper pieces for ~1.4 s and is skipped under reduced motion.
* Reduced motion: OS preference and the in-app setting (`data-motion="reduce"`) disable all CSS animation/transition; JS-driven effects (confetti, smooth scroll) check the same setting.
* Sound: the stamp uses the existing synthesised `fb_stamp` effect; it respects mute/volume settings. No new audio files.
* Press feedback: buttons translate 1–2 px; targets are ≥ 44 px.
* No parallax or scroll hijacking: the location backdrop is `position: fixed` and simply stays while cards scroll over it.
* No animation library: CSS keyframes and the Web Animations-free approach keep the bundle small and offline-safe.
