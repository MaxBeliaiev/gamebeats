import {Plus} from "lucide-react";
import TraumaBlock from "@/app/(dashboard)/matches/(routes)/[matchId]/trauma-block";

interface RoundFormProps {
    round: number
    competitors: Array<{
        label: string
        value: string
    }>
}
const RoundForm = ({ round, competitors }: RoundFormProps) => {
    return (
        <div className='flex flex-row gap-1.5'>
            {
                competitors.map(competitor => (
                    <div className='w-1/2' key={competitor.value}>
                        <h3 className='text-center mb-3 font-semibold'>{competitor.label}</h3>
                        <TraumaBlock subject='Head' />
                        <TraumaBlock subject='Body' />
                        <TraumaBlock subject='R. Leg' />
                        <TraumaBlock subject='L. Leg' />
                        <div className='flex flex-row justify-center items-center'>Stamina</div>
                    </div>
                ))
            }
        </div>
    )
}

export default RoundForm