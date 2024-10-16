import { sellStock } from "@/store/settings/user";
import { formatCurr } from "@/utils/format-number";
import {
  TransactionTypeMap,
  TransactionTypeMapSellMap,
} from "@/utils/timestamp";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
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
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const steps = ["Enter Details", "Confirm Sale"];

const Sell = ({ stock, open, handleClose, type }) => {
  const [shares, setShares] = useState(1);
  const [activeStep, setActiveStep] = useState(0);

  const portfolio = useSelector((state) => state.firestore.data.firestoreUser);
  const dispatch = useDispatch();

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

  const handleSell = async () => {
    if (activeStep === 0) {
      if (parseInt(shares) > currentHoldings.shares) {
        toast.error("Quantity can not exceed current holdings!");
      } else {
        setActiveStep(1);
      }
    } else {
      let results = await dispatch(
        sellStock({
          stockId: stock.id,
          shares: parseInt(shares),
          type,
          userId: portfolio.id,
          price: stock.price,
          profitOrLoss: profitLoss,
          brokerage,
        })
      );

      unwrapResult(results);

      _handleClose();
    }
  };

  const { currentHoldings, profitLoss, currentValue, saleAmount, brokerage } =
    useMemo(() => {
      const currentHoldings = portfolio?.data?.find(
        (item) =>
          item.stock.id === stock.id &&
          item.type === TransactionTypeMapSellMap[type]
      );

      const totalValue = currentHoldings?.shares * currentHoldings?.price;
      const currentValue = currentHoldings?.shares * stock.price;
      const saleAmount = shares * stock.price;
      const profitLoss =
        (shares * stock.price - shares * currentHoldings?.price) *
        (type === "SELL" ? 1 : -1);
      const brokerage = Math.min((0.05 * saleAmount) / 100, 20);

      return {
        currentHoldings,
        profitLoss,
        totalValue,
        currentValue,
        saleAmount,
        brokerage,
      };
    }, [portfolio?.data, shares, stock.id, stock.price, type]);

  const content = currentHoldings ? (
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
              variant="outlined"
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
              sx={{ mb: 3 }}
            />
            <Typography variant="body1">
              Current Holdings: <strong>{currentHoldings.shares}</strong> shares
              at <strong>{formatCurr(currentHoldings.price)}</strong> per share
            </Typography>
            <Typography variant="body1">
              Total Value: <strong>{formatCurr(currentValue)}</strong>
            </Typography>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Sale Summary
            </Typography>
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
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body1">Sale Amount: </Typography>
              <Typography variant="body1">
                <strong>{formatCurr(saleAmount)}</strong>
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
              <Typography variant="body1">Profit/Loss:</Typography>
              <Typography variant="body1">
                <strong>{formatCurr(profitLoss)}</strong>
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
              <Typography variant="body1">Brokerage:</Typography>
              <Typography variant="body1">
                <strong>{formatCurr(brokerage)}</strong>
              </Typography>
            </Box>

            <Alert severity="warning" sx={{ mt: 2 }}>
              You are about to {TransactionTypeMap[type]}{" "}
              <strong>{shares}</strong> shares of <strong>{stock.name}</strong>{" "}
              at <strong>{formatCurr(stock.price)}</strong> per share. Are you
              sure?
            </Alert>
          </Box>
        )}
      </Box>
    </DialogContent>
  ) : (
    <DialogContent>
      <Typography variant="body1">
        You do not own any shares of <strong>{stock.name}</strong>.
      </Typography>
    </DialogContent>
  );

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
      {content}
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 3,
        }}
      >
        {currentHoldings ? (
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Total: {formatCurr(shares * stock.price + brokerage)}
          </Typography>
        ) : null}
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button onClick={handleCancel} color="error" variant="contained">
            Cancel
          </Button>
          {currentHoldings ? (
            <Button onClick={handleSell} color="success" variant="contained">
              {TransactionTypeMap[type]}
            </Button>
          ) : null}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Sell;
