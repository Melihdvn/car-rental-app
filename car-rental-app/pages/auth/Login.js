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
  const [seePassword, setSeePassword] = useState(1);
  const [error, setError] = useState("");
  const [cooldownCount, setCooldownCount] = useState(0);
  const [loginTryCounter, setLoginTryCounter] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
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
    setSeePassword(seePassword ? 0 : 1);
  };

  const handleContinue = () => {
    setShowLogin(true);
    Animated.timing(imageAnim, {
      toValue: 0.3, // Burada yüksekliği ayarlayın
      duration: 700,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
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
          {showLogin && (
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
              {showLogin && (
                <Image
                  style={{
                    marginHorizontal: 30,
                    marginTop: 10,
                    width: 300,
                    height: 300,
                  }}
                  source={require("../../assets/logo1.png")}
                />
              )}
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
                  secureTextEntry={seePassword === 1 ? true : false}
                />
                <TouchableOpacity onPress={() => switchSeePassword()}>
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

              {cooldownCount > 0 ? (
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
                    marginTop: 5,
                  }}
                >
                  {"Too many attempts! Please wait " +
                    cooldownCount +
                    " seconds"}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={cooldownCount === 0 ? handleLogin : null}
                style={{
                  height: 45,
                  width: "80%",
                  backgroundColor: cooldownCount === 0 ? "#cd4100" : "#444444",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                  marginTop: 10,
                  paddingHorizontal: 100,
                }}
              >
                <Text style={{ color: cooldownCount === 0 ? "white" : "#333" }}>
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRegister} style={{}}>
                <Text
                  style={{ fontSize: 17, color: "lightblue", marginTop: 20 }}
                >
                  Don"t have an account? Register
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={guestLogin} style={{}}>
                <Text style={{ color: "#666666", marginTop: 25 }}>
                  Continue without Login
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          {!showLogin && (
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
