import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, View } from "react-native";

export default function DatePickerModal({ visible, onClose, onSelect }) {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={{ flex:1, justifyContent:"center", backgroundColor:"rgba(0,0,0,0.4)" }}>
        <View style={{ backgroundColor:"#fff", borderRadius:20, margin:20 }}>
          <DateTimePicker
            mode="date"
            display="calendar"
            onChange={(_, d) => {
              if (d) onSelect(d);
              onClose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
