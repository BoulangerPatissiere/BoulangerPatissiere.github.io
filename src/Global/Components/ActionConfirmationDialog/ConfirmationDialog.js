import * as React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export default function ConfirmationDialog({ isOpen, title, confirmActionName, onConfirmed, onCanceled, isLoading }) {

    return (
        <Dialog
            open={isOpen}
            onClose={onCanceled}
            aria-labelledby="confirmation-dialog-title"
        >
            <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirmation-dialog-description"> This action is irreversible. </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCanceled}>Cancel</Button>
                <LoadingButton loading={isLoading} variant="contained" color="primary" onClick={onConfirmed} autoFocus>{confirmActionName ?? "Confirm"}</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}

ConfirmationDialog.propTypes = {
    onConfirmed: PropTypes.func.isRequired,
    onCanceled: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    confirmActionName: PropTypes.string,
    isLoading: PropTypes.bool
};