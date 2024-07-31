import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { get, post } from "../../lib/api";

const Profile = ({ navigation }) => {
  const route = useRoute();
  const userId = route.params?.userId;

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("You must register to use this page.");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await get(`/user/${userId}`);
        if (response.success) {
          setUserInfo(response.data);
        } else {
          setError(response.message || "Failed to fetch user data.");
        }
      } catch (error) {
        setError("An error occurred while fetching user data.");
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleRegister = () => {
    navigation.replace("Register");
  };

  const handleEdit = async () => {
    if (editField && newValue) {
      try {
        const fieldToUpdate = editField;
        const postData = {
          user_id: userId,
          [fieldToUpdate]: newValue,
        };

        const response = await post(`/user/update/${fieldToUpdate}`, postData);

        if (response.success) {
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            [fieldToUpdate]: newValue,
          }));
          setEditField(null);
          setNewValue("");
          setError("");
        } else {
          if (response.errors) {
            const errorMessages = Object.values(response.errors)
              .flat()
              .join(", ");
            setError(errorMessages || "Failed to update information.");
          } else {
            setError(response.message || "Failed to update information.");
          }
        }
      } catch (error) {
        console.error("Update Error:", error);
        setError("An error occurred while updating user data.");
      }
    } else {
      setError("Please enter a new value.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.panel}>
        {userId ? (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              {editField === "name" ? (
                <TextInput
                  style={styles.input}
                  value={newValue}
                  onChangeText={setNewValue}
                  onSubmitEditing={handleEdit}
                  keyboardType="default"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              ) : (
                <Text style={styles.value}>{userInfo.name}</Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (editField === "name") {
                    handleEdit();
                  } else {
                    setEditField("name");
                    setNewValue(userInfo.name);
                  }
                }}
              >
                <Ionicons
                  name={editField === "name" ? "checkmark" : "pencil"}
                  size={20}
                  color="#cd4100"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              {editField === "email" ? (
                <TextInput
                  style={styles.input}
                  value={newValue}
                  onChangeText={setNewValue}
                  onSubmitEditing={handleEdit}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              ) : (
                <Text style={styles.value}>{userInfo.email}</Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (editField === "email") {
                    handleEdit();
                  } else {
                    setEditField("email");
                    setNewValue(userInfo.email);
                  }
                }}
              >
                <Ionicons
                  name={editField === "email" ? "checkmark" : "pencil"}
                  size={20}
                  color="#cd4100"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
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
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  panel: {
    width: "90%",
    backgroundColor: "rgba(34, 34, 34, 0.8)",
    borderRadius: 20,
    padding: 20,
    marginTop: 50,
    alignItems: "center",
  },
  infoContainer: {
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    color: "white",
    fontSize: 18,
    width: 100,
  },
  value: {
    color: "white",
    fontSize: 18,
    flex: 1,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#cd4100",
    borderBottomWidth: 1,
    color: "white",
    fontSize: 18,
  },
  error: {
    color: "#cd4100",
    fontSize: 16,
    marginTop: 10,
  },
});

export default Profile;
