import { TextField } from '@mui/material';

export default function InputField({ label, type = 'text', register, name }) {
    return (
        <TextField
            fullWidth
            label={label}
            type={type}
            margin="normal"
            {...register(name)}
        />
    );
}
