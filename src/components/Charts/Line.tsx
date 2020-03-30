import React, { useEffect }  from 'react'
import { Line } from '@antv/g2plot'
import { ChartBasicProps } from './data.d'

export interface LineChartProps extends ChartBasicProps{
    data: object[],
}

const LineChart: React.FC<LineChartProps> = ({
    data=[],
    xField,
    yField,
    ...props
}) => {

    useEffect(() => {
        renderLine()
    }, [])

    const renderLine = () => {
        const lineCtx = new Line('line', {
            data,
            xField,
            yField,
            ...props
        })
        lineCtx.render()
    }

    return (<div id='line' />)
}

export default LineChart