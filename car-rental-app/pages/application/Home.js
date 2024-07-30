import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const route = useRoute();
  const userId = route.params.userId;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Welcome to the Home Screen!</Text>
      <Text>User ID: {userId}</Text>
    </View>
  );
};

export default Home;
