import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Image,
  TextInput,
  Alert,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { post, get } from "../../lib/api";

const RegisterInput = ({ icon, children }) => {
  return (
    <View
      style={{
        width: "90%",
        alignItems: "center",
        flexDirection: "row",
        borderBottomColor: "#cd4100",
        borderBottomWidth: 1,
        marginBottom: 16,
        height: 54,
        backgroundColor: "#242424",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      {icon && (
        <View
          style={{
            height: "100%",
            width: 50,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 2,
          }}
        >
          {icon}
        </View>
      )}
      {children}
    </View>
  );
};

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seePassword, setSeePassword] = useState(1);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(1);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(true);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const imageAnim = useState(new Animated.Value(1))[0];

  const checkValid = () => {
    if (name === "") {
      setError("Please enter your name.");
      return false;
    }
    if (mail === "") {
      setError("Please enter your e-mail address.");
      return false;
    }
    if (password === "") {
      setError("Please enter your password.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    // Additional validation can be added here
    return true;
  };

  const handleRegister = async () => {
    const valid = checkValid();
    if (valid) {
      setError("");
      try {
        const response = await post(
          "/register",
          {
            email: mail,
            password: password,
            password_confirmation: confirmPassword,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.success) {
          setOtpVisible(true); // Show OTP input field
          setShowRegister(false);
        } else {
          // Extract specific error messages
          if (response.errors) {
            const errorMessages = Object.values(response.errors)
              .flat()
              .join(", ");
            setError(errorMessages || "Registration failed. Please try again.");
          } else {
            setError(
              response.message || "Registration failed. Please try again."
            );
          }
        }
      } catch (error) {
        console.log(error.message); // Log the error message
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleVerifyOTP = async () => {
    const response = await post(
      "/verify-code",
      {
        email: mail,
        code: otp,
        password: password,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    if (otp.length === 6) {
      if (response.success) Alert.alert("Register completed successfully!");
      setError("");
      navigation.goBack();
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const switchSeePassword = () => {
    setSeePassword(seePassword ? 0 : 1);
  };

  const switchSeeConfirmPassword = () => {
    setSeeConfirmPassword(seeConfirmPassword ? 0 : 1);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("../../assets/background.png")}
          style={{ width: "100%", height: "100%", alignItems: "center" }}
        >
          <Animated.View
            style={{
              flex: imageAnim,
              backgroundColor: "#000000",
              justifyContent: "flex-end",
              alignItems: "center",
              borderBottomColor: "#333333",
              borderBottomWidth: 1.5,
            }}
          ></Animated.View>

          <Animated.View
            style={{
              flex: imageAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [5, 12],
              }),
              backgroundColor: "rgba(34, 34, 34, 0.8)",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 20,
              borderRadius: 20,
            }}
          >
            <Image
              style={{
                marginHorizontal: 30,
                marginTop: 10,
                width: 300,
                height: 300,
              }}
              source={require("../../assets/logo1.png")}
            />
            {showRegister && (
              <KeyboardAwareScrollView
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexGrow: 2,
                }}
              >
                <RegisterInput
                  icon={<Ionicons name="person" size={20} color="gray" />}
                >
                  <TextInput
                    placeholder="Name"
                    placeholderTextColor={"gray"}
                    style={{
                      height: 50,
                      width: "80%",
                      justifyContent: "center",
                      color: "white",
                      paddingLeft: 10,
                    }}
                    value={name}
                    onChangeText={setName}
                  />
                </RegisterInput>

                <RegisterInput
                  icon={<Ionicons name="mail" size={20} color="gray" />}
                >
                  <TextInput
                    placeholder="E-Mail Address"
                    placeholderTextColor={"gray"}
                    style={{
                      height: 50,
                      width: "80%",
                      justifyContent: "center",
                      color: "white",
                      paddingLeft: 10,
                    }}
                    value={mail}
                    onChangeText={setMail}
                  />
                </RegisterInput>

                <RegisterInput
                  icon={<Ionicons name="lock-closed" size={17} color="gray" />}
                >
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={"gray"}
                    textContentType="none"
                    style={{
                      height: 50,
                      width: "80%",
                      justifyContent: "center",
                      color: "white",
                      paddingLeft: 10,
                    }}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={seePassword === 1 ? true : false}
                  />
                  <TouchableOpacity onPress={switchSeePassword}>
                    <Ionicons
                      name={seePassword ? "eye-off" : "eye"}
                      size={20}
                      color="#cd4100"
                      style={{ position: "absolute", right: 15, bottom: -10 }}
                    />
                  </TouchableOpacity>
                </RegisterInput>
                <TextInput style={{ height: 0.01 }} />
                <RegisterInput
                  icon={<Ionicons name="lock-closed" size={17} color="gray" />}
                >
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor={"gray"}
                    textContentType="none"
                    style={{
                      height: 50,
                      width: "80%",
                      justifyContent: "center",
                      color: "white",
                      paddingLeft: 10,
                    }}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={seeConfirmPassword === 1 ? true : false}
                  />
                  <TouchableOpacity onPress={switchSeeConfirmPassword}>
                    <Ionicons
                      name={seeConfirmPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#cd4100"
                      style={{ position: "absolute", right: 15, bottom: -10 }}
                    />
                  </TouchableOpacity>
                </RegisterInput>

                {error ? (
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#cd4100",
                      backgroundColor: "#222222",
                      borderWidth: 1,
                      borderColor: "#cd4100",
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                    }}
                  >
                    {error}
                  </Text>
                ) : null}

                <TouchableOpacity
                  onPress={handleRegister}
                  style={{
                    height: 45,
                    width: "80%",
                    backgroundColor: "#cd4100",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    marginTop: 10,
                    paddingHorizontal: 100,
                  }}
                >
                  <Text style={{ color: "white" }}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  style={{ marginTop: 20 }}
                >
                  <Text style={{ fontSize: 17, color: "lightblue" }}>
                    Already have an account? Login
                  </Text>
                </TouchableOpacity>
              </KeyboardAwareScrollView>
            )}
            {otpVisible && (
              <View style={{ width: "80%", marginTop: 20 }}>
                <Text
                  style={{ color: "white", fontSize: 17, marginBottom: 10 }}
                >
                  We have sent you a verification code. Please enter it below.
                </Text>
                <RegisterInput>
                  <TextInput
                    placeholder="Enter OTP"
                    placeholderTextColor={"gray"}
                    style={{
                      height: 50,
                      width: "100%",
                      justifyContent: "center",
                      color: "white",
                      paddingLeft: 10,
                    }}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={6} // Assuming OTP is 6 digits
                  />
                </RegisterInput>
                {error ? (
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#cd4100",
                      backgroundColor: "#222222",
                      borderWidth: 1,
                      borderColor: "#cd4100",
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      marginVertical: 5,
                    }}
                  >
                    {error}
                  </Text>
                ) : null}
                <TouchableOpacity
                  onPress={handleVerifyOTP}
                  style={{
                    height: 45,
                    backgroundColor: "#cd4100",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>Verify OTP</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}
