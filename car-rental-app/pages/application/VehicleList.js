import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";

import { get } from "../../lib/api";
import Icon from "react-native-vector-icons/FontAwesome5";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await get("/getvehicles");
        if (response.success) {
          const vehicleData = response.vehicles || [];
          setVehicles(vehicleData);
        } else {
          setError(response.message || "Failed to fetch vehicles.");
        }
      } catch (error) {
        setError("An error occurred while fetching vehicles.");
      }
    };

    fetchVehicles();
  }, []);

  const images = {
    "camry.jpg": require("../../assets/camry.jpg"),
    "civic.jpg": require("../../assets/civic.jpg"),
    "mustang.jpg": require("../../assets/mustang.jpg"),
    "malibu.jpg": require("../../assets/malibu.jpg"),
    "bmw_3series.jpg": require("../../assets/bmw_3series.jpg"),
    "audi_a4.jpg": require("../../assets/audi_a4.jpg"),
    "outlander.jpg": require("../../assets/outlander.jpg"),
    "elantra.jpg": require("../../assets/elantra.jpg"),
    "mini.jpg": require("../../assets/mini.jpg"),
    "mazda6.jpg": require("../../assets/mazda6.jpg"),
  };

  const getImage = (imageName) => {
    return images[imageName];
  };

  const renderItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <Image source={getImage(item.image)} style={styles.vehicleImage} />
      <View style={styles.vehicleInfo}>
        <Text style={styles.makeModel}>{`${item.make} ${item.model}`}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Icon name="gas-pump" size={20} width={20} color="#cd4100" />
            <Text style={styles.detailText}>{item.fuel}</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="atom" size={20} width={20} color="#cd4100" />
            <Text style={styles.detailText}>{item.transmission}</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="calendar" size={20} width={20} color="#cd4100" />
            <Text style={styles.detailText}>{item.year}</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="tachometer-alt" size={20} width={24} color="#cd4100" />
            <Text style={styles.detailText}>{item.kilometers} km</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="dollar-sign" size={20} width={11} color="#cd4100" />
            <Text style={styles.detailText}>{item.daily_rate} / day</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.panel}>
        {vehicles.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={vehicles}
            renderItem={renderItem}
            keyExtractor={(item) => item.vehicle_id.toString()}
          />
        ) : (
          <Text style={styles.error}>{error || "No vehicles available."}</Text>
        )}
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
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(34, 34, 34, 0.95)",
    borderRadius: 20,
    padding: 20,
    marginTop: 50,
    alignItems: "center",
  },
  vehicleCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  vehicleImage: {
    height: 150,
    width: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  makeModel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  vehicleInfo: {
    width: "95%",
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff1",
    borderRadius: 10,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginBottom: 7,
  },
  detailText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    width: 63,
  },
  error: {
    color: "#cd4100",
    fontSize: 16,
    marginTop: 10,
  },
});

export default VehicleList;
