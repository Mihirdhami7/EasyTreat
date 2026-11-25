/**
 * DateField — the Ant Design DatePicker used for every date on the site.
 *
 * Takes and returns dates as "YYYY-MM-DD" strings (what the backend stores), shows them as DD/MM/YYYY,
 * and blocks days before `min` / after `max` (both "YYYY-MM-DD", or "today").
 * Colours / dark mode come from <AntdThemeProvider> in App.jsx.
 */
import PropTypes from "prop-types";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const toDay = (value) => (value === "today" ? dayjs() : value ? dayjs(value) : null);

export default function DateField({ value, onChange, min, max, birthDate = false, className = "", ...rest }) {
  const minDay = toDay(min);
  const maxDay = toDay(max);
  const parsed = value ? dayjs(String(value).slice(0, 10)) : null;
  return (
    <DatePicker
      format="DD/MM/YYYY"
      placeholder="DD/MM/YYYY"
      // a date of birth: open the calendar ~25 years back instead of on today
      defaultPickerValue={birthDate && !value ? dayjs().subtract(25, "year") : undefined}
      {...rest}
      className={`w-full ${className}`}
      value={parsed && parsed.isValid() ? parsed : null}
      onChange={(d) => onChange(d ? d.format("YYYY-MM-DD") : "")}
      disabledDate={(d) => Boolean(d && ((minDay && d.isBefore(minDay, "day")) || (maxDay && d.isAfter(maxDay, "day"))))}
    />
  );
}

DateField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.string,
  max: PropTypes.string,
  birthDate: PropTypes.bool,
  className: PropTypes.string,
};
