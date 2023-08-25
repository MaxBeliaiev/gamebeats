import {Plus} from "lucide-react";

interface TraumaBlockProps {
    subject: string
}

const TraumaBlock = ({ subject }: TraumaBlockProps) => (
    <div className='flex flex-row mb-1 justify-center'>
        <div className='w-1/2 flex flex-row gap-3'>
            <Plus color='red' /> <div>{subject}</div>
        </div>
    </div>
)

export default TraumaBlock