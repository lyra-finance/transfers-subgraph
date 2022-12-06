import { PositionTraded } from '../generated/templates/OptionMarketWrapper/OptionMarketWrapper'
import { User } from '../generated/schema'

//Handles external swap fees
export function handlePositionTraded(event: PositionTraded): void {
    let userAddress = event.params.owner.toHex()
    let user = User.load(userAddress)
    if(user == null){
        user = new User(userAddress)
        user.save()
    }
}