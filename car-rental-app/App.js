import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/application/Home";
import Profile from "./pages/application/Profile";
import VehicleList from "./pages/application/VehicleList";
import RentVehicle from "./pages/application/RentVehicle";
import Reservations from "./pages/application/Reservations";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="HomeTabs"
          component={HomeTabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeTabs({ route }) {
  const { userId } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Vehicle List") {
            iconName = "list-alt";
          } else if (route.name === "Rent Vehicle") {
            iconName = "car-rental";
          } else if (route.name === "My Reservations") {
            iconName = "pending-actions";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: "#222222",
          paddingTop: 10,
          height: 75,
        },
        tabBarActiveBackgroundColor: "#222222",
        tabBarInactiveBackgroundColor: "#222222",
        tabBarActiveTintColor: "#cd4100",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
        initialParams={{ userId }} // Passing userId to Home
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="My Reservations"
        component={Reservations}
        initialParams={{ userId }} // Passing userId to Rent
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Rent Vehicle"
        component={RentVehicle}
        initialParams={{ userId }} // Passing userId to Rent
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Vehicle List"
        component={VehicleList}
        initialParams={{ userId }} // Passing userId to Cars
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={Profile}
        initialParams={{ userId }} // Passing userId to Profile
      />
    </Tab.Navigator>
  );
}
