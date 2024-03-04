import { Box, Chip, FormControl, InputLabel, MenuItem, Select, } from "@mui/material";

interface MultiSelectProps {
    items: any[];
    displayKey?: string;
    value: any;
    maxSelections?: number;
    onChange: (items: any[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultiSelect = ({items, displayKey, value, onChange, maxSelections}: MultiSelectProps) => {
    const handleChange = (value: any) => {
        // When someone types a value in we get them as a comma separated string
        let val = typeof value === "string" ? value.split(",") : value;

        if(maxSelections && val.length > maxSelections) {
            val = val.splice(0);
        }

        onChange(val)
    }

    const handleDelete = (value: any) => {
        const index = items.findIndex(s => s === value);

        if(index > -1) {
            const newSelected = items.splice(index);
            onChange(newSelected);
        }
    }

    return (
        <FormControl>
            <InputLabel id="muli-select-label">Chip</InputLabel>
            <Select
            labelId="multi-select-label"
            id="multi-select"
            multiple
            value={value}
            onChange={handleChange}
            renderValue={(selected: any[]) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value: any, index: number) => (
                        <Chip key={index} label={displayKey ? value[displayKey] : value } onDelete={() => handleDelete(value)}/>
                    ))}
                </Box>
            )}
            MenuProps={MenuProps}
            >
            {items.map((item, index) => (
                <MenuItem
                key={index}
                value={item}
                >
                    { displayKey ? item[displayKey] : item }
                </MenuItem>
            ))}
            </Select>
    </FormControl>
    )
}

export default MultiSelect;