import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import './AddEditCakeDialog.css';

const defaultCake = {
    name: "",
    description: "",
    photo: null,
    filename: "",
    isAvailable: true
};

export default function AddEditCakeDialog({ isOpen, model, onConfirmed, onCanceled, isSaving }) {
    const [cake, setCake] = React.useState(defaultCake);

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        const reg = /^.*base64,(?=\/)/;
        reader.onload = () => resolve(reader.result.replace(reg, ""));
        reader.onerror = error => reject(error);
    });

    const handleCapture = async (e) => {
        const file = e.target.files[0];
        if (!file.type.includes("image")) {
            console.log("Uploaded file must be a valid image");
        }
        else {
            const fileBase64 = await toBase64(file);
            if (fileBase64) {
                setCake({ ...cake, photo: fileBase64, filename: file.name });
            }
        }
    };

    React.useEffect(() => {
        if (cake != model) {
            if (!model) {
                setCake(defaultCake);
            }
            else {
                setCake(model);
            }
        }
    }, [model]);

    return (
        <Dialog
            open={isOpen}
            aria-labelledby="add-edit-cake-dialog"
        >
            <DialogTitle id="add-edit-cake-dialog-title">{model ? "Edit cake" : "Add cake"}</DialogTitle>
            {cake && <DialogContent className="add-edit-dialog-content">
                <TextField
                    sx={{ marginBottom: '12px', marginTop: '12px' }}
                    required
                    id="cake-name"
                    label="Name"
                    value={cake.name}
                    onChange={e => { setCake({ ...cake, name: e.target.value }) }}
                />
                <TextField sx={{ marginBottom: '12px', marginTop: '12px' }}
                    id="cake-name"
                    label="Description"
                    multiline
                    maxRows={4}
                    value={cake.description}
                    onChange={e => { setCake({ ...cake, description: e.target.value }) }}
                />
                <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: '12px', marginTop: '12px' }}>
                    <Typography variant="body">Is Available</Typography>
                    <Switch checked={cake.isAvailable}
                        onChange={e => { setCake({ ...cake, isAvailable: e.target.checked }) }}
                    />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                    <Button variant="contained" component="label">
                        Upload
                    <input hidden accept="image/*" type="file" onChange={handleCapture} />
                    </Button>
                    <Stack direction="row" alignItems="center">
                        <Typography variant="body">{cake.filename}</Typography>
                        <img style={{ objectFit: 'contain' }} src={`data:image/jpeg;base64,${cake.photo}`} width="50px" height="50px" ></img>
                    </Stack>
                </Stack>
            </DialogContent>}

            <DialogActions>
                <Button onClick={onCanceled}>Cancel</Button>
                <LoadingButton loading={isSaving} variant="contained" color="primary" onClick={() => onConfirmed(cake)} autoFocus>{model ? "Edit" : "Add"}</LoadingButton>
            </DialogActions>
        </Dialog >
    );
}

AddEditCakeDialog.propTypes = {
    onConfirmed: PropTypes.func.isRequired,
    onCanceled: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    model: PropTypes.object,
};