const int ledPin = 13;
String inputString = "";
bool stringComplete = false;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Arduino ready");
}

void loop() {
  if (stringComplete) {
    inputString.trim();  // Remove \n or \r
    if (inputString == "on") {
      digitalWrite(ledPin, HIGH);
    } else if (inputString == "off") {
      digitalWrite(ledPin, LOW);
    }
    inputString = "";
    stringComplete = false;
  }
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      stringComplete = true;
    } else {
      inputString += inChar;
    }
  }
}
