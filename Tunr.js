import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import { Audio } from "expo-av";

const Tunr = () => {
  const [recording, setRecording] = useState();
  const [detectedFrequency, setDetectedFrequency] = useState(null);
  const [closestNote, setClosestNote] = useState(null);

  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);

      console.log("Recording started");
    } catch (e) {
      console.error("Failed to startRecording", e);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {detectedFrequency && (
        <Text style={{ fontSize: 16 }}>
          Detected Frequency: {detectedFrequency.toFixed(2)} Hz
        </Text>
      )}
      {closestNote && (
        <Text style={{ fontSize: 16 }}>
          Closest Note: {closestNote.note} ({closestNote.frequency.toFixed(2)}{" "}
          Hz)
        </Text>
      )}
    </View>
  );
};

export default Tunr;
