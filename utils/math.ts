import { Txn } from '@/db/txn'

//bad because depends on USD and shares txns being right next to each other?
export function calculateValuation(txns: Txn[], founder_portion: number) {
  let i = txns.length - 1
  let price_usd = 0
  let num_shares = 0
  while (i > 0) {
    if (txns[i].project) {
      if (txns[i].token == 'USD') {
        price_usd = txns[i].amount
        if (
          txns[i - 1].project == txns[i].project &&
          txns[i - 1].token != 'USD' &&
          txns[i - 1].from_id == txns[i].to_id &&
          txns[i - 1].to_id == txns[i].from_id
        ) {
          num_shares = txns[i - 1].amount
          return (price_usd / num_shares) * (10000000 - founder_portion)
        }
      } else {
        num_shares = txns[i].amount
        if (
          txns[i - 1].project == txns[i].project &&
          txns[i - 1].token == 'USD' &&
          txns[i - 1].from_id == txns[i].to_id &&
          txns[i - 1].to_id == txns[i].from_id
        ) {
          price_usd = txns[i - 1].amount
          return (price_usd / num_shares) * (10000000 - founder_portion)
        }
      }
    }
    i--
  }
  return -1
}
