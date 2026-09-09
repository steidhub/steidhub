/* Los videos solo arrancan al pulsar su botón. */
document.querySelectorAll('.video-phone').forEach((phone) => {
  const video = phone.querySelector('video');
  const button = phone.querySelector('.video-phone__play');
  button.addEventListener('click', async () => {
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
