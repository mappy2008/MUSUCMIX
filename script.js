let player1, player2;
let muted = { 1: false, 2: false };
let delay1 = 0; // Player1 遅延（秒）
let delay2 = 0; // Player2 遅延（秒）
let soloState = false; // 交互ミュートの状態（trueならplayer2 ON）

function extractVideoID(url) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

function loadVideos() {
  const url1 = document.getElementById("url1").value.trim();
  const url2 = document.getElementById("url2").value.trim();
  const id1 = extractVideoID(url1);
  const id2 = extractVideoID(url2);

  if (!id1 || !id2) {
    alert("両方のYouTubeリンクを正しく入力してください。");
    return;
  }

  if (player1) player1.loadVideoById(id1);
  else player1 = new YT.Player('player1', {
    height: '360', width: '640', videoId: id1,
    playerVars: { 'autoplay': 0, 'controls': 1 }
  });

  if (player2) player2.loadVideoById(id2);
  else player2 = new YT.Player('player2', {
    height: '360', width: '640', videoId: id2,
    playerVars: { 'autoplay': 0, 'controls': 1 }
  });
}

function playBoth() {
  if (player1 && player2) {
    player1.seekTo(Math.max(0, delay1));
    player2.seekTo(Math.max(0, delay2));

    setTimeout(() => player1.playVideo(), delay1 * 1000);
    setTimeout(() => player2.playVideo(), delay2 * 1000);
  }
}

function pauseBoth() {
  if (player1) player1.pauseVideo();
  if (player2) player2.pauseVideo();
}

function resetBoth() {
  if (player1) player1.seekTo(Math.max(0, delay1));
  if (player2) player2.seekTo(Math.max(0, delay2));
}

function setVolume(playerNum, value) {
  const volume = parseInt(value);
  if (playerNum === 1 && player1) player1.setVolume(volume);
  if (playerNum === 2 && player2) player2.setVolume(volume);
}

function toggleMute(playerNum) {
  if (playerNum === 1 && player1) {
    muted[1] = !muted[1];
    player1[muted[1] ? 'mute' : 'unMute']();
  }
  if (playerNum === 2 && player2) {
    muted[2] = !muted[2];
    player2[muted[2] ? 'mute' : 'unMute']();
  }
}

function unmuteBoth() {
  if (player1) {
    player1.unMute();
    muted[1] = false;
  }
  if (player2) {
    player2.unMute();
    muted[2] = false;
  }
}

function toggleSolo() {
  soloState = !soloState;
  if (player1 && player2) {
    if (soloState) {
      player1.mute();  muted[1] = true;
      player2.unMute(); muted[2] = false;
    } else {
      player1.unMute(); muted[1] = false;
      player2.mute();  muted[2] = true;
    }
  }
}

function updateDelay1(val) {
  delay1 = parseFloat(val);
  document.getElementById("delayDisplay1").textContent = `${delay1.toFixed(1)}s`;
}

function updateDelay(val) {
  delay2 = parseFloat(val);
  document.getElementById("delayDisplay").textContent = `${delay2.toFixed(1)}s`;
}
