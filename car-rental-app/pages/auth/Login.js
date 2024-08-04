import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { post, get } from "../../lib/api";
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
import { Ionicons } from "@expo/vector-icons";

const LoginInput = ({ icon, children }) => {
  return (
    <View
      style={{
        width: "80%",
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

export default function Login({ navigation }) {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [error, setError] = useState("");
  const [cooldownCount, setCooldownCount] = useState(0);
  const [loginTryCounter, setLoginTryCounter] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetError, setResetError] = useState("");
  const imageAnim = useState(new Animated.Value(1))[0];

  const checkValid = () => {
    if (mail === "") {
      setError("Please enter your e-mail address.");
      return false;
    }
    if (password === "") {
      setError("Please enter your password.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    setError("");

    const valid = checkValid();
    if (valid) {
      try {
        const response = await post(
          "/login",
          {
            email: mail,
            password: password,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.success) {
          const userId = response.user.user_id;
          console.log(userId);
          navigation.replace("HomeTabs", { userId: userId });
        } else {
          if (response) {
            if (response.status === 401) {
              setError("Invalid email address or password.");
            }
          }
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        setError("An error occurred. Please try again.");
      }

      setLoginTryCounter(loginTryCounter + 1);
      if (loginTryCounter >= 2) {
        setCooldownCount(15);
        setLoginTryCounter(0);
      }
    }
  };

  useEffect(() => {
    var timer;
    if (cooldownCount > 0) {
      timer = setTimeout(() => {
        setCooldownCount(cooldownCount - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldownCount]);

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const guestLogin = () => {
    navigation.replace("HomeTabs");
  };

  const switchSeePassword = () => {
    setSeePassword(!seePassword);
  };

  const handleContinue = () => {
    setShowLogin(true);
    Animated.timing(imageAnim, {
      toValue: 0.3,
      duration: 700,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleForgotPassword = async () => {
    setResetSuccess("");
    setResetError("");
    if (resetEmail === "") {
      setResetError("Please enter your email address.");
      return;
    }
    try {
      const response = await post(
        "/forgotpassword",
        { email: resetEmail },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.success) {
        setResetSuccess("Verification code sent to your email.");
        setOtp(true);
      } else {
        setResetError("Failed to send verification code.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setResetError("An error occurred. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    try {
      const response = await post(
        "/changepassword",
        {
          email: resetEmail,
          code: otp,
          password: newPassword,
          password_confirmation: confirmNewPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response);

      if (response.success) {
        setResetSuccess("Password has been reset successfully.");
        setResetEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setForgotPassword(false);
      } else {
        setResetError("Failed to reset password.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setResetError("An error occurred. Please try again.");
    }
  };

  const clearErrors = () => {
    if (error) setError("");
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
          {showLogin && !forgotPassword && (
            <Animated.View
              style={{
                flex: imageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [5, 0],
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
              <LoginInput
                icon={<Ionicons name="mail" size={20} color="gray" />}
              >
                <TextInput
                  onFocus={clearErrors}
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
              </LoginInput>

              <LoginInput
                icon={<Ionicons name="lock-closed" size={17} color="gray" />}
              >
                <TextInput
                  onFocus={clearErrors}
                  placeholder="Password"
                  placeholderTextColor={"gray"}
                  style={{
                    height: 50,
                    width: "80%",
                    justifyContent: "center",
                    color: "white",
                    paddingLeft: 10,
                  }}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!seePassword}
                />
                <TouchableOpacity onPress={switchSeePassword}>
                  <Ionicons
                    name={seePassword ? "eye-off" : "eye"}
                    size={20}
                    color="#cd4100"
                    style={{ position: "absolute", right: 15, bottom: -10 }}
                  />
                </TouchableOpacity>
              </LoginInput>

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
                disabled={cooldownCount > 0}
                onPress={handleLogin}
                style={[
                  styles.button,
                  {
                    backgroundColor: cooldownCount > 0 ? "#555555" : "#cd4100",
                  },
                ]}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setForgotPassword(true);
                  setShowLogin(false);
                }}
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: "#cd4100", fontWeight: "bold" }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ color: "white" }}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={{ color: "#cd4100", fontWeight: "bold" }}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={guestLogin} style={{ marginTop: 10 }}>
                <Text style={{ color: "#cd4100", fontWeight: "bold" }}>
                  Continue as Guest
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {forgotPassword && (
            <Animated.View
              style={{
                flex: imageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
                backgroundColor: "rgba(34, 34, 34, 0.8)",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: 20,
                borderRadius: 20,
              }}
            >
              {!otp ? (
                <>
                  <Text
                    style={{
                      fontSize: 20,
                      color: "#cd4100",
                      marginVertical: 10,
                    }}
                  >
                    Forgot Password
                  </Text>
                  <LoginInput
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
                      value={resetEmail}
                      onChangeText={setResetEmail}
                    />
                  </LoginInput>

                  {resetError ? (
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
                      {resetError}
                    </Text>
                  ) : null}
                  {resetSuccess ? (
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#28a745",
                        backgroundColor: "#222222",
                        borderWidth: 1,
                        borderColor: "#28a745",
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                      }}
                    >
                      {resetSuccess}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    style={styles.button}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Send Verification Code
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setForgotPassword(false);
                      setShowLogin(true);
                    }}
                    style={{ marginTop: 10 }}
                  >
                    <Text style={{ color: "#cd4100", fontWeight: "bold" }}>
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: 20,
                      color: "#cd4100",
                      marginVertical: 10,
                    }}
                  >
                    Reset Password
                  </Text>

                  <LoginInput
                    icon={<Ionicons name="key" size={20} color="gray" />}
                  >
                    <TextInput
                      placeholder="Verification Code"
                      placeholderTextColor={"gray"}
                      style={{
                        height: 50,
                        width: "80%",
                        justifyContent: "center",
                        color: "white",
                        paddingLeft: 10,
                      }}
                      value={otp}
                      onChangeText={setOtp}
                    />
                  </LoginInput>

                  <LoginInput
                    icon={
                      <Ionicons name="lock-closed" size={17} color="gray" />
                    }
                  >
                    <TextInput
                      placeholder="New Password"
                      placeholderTextColor={"gray"}
                      style={{
                        height: 50,
                        width: "80%",
                        justifyContent: "center",
                        color: "white",
                        paddingLeft: 10,
                      }}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!seePassword}
                    />
                    <TouchableOpacity onPress={switchSeePassword}>
                      <Ionicons
                        name={seePassword ? "eye-off" : "eye"}
                        size={20}
                        color="#cd4100"
                        style={{ position: "absolute", right: 15, bottom: -10 }}
                      />
                    </TouchableOpacity>
                  </LoginInput>

                  <LoginInput
                    icon={
                      <Ionicons name="lock-closed" size={17} color="gray" />
                    }
                  >
                    <TextInput
                      placeholder="Confirm New Password"
                      placeholderTextColor={"gray"}
                      style={{
                        height: 50,
                        width: "80%",
                        justifyContent: "center",
                        color: "white",
                        paddingLeft: 10,
                      }}
                      value={confirmNewPassword}
                      onChangeText={setConfirmNewPassword}
                      secureTextEntry={!seePassword}
                    />
                    <TouchableOpacity onPress={switchSeePassword}>
                      <Ionicons
                        name={seePassword ? "eye-off" : "eye"}
                        size={20}
                        color="#cd4100"
                        style={{ position: "absolute", right: 15, bottom: -10 }}
                      />
                    </TouchableOpacity>
                  </LoginInput>

                  {resetError ? (
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
                      {resetError}
                    </Text>
                  ) : null}
                  {resetSuccess ? (
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#28a745",
                        backgroundColor: "#222222",
                        borderWidth: 1,
                        borderColor: "#28a745",
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                      }}
                    >
                      {resetSuccess}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    onPress={handleResetPassword}
                    style={styles.button}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Reset Password
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setForgotPassword(false);
                      setShowLogin(true);
                    }}
                    style={{ marginTop: 10 }}
                  >
                    <Text style={{ color: "#cd4100", fontWeight: "bold" }}>
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          )}
          <StatusBar style="light" />
          {!showLogin && !forgotPassword && (
            <TouchableOpacity
              onPress={handleContinue}
              style={{
                position: "absolute",
                bottom: "50%",
                backgroundColor: "#cd4100",
                borderRadius: 5,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginLeft: "37%",
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                Start exploring the cars!
              </Text>
            </TouchableOpacity>
          )}
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 290,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 15,
    marginVertical: 15,
    backgroundColor: "#cd4100",
  },
});
