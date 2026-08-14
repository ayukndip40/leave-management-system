import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";


interface RecentActivityCardProps {
  title: string;
  description: string;
  time: string;
  icon: string;
}


export default function RecentActivityCard({
  title,
  description,
  time,
  icon,
}: RecentActivityCardProps) {

  return (

    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
    >

      {/* Avatar */}
      <View style={styles.avatar}>

        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color="#1877F2"
        />

      </View>



      {/* Content */}
      <View style={styles.content}>


        <Text style={styles.title}>
          {title}
        </Text>



        <Text style={styles.description}>
          {description}
        </Text>



        <Text style={styles.time}>
          {time}
        </Text>


      </View>


    </TouchableOpacity>

  );

}



const styles = StyleSheet.create({

container: {

  flexDirection: "row",

  backgroundColor: "#FFFFFF",

  padding: 14,

  marginBottom: 10,

  borderRadius: 12,

  alignItems: "flex-start",

},



avatar: {

  width: 44,

  height: 44,

  borderRadius: 22,

  backgroundColor: "#E7F3FF",

  justifyContent: "center",

  alignItems: "center",

  marginRight: 12,

},



content: {

  flex: 1,

},



title: {

  fontSize: 15,

  fontWeight: "700",

  color: "#050505",

  marginBottom: 4,

},



description: {

  fontSize: 14,

  color: "#65676B",

  lineHeight: 20,

},



time: {

  marginTop: 5,

  fontSize: 12,

  color: "#8A8D91",

},


});