// Live background: a TikTok video plays behind the page, with sound.
// Browsers block sound until the visitor interacts with the page, so the page opens with an
// "Enter" screen. That one click lets the video play with sound from the very start.
// The ♪ button mutes and unmutes the video's sound at any time.
(() => {
  const VIDEO_ID = '7587444516311797047'; // the number after "/video/" in the TikTok link
  const PLAYER_ORIGIN = 'https://www.tiktok.com';

  const holder = $('#bgVideo');
  const soundButton = $('#sound');
  const gate = $('#enter');
  const enterButton = $('#enterBtn');

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;

  let player;
  let ready = false;
  let soundOn = false;

  // Commands go to TikTok's embedded player as messages: play, pause, mute, unMute.
  function send(type) {
    player.contentWindow.postMessage({ 'x-tiktok-player': true, type }, PLAYER_ORIGIN);
  }

  function showSoundState() {
    soundButton.setAttribute('aria-pressed', soundOn);
    soundButton.setAttribute('aria-label', soundOn ? 'Mute theme music' : 'Play theme music');
  }

  function toggleSound() {
    soundOn = !soundOn;
    send(soundOn ? 'unMute' : 'mute');
    if (soundOn) send('play');
    showSoundState();
  }

  // The click on "Enter" is the visitor's permission for sound, so sound turns on right here.
  function enterSite() {
    soundOn = true;
    if (ready) {
      send('unMute');
      send('play');
    }
    showSoundState();
    document.body.classList.remove('entering');
    gate.classList.add('is-leaving');
    setTimeout(() => (gate.hidden = true), 400);
  }

  function handleReady() {
    ready = true;
    // If the visitor already pressed Enter while the player was loading, sound goes on now.
    send(soundOn ? 'unMute' : 'mute');
    send('play');
    holder.classList.add('is-ready');
    soundButton.hidden = false;
    soundButton.onclick = toggleSound;
    showSoundState();
  }

  function handleMessage(event) {
    if (event.origin !== PLAYER_ORIGIN || event.source !== player?.contentWindow) return;
    let message = event.data;
    if (typeof message === 'string') {
      try {
        message = JSON.parse(message);
      } catch (e) {
        return;
      }
    }
    if (!message || !message['x-tiktok-player']) return;

    if (message.type === 'onPlayerReady') handleReady();
    // Keep the ♪ button honest if the player reports its own mute state.
    if (message.type === 'onMute') {
      soundOn = !message.value;
      showSoundState();
    }
    // Embedding blocked, video removed, or offline: the page just stays plain.
    if (message.type === 'onError') {
      holder.classList.remove('is-ready');
      soundButton.hidden = true;
    }
  }

  function createPlayer() {
    const options = new URLSearchParams({
      autoplay: 1,
      loop: 1,
      controls: 0,
      progress_bar: 0,
      play_button: 0,
      volume_control: 0,
      fullscreen_button: 0,
      timestamp: 0,
      music_info: 0,
      description: 0,
      closed_caption: 0,
      native_context_menu: 0,
      rel: 0,
    });
    player = document.createElement('iframe');
    player.id = 'bgPlayer';
    player.title = 'Background video';
    player.allow = 'autoplay; encrypted-media';
    player.tabIndex = -1;
    player.src = `${PLAYER_ORIGIN}/player/v1/${VIDEO_ID}?${options}`;
    holder.append(player);
  }

  // Respect visitors who asked for less motion or less data: no video, no music, no Enter screen.
  if (reducedMotion || saveData) return;

  addEventListener('message', handleMessage);
  createPlayer();

  document.body.classList.add('entering');
  gate.hidden = false;
  enterButton.onclick = enterSite;
  enterButton.focus();
})();
