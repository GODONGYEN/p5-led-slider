const byte led = 13;
byte v = 0;
unsigned long t = 0;
unsigned long rx = 0;

void setup() {
  pinMode(led, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  if (Serial.available()) {
    v = Serial.read();
    rx = millis();
    Serial.write(v);
  }
  if (millis() - rx > 2000) v = 0;

  unsigned long el = micros() - t;
  if (el >= 2040) {
    t += (el / 2040) * 2040;
    el %= 2040;
  }
  digitalWrite(led, v == 255 || el < v * 8UL);
}
