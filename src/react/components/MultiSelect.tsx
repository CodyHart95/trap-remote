import { Box, Chip, InputLabel, MenuItem, Select, styled } from "@mui/material";

const Label = styled(InputLabel)`
    color: black;
    font-weight: bold;
`;

interface MultiSelectProps {
    items: any[];
    displayKey?: string;
    value: any;
    maxSelections?: number;
    label: string;
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

const MultiSelect = ({items, displayKey, value, onChange, maxSelections, label}: MultiSelectProps) => {
    const handleChange = (event: any) => {
        const value = event.target.value;
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
            items.splice(index);
            onChange([...items]);
        }
    }

    return (
        <div style={{width: "100%"}}>
            <Label htmlFor="multi-select">
                {label}
            </Label>
            <Select
            id="multi-select"
            sx={{width: "100%"}}
            multiple
            value={value}
            onChange={handleChange}
            renderValue={(selected: any[]) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value: any, index: number) => (
                        <Chip key={index} label={displayKey ? value[displayKey] : value } onDelete={() => handleDelete(value)} onMouseDown={(e) => e.stopPropagation()} tabIndex={1000}/>
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
        </div>
    )
}

export default MultiSelect;