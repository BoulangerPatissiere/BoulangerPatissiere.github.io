import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationDialog from '../../../Global/Components/ActionConfirmationDialog/ConfirmationDialog';
import { api } from '../../../Global/constants';
import useToken from '../../../Global/Hooks/useToken';
import './CakeCard.css';

export default function CakeCard(props) {
    const [cake, setCake] = useState();
    const { token } = useToken();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    useEffect(() => {
        if (cake !== props.cake) {
            setCake(props.cake);
        }
    }, [props.cake]);

    const handleOnDeleteIconClicked = () => {
        setIsDeleteDialogOpen(true);
    }

    const switchAvailabilityAsync = async (e) => {
        try {
            const response = await fetch(`${api}/cakes/${cake.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentUserId: token.id, ...cake, isAvailable: e.target.checked })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            setCake(result);
            return result;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    const performDeleteAsync = async () => {
        props.setIsDeleting(true);
        try {
            const response = await fetch(`${api}/cakes/${cake.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentUserId: token.id })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            return result;
        }
        catch (err) {
            console.log(err);
            return null;
        }
        finally {
            setIsDeleteDialogOpen(false);
            props.setIsDeleting(false);
            props.onDeleteClicked();
        }
    }

    return (
        <React.Fragment>
            {cake && <Card>
                <ConfirmationDialog isOpen={isDeleteDialogOpen} title="Are you sure you want to delete this cake?"
                    confirmActionName="Delete"
                    onConfirmed={performDeleteAsync}
                    onCanceled={() => setIsDeleteDialogOpen(false)}
                    isLoading={props.isDeleting} />
                {cake.photo != null &&
                    <CardMedia
                        component="img"
                        height="300"
                        image={`data:image/png;base64,${cake.photo}`}
                        alt="Cannot disply cake photo"
                    />}
                <CardContent className="cake-card">
                    <Typography variant="h5" component="div" className="cake-card-title">{cake.name}</Typography>
                    <Typography variant='body' className="cake-card-desc">{cake.description}</Typography>

                    <div className="card-actions">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body">Is Available</Typography>
                            <Switch checked={cake.isAvailable}
                                onChange={e => switchAvailabilityAsync(e)} />
                        </Stack>
                        <Stack direction="row" spacing={0} alignItems="center">
                            <IconButton aria-label="edit" size="large" color="primary" onClick={() => props.onEditClicked(cake)}>
                                <EditIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton aria-label="delete" size="large" color="primary" onClick={handleOnDeleteIconClicked}>
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </Stack>
                    </div>
                </CardContent>
            </Card>}

        </React.Fragment>
    );
}