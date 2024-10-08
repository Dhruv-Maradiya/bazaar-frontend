import TransactionsView from "@/components/transactions/TransactionsView";
import { useAuth } from "@/hooks/useAuth";

const Transaction = () => {
  const { user } = useAuth();

  return <TransactionsView userId={user.uid} />;
};

export default Transaction;
