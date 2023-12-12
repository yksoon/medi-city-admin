import React from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

const RadioGroupSelection = (props) => {
    const radioItems = props.radioItems ?? [];
    const name = props.name ?? "";
    const value = props.value ?? "";
    const onChange = props.onChange;

    return (
        <>
            <RadioGroup
                row
                value={value ? value : ""}
                onChange={(e) => onChange(e)}
            >
                {radioItems.length !== 0 &&
                    radioItems.map((item, idx) => (
                        <FormControlLabel
                            key={`${name}_${idx}`}
                            value={item.value}
                            control={<Radio size="small" />}
                            label={item.label}
                        />
                    ))}
            </RadioGroup>
        </>
    );
};

export default RadioGroupSelection;
