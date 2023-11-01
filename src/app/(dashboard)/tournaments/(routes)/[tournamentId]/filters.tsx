import {DatePickerWithRange} from "@/components/ui/date-range-with-picker";
import {Button} from "@/components/ui/button";
import {DateRange} from "react-day-picker";
import {useState} from "react";

interface FiltersProps {
    onApply: (filters: any) => void
}

const Filters = ({ onApply }: FiltersProps) => {
    const initFilters = {
        from: null,
        to: null,
    }
    const [filters, setFilters] = useState<any>(initFilters)
    const handleDateChange = (values: DateRange | undefined) => {
        setFilters({
            ...filters,
            ...values,
        })
    }

    const handleApply = () => {
        onApply && onApply(filters)
    }

    const handleClear = () => {
        setFilters({...initFilters})
        onApply({...initFilters})
    }

    return (
        <div className='flex row gap-3 items-center'>
            <DatePickerWithRange onChange={handleDateChange} from={filters?.from} to={filters?.to} />
            <Button onClick={handleApply}>
                Apply
            </Button>
            <Button onClick={handleClear} variant='secondary'>
                Clear
            </Button>
        </div>
    )
}

export default Filters