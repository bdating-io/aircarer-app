interface TimeSeparationData {
  hours: string;
  minutes: string;
  is_am: boolean;
  is_pm: boolean;
}

interface AccessTimeData {
  agent_access_start_ts: string | null;
  agent_access_end_ts: string | null;
}

interface TimeModalLocalization {
  app_access_time_title: string;
  start_time_title: string;
  end_time_title: string;
  cancelButtonTxt: string;
  okButtonText: string;
}

export interface TimePickerModalProps {
  start_time_separation_data: TimeSeparationData;
  end_time_separation_data: TimeSeparationData;
  app_accessing_time_data: AccessTimeData;
  time_modal_localization: TimeModalLocalization;
  onPressOkFn: (data: { start_time: string; end_time: string }) => void;
  onPressCancelFn: () => void;
}

export default function TimePickerModal(
  props: TimePickerModalProps
): JSX.Element;
