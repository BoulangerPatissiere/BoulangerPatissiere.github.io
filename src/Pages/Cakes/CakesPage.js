import * as React from 'react';
import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import CakeCard from './CakeCard/CakeCard';
import { api } from '../../Global/constants';
import useToken from '../../Global/Hooks/useToken';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './CakesPage.css';
import AddEditCakeDialog from './CakeDialog/AddEditCakeDialog';

function CakesPage() {
    const [cakes, setCakes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editModel, setEditModel] = useState(null);
    const { token } = useToken();

    const fetchCakes = () => {
        setIsLoading(true);
        fetch(`${api}/cakes`)
            .then(response => response.json())
            .then(setCakes)
            .finally(setIsLoading(false));
    }

    useEffect(() => {
        fetchCakes();
    }, []);

    const performEdit = async (model) => {
        if (!model.name) {
            console.log("Name cannot be empty.");
        }
        else if (!model.photo && !model.filename) {
            console.log("Photo cannot be empty.");
        }
        else if (!model.id) {
            setIsLoading(true);
            try {
                const response = await fetch(`${api}/cakes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...model, currentUserId: token.id })
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                await response.json();
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setIsEditDialogOpen(false);
                setIsLoading(false);
                fetchCakes();
            }
        }
        else {
            setIsLoading(true);
            try {
                const response = await fetch(`${api}/cakes/${model.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...model, currentUserId: token.id })
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                await response.json();
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setIsEditDialogOpen(false);
                setEditModel(null);
                fetchCakes();
            }
        }
    }

    return (
        <React.Fragment>
            <Box sx={{ width: '100%', height: '4px' }} >
                <LinearProgress sx={isLoading ? { display: "block" } : { display: "none" }} />
            </Box>
            <div className="cakes-toolbar">
                <IconButton aria-label="add-cake" onClick={() => { setEditModel(null); setIsEditDialogOpen(true); }}>
                    <AddCircleIcon color="primary" fontSize="large" />
                </IconButton>
            </div>

            <AddEditCakeDialog isSaving={isLoading} model={editModel} isOpen={isEditDialogOpen} onConfirmed={performEdit} onCanceled={() => setIsEditDialogOpen(false)} />
            {cakes && cakes.length > 0 &&
                <div className="cakes-container">{cakes.map(cake => <CakeCard setIsDeleting={setIsLoading} isDeleting={isLoading} key={cake.id} cake={cake} onEditClicked={(cake) => { setEditModel(cake); setIsEditDialogOpen(true); }} onDeleteClicked={fetchCakes} />)}</div>
            }
        </React.Fragment>
    );
}

export default CakesPage;
