let s, btn, msg;
let port, w;
let busy = false;
let t = 0;

function setup() {
  createCanvas(400, 250);
  s = createSlider(0, 255, 0, 1);
  s.position(30, 170);
  s.style('width', '340px');
  btn = createButton('아두이노 연결');
  btn.position(30, 210);
  btn.mousePressed(con);
  msg = createP('연결 전');
  msg.position(160, 195);
}

function draw() {
  background(240);
  let v = s.value();
  noStroke();
  fill(60 + v * 0.76, 60 + v * 0.55, 40);
  circle(200, 75, 90);
  fill(30);
  textAlign(CENTER);
  textSize(20);
  text('밝기: ' + v, 200, 145);
  if (w && !busy && millis() - t >= 50) {
    t = millis();
    send(v);
  }
}

async function con() {
  if (!('serial' in navigator)) {
    msg.html('Chrome 또는 Edge에서 실행하세요.');
    return;
  }
  btn.attribute('disabled', '');
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    msg.html('보드 시작 중...');
    await new Promise(r => setTimeout(r, 1600));
    w = port.writable.getWriter();
    msg.html('연결됨');
  } catch (e) {
    if (port) {
      try {
        await port.close();
      } catch (err) {}
    }
    port = null;
    msg.html('연결 실패. 포트와 시리얼 모니터를 확인하세요.');
    btn.removeAttribute('disabled');
  }
}

async function send(v) {
  busy = true;
  try {
    await w.write(new Uint8Array([v]));
  } catch (e) {
    try {
      w.releaseLock();
      await port.close();
    } catch (err) {}
    w = null;
    port = null;
    msg.html('연결 끊김');
    btn.removeAttribute('disabled');
  }
  busy = false;
}
