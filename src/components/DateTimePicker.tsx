import React, { useState } from "react";
import {convertToLocalDatetime} from "@/app/services/commonService";

interface DateTimePickerProps {
    initialDatetime?: string;
    inputName: string;
    onChange?: (name: string, value: string) => void; // Thêm prop để truyền dữ liệu lên
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ initialDatetime = "", inputName, onChange }) => {
    const [datetime, setDatetime] = useState(convertToLocalDatetime(initialDatetime) || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDatetime(e.target.value);
        if (onChange) {
            onChange(inputName, e.target.value);
        }
    };

    return (
        <input
            type="datetime-local"
            className="form-control"
            name={inputName}
            value={datetime}
            onChange={handleChange}
        />
    );
};

export default DateTimePicker;
