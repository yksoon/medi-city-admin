import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { countryBankAtom } from "recoils/atoms";

export default function CountrySelect(props) {
    const onChange = props.onChange;
    const defaultValue = props.defaultValue;
    const mode = props.mode;

    const countryBank = useRecoilValue(countryBankAtom);

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        setCountriesFunc();
    }, [defaultValue]);

    const setCountriesFunc = () => {
        let options = [];
        const country = countryBank.filter(
            (e) => e.code_type === "INTER_PHONE_TYPE",
        );

        for (let i = 0; i < country.length; i++) {
            const value = country[i].code_key.split("-")[0];
            const countryCode = country[i].code_key.split("-")[1];
            let newObj = {};

            switch (mode) {
                case "full":
                    newObj = {
                        value: value,
                        label: `${country[i].code_value_ko} (${country[i].code_value_en}) (+${value})`,
                        countryCode: countryCode,
                    };
                    break;

                case "en":
                    newObj = {
                        value: value,
                        label: `${country[i].code_value_en} (+${value})`,
                        countryCode: countryCode,
                    };
                    break;

                case "ko":
                    newObj = {
                        value: value,
                        label: `${country[i].code_value_ko} (+${value})`,
                        countryCode: countryCode,
                    };
                    break;

                default:
                    newObj = {
                        value: value,
                        label: `${country[i].code_value_ko} (${country[i].code_value_en})`,
                        countryCode: countryCode,
                    };
            }

            options.push(newObj);
        }

        setCountries(options);
    };

    return (
        <>
            {countries.length !== 0 && (
                <Autocomplete
                    id="country-select-demo"
                    // sx={{ width: 300 }}
                    size="small"
                    options={countries}
                    value={
                        defaultValue
                            ? countries.filter(
                                  (el) => el.value === defaultValue,
                              )[0]
                            : null
                    }
                    // disableCloseOnSelect
                    // autoHighlight
                    getOptionLabel={(option) => option.label}
                    onChange={(e, newValue) =>
                        onChange(e, newValue ? newValue.value : "")
                    }
                    renderOption={(props, option) => (
                        <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                        >
                            <img
                                loading="lazy"
                                width="20"
                                srcSet={`https://flagcdn.com/w40/${option.countryCode.toLowerCase()}.png 2x`}
                                src={`https://flagcdn.com/w20/${option.countryCode.toLowerCase()}.png`}
                                alt=""
                            />
                            {option.label}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <>
                            <TextField
                                {...params}
                                // label="Choose a country"
                                inputProps={{
                                    ...params.inputProps,
                                }}
                                placeholder="국가를 선택해주세요"
                            />
                        </>
                    )}
                />
            )}
        </>
    );
}