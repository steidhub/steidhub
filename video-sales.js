/* Los videos solo arrancan al pulsar (el botón en escritorio, la tarjeta en móvil). */
document.querySelectorAll('.video-phone').forEach((phone) => {
  const video = phone.querySelector('video');
  const button = phone.querySelector('.video-phone__play');
  // El listener va en la tarjeta, no en el botón: en móvil el botón queda con
  // pointer-events:none para que no capture el gesto de desplazamiento lateral.
  // Un arrastre no dispara click, así que deslizar sigue funcionando.
  phone.addEventListener('click', async () => {
    if (!video.paused) return;
    document.querySelectorAll('.video-phone video').forEach((other) => {
      if (other !== video) other.pause();
    });
    video.controls = true;
    try { await video.play(); } catch { button.hidden = false; }
  });
  video.addEventListener('play', () => { button.hidden = true; phone.classList.add('is-playing'); });
  video.addEventListener('pause', () => { button.hidden = false; phone.classList.remove('is-playing'); });
  video.addEventListener('ended', () => { button.hidden = false; video.controls = false; });
});
