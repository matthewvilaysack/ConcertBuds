import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const TransitOptions = ({ transitSteps }) => {
  const getIconForTransitMode = (mode, transitDetails) => {
    if (mode === "TRANSIT" && transitDetails && transitDetails.line) {
      const vehicleType = transitDetails.line.vehicle.name; // e.g., "Train" or "Bus"
      switch (vehicleType) {
        case "Train":
          return (
            <View style={styles.transitContainer}>
              <FontAwesome5 name="train" size={24} style={styles.icon} />
              <View
                style={[
                  styles.lineContainer,
                  { backgroundColor: transitDetails.line.color },
                ]}
              >
                <Text style={styles.lineText}>
                  {transitDetails.trip_short_name}
                </Text>
              </View>
            </View>
          );
        case "Bus":
          return (
            <View style={styles.transitContainer}>
              <FontAwesome5 name="bus" size={24} style={styles.icon} />
              <View
                style={[
                  styles.lineContainer,
                  { backgroundColor: transitDetails.line.color },
                ]}
              >
                <Text style={styles.lineText}>
                  {transitDetails.line.short_name}
                </Text>
              </View>
            </View>
          );
        default:
          return (
            <FontAwesome5
              name="question-circle"
              size={24}
              style={styles.icon}
            />
          );
      }
    }

    // Handle other travel modes
    switch (mode) {
      case "WALKING":
        return (
          <FontAwesome5
            name="walking"
            size={24}
            style={[styles.icon, styles.transitContainer]}
          />
        );
      default:
        return (
          <FontAwesome5 name="question-circle" size={24} style={styles.icon} />
        );
    }
  };

  return (
    <View style={styles.transitContainer}>
      {transitSteps.length > 0 ? (
        <FlatList
          horizontal={true}
          data={transitSteps}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.transitStep}>
              {getIconForTransitMode(item.travel_mode, item.transit_details)}
              {index < transitSteps.length - 1 && (
                <FontAwesome5
                  name="arrow-right"
                  size={24}
                  style={[styles.icon, styles.transitContainer]}
                />
              )}

              <View style={styles.transitDetails}>
                {/* <Text style={styles.transitInstruction}>
                  {item.html_instructions.replace(/<[^>]+>/g, "")}
                </Text> */}
                {/* {item.duration && (
                  <Text style={styles.transitDuration}>
                    Duration: {item.duration}
                  </Text>
                )}
                {item.line && (
                  <Text style={styles.transitAdditional}>
                    {item.line} Line, towards {item.headsign || "N/A"}
                  </Text>
                )}
                {item.departureStop && item.arrivalStop && (
                  <Text style={styles.transitAdditional}>
                    From {item.departureStop} to {item.arrivalStop}
                  </Text>
                )} */}
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTransitText}>No transit options available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  transitContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 4,
    paddingVertical: 5,
  },
  transitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  transitStep: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  transitDetails: {
    flex: 1,
  },
  transitInstruction: {
    fontSize: 16,
    marginBottom: 4,
  },
  transitDuration: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  transitAdditional: {
    fontSize: 14,
    color: "#777",
  },
  noTransitText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 16,
  },
  icon: {
    marginLeft: 8,
  },
  lineContainer: {
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  lineText: {
    fontFamily: "Doppio",
    color: "white",
  },
});

export default TransitOptions;
