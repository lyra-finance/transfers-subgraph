import { DepositQueued } from '../generated/templates/liquidityPool/LiquidityPool'
import { User } from '../generated/schema'

export function handleDepositQueued(event: DepositQueued): void {
    let userAddress = event.params.beneficiary.toHex()
    let user = User.load(userAddress)
    if(user == null){
        user = new User(userAddress)
        user.save()
    }
}