import { buyStock } from "@/store/settings/user";
import { formatCurr } from "@/utils/format-number";
import { TransactionTypeMap } from "@/utils/timestamp";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import { unwrapResult } from "@reduxjs/toolkit";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const steps = ["Enter Details", "Confirm Purchase"];

const Buy = ({ stock, open, handleClose, type }) => {
  const [shares, setShares] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { firestoreUser: portfolio } = useSelector(
    (state) => state.firestore.data
  );

  const _handleClose = () => {
    setShares(1);
    setActiveStep(0);
    handleClose();
  };

  const handleCancel = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    } else {
      _handleClose();
    }
  };

  const handleSharesChange = (e) => {
    setShares(parseInt(e.target.value));
  };

  const handleBuy = async () => {
    try {
      if (activeStep === 0) {
        setActiveStep(1);
      } else {
        setLoading(true);
        let results = await dispatch(
          buyStock({
            stockId: stock.id,
            shares: parseInt(shares),
            type,
            userId: portfolio.id,
            price: stock.price,
          })
        );

        unwrapResult(results);

        _handleClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={_handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {TransactionTypeMap[type]}{" "}
          <Typography
            sx={{
              fontWeight: 600,
              display: "inline",
            }}
            component="span"
            variant="h6"
          >
            {stock.name}
          </Typography>{" "}
          at{" "}
          <Typography
            sx={{
              fontWeight: 600,
              display: "inline",
            }}
            component="span"
            variant="h6"
          >
            {formatCurr(stock.price)}
          </Typography>
        </Typography>
        <IconButton onClick={_handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 3,
            "& .MuiStepLabel-label": {
              typography: "subtitle1",
              color: "text.secondary",
            },
            "& .Mui-active .MuiStepLabel-label": {
              color: "primary.main",
              fontWeight: "bold",
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box
          sx={{
            p: 3,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          {activeStep === 0 && (
            <Box>
              <TextField
                label="Shares"
                type="number"
                size="medium"
                value={shares}
                onChange={handleSharesChange}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 1,
                  },
                }}
              />
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Purchase Summary
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1">Stock Price: </Typography>
                <Typography variant="body1">
                  <strong>{formatCurr(stock.price)}</strong>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1">Total Purchase Amount:</Typography>
                <Typography variant="body1">
                  <strong>{formatCurr(shares * stock.price)}</strong>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1">Current Total Balance:</Typography>
                <Typography variant="body1">
                  <strong>{formatCurr(portfolio.available)}</strong>
                </Typography>
              </Box>

              <Alert severity="warning" sx={{ mt: 2 }}>
                You are about to {TransactionTypeMap[type]}{" "}
                <strong>{shares}</strong> shares of{" "}
                <strong>{stock.name}</strong> at{" "}
                <strong>{formatCurr(stock.price)}</strong> per share. Are you
                sure?
              </Alert>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Total: {formatCurr(shares * stock.price)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button onClick={handleCancel} color="error" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={handleBuy}
            color="success"
            variant="contained"
            loadingPosition="start"
            disabled={loading || portfolio.available < shares * stock.price}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  mr: 1,
                  color: (theme) => theme.palette.common.white,
                }}
              />
            ) : null}
            Purchase
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Buy;
