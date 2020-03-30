import React from 'react'
import { Line } from '@/components/Charts'

const Statistic: React.FC<{}> = () => {
    const LineProps = {
        data: [
            {
                day: '20200320',
                value: 1
            }
        ],
        xField: 'day',
        yField: 'value',
        title: {
            visible: true,
            text: '日浏览量'
        }
    }
    return (<div>
        <Line {...LineProps} />
    </div>)
}

export default Statistic