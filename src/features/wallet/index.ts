/** Public surface for the wallet feature: wallet page widget plus balance
 * and transaction queries consumed by the storefront chrome. */
export { WalletPage } from "./pages/WalletPage.page";
export {
  useWalletBalance,
  useWalletTransactions,
  walletKeys,
  invalidateWalletQueries,
} from "./api/wallet.queries";
