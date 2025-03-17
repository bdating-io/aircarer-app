import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal
} from 'react-native';

export default class TimePickerModal extends React.Component {
  constructor(props) {
    super(props);

    const {
      start_time_separation_data = {},
      end_time_separation_data = {}
    } = this.props;

    this.state = {
      // 初始为空字符串 => 未输入
      start_hours: start_time_separation_data.hours ?? "",
      start_minutes: start_time_separation_data.minutes ?? "",
      is_selected_start_am: start_time_separation_data.is_am ?? true,
      is_selected_start_pm: start_time_separation_data.is_pm ?? false,

      end_hours: end_time_separation_data.hours ?? "",
      end_minutes: end_time_separation_data.minutes ?? "",
      is_selected_end_am: end_time_separation_data.is_am ?? true,
      is_selected_end_pm: end_time_separation_data.is_pm ?? false,

      // 用于显示错误信息
      errorMsg: ""
    };
  }

  /**
   * 如果 val 是空字符串，说明用户没输入数字，就返回 ""。
   * 若用户输入数字，则转成 Number 并校验范围（小时 1~12；分钟 0~59）。
   */
  validateHour = (val) => {
    if (val === "") {
      return "";
    }
    let num = parseInt(val, 10);
    if (isNaN(num)) {
      return "";
    }
    if (num < 1) num = 1;
    if (num > 12) num = 12;
    return num.toString();
  };

  validateMinutes = (val) => {
    if (val === "") {
      return "";
    }
    let num = parseInt(val, 10);
    if (isNaN(num)) {
      return "";
    }
    if (num < 0) num = 0;
    if (num > 59) num = 59;
    return num.toString();
  };

  onChangeStartHourInput = (text) => {
    const newHours = this.validateHour(text);
    this.setState({ start_hours: newHours });
  };

  onChangeStartMinuteInput = (text) => {
    const newMinutes = this.validateMinutes(text);
    this.setState({ start_minutes: newMinutes });
  };

  onChangeEndHourInput = (text) => {
    const newHours = this.validateHour(text);
    this.setState({ end_hours: newHours });
  };

  onChangeEndMinuteInput = (text) => {
    const newMinutes = this.validateMinutes(text);
    this.setState({ end_minutes: newMinutes });
  };

  // 切换AM/PM
  onPressAmButton = (isStart) => {
    if (isStart) {
      this.setState({
        is_selected_start_am: true,
        is_selected_start_pm: false
      });
    } else {
      this.setState({
        is_selected_end_am: true,
        is_selected_end_pm: false
      });
    }
  };

  onPressPmButton = (isStart) => {
    if (isStart) {
      this.setState({
        is_selected_start_am: false,
        is_selected_start_pm: true
      });
    } else {
      this.setState({
        is_selected_end_am: false,
        is_selected_end_pm: true
      });
    }
  };

  /**
   * 把 12 小时制 (hh:mm, AM/PM) 转成从 0:00 开始算的总分钟数 [0, 1439].
   * - 12:xx AM => 0:xx
   * - 1:xx AM => 1:xx
   * - 12:xx PM => 12:xx (中午)
   * - 1:xx PM => 13:xx
   */
  parseTimeToMinutes = (hoursString, minutesString, isAM) => {
    const h = parseInt(hoursString, 10);
    const m = parseInt(minutesString, 10);

    // 防御性，如果用户输入没转成数字，也返回0
    if (isNaN(h) || isNaN(m)) return 0;

    let hours24;
    if (h === 12 && isAM) {
      // 12:xx AM => 0:xx
      hours24 = 0;
    } else if (h === 12 && !isAM) {
      // 12:xx PM => 12:xx
      hours24 = 12;
    } else if (!isAM) {
      // PM 且不是12点 => +12
      hours24 = h + 12;
    } else {
      // 普通AM => 就是 h
      hours24 = h;
    }
    return hours24 * 60 + m;
  };

  onPressCancel = () => {
    if (this.props.onPressCancelFn) {
      this.props.onPressCancelFn();
    }
  };

  onPressOk = () => {
    const {
      start_hours,
      start_minutes,
      is_selected_start_am,
      end_hours,
      end_minutes,
      is_selected_end_am
    } = this.state;

    // (1) 检查是否有空
    if (
      start_hours === "" ||
      start_minutes === "" ||
      end_hours === "" ||
      end_minutes === ""
    ) {
      this.setState({ errorMsg: "Please enter both start and end time." });
      return;
    }

    // (2) 转成 0~1439 的分钟数
    const startTotal = this.parseTimeToMinutes(
      start_hours,
      start_minutes,
      is_selected_start_am
    );
    const endTotal = this.parseTimeToMinutes(
      end_hours,
      end_minutes,
      is_selected_end_am
    );

    // (3) 如果开始 >= 结束，则报错
    if (startTotal >= endTotal) {
      this.setState({ errorMsg: "Start time must be earlier than end time." });
      return;
    }

    // (4) 校验都通过 => 清空错误信息
    this.setState({ errorMsg: "" });

    // (5) 拼出 "8:00 AM" 这样的字符串
    const startAmPm = is_selected_start_am ? "AM" : "PM";
    const endAmPm = is_selected_end_am ? "AM" : "PM";
    const startTime = `${start_hours}:${start_minutes} ${startAmPm}`;
    const endTime = `${end_hours}:${end_minutes} ${endAmPm}`;

    // 回调给父组件
    if (this.props.onPressOkFn) {
      this.props.onPressOkFn({ start_time: startTime, end_time: endTime });
    }
  };

  render() {
    return (
      <Modal
        transparent
        animationType="slide"
        // 你也可以通过 props.visible 来控制
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Select Time Range</Text>

            {/* 显示错误信息 */}
            {this.state.errorMsg !== "" && (
              <Text style={styles.errorText}>{this.state.errorMsg}</Text>
            )}

            {/* ------ 开始时间 ------ */}
            <Text style={styles.subTitle}>Start Time</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="HH"
                placeholderTextColor="#999"
                value={this.state.start_hours}
                onChangeText={this.onChangeStartHourInput}
              />
              <Text style={{ marginHorizontal: 4 }}>:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="MM"
                placeholderTextColor="#999"
                value={this.state.start_minutes}
                onChangeText={this.onChangeStartMinuteInput}
              />

              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  this.state.is_selected_start_am ? styles.amPmButtonActive : null
                ]}
                onPress={() => this.onPressAmButton(true)}
              >
                <Text style={styles.amPmText}>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  this.state.is_selected_start_pm ? styles.amPmButtonActive : null
                ]}
                onPress={() => this.onPressPmButton(true)}
              >
                <Text style={styles.amPmText}>PM</Text>
              </TouchableOpacity>
            </View>

            {/* ------ 结束时间 ------ */}
            <Text style={styles.subTitle}>End Time</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="HH"
                placeholderTextColor="#999"
                value={this.state.end_hours}
                onChangeText={this.onChangeEndHourInput}
              />
              <Text style={{ marginHorizontal: 4 }}>:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="MM"
                placeholderTextColor="#999"
                value={this.state.end_minutes}
                onChangeText={this.onChangeEndMinuteInput}
              />

              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  this.state.is_selected_end_am ? styles.amPmButtonActive : null
                ]}
                onPress={() => this.onPressAmButton(false)}
              >
                <Text style={styles.amPmText}>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  this.state.is_selected_end_pm ? styles.amPmButtonActive : null
                ]}
                onPress={() => this.onPressPmButton(false)}
              >
                <Text style={styles.amPmText}>PM</Text>
              </TouchableOpacity>
            </View>

            {/* ------ 按钮 ------ */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <TouchableOpacity onPress={this.onPressCancel} style={[styles.btn, { marginRight: 16 }]}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onPressOk} style={styles.btn}>
                <Text style={styles.btnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12
  },
  errorText: {
    color: 'red',
    marginBottom: 8
  },
  subTitle: {
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    width: 50,
    textAlign: 'center',
    borderRadius: 4
  },
  amPmButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 8
  },
  amPmButtonActive: {
    backgroundColor: '#4E89CE',
    borderColor: '#4E89CE'
  },
  amPmText: {
    color: '#333'
  },
  btn: {
    backgroundColor: '#4E89CE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6
  },
  btnText: {
    color: '#fff',
    fontWeight: '600'
  }
});
