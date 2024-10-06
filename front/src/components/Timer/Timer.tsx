import moment from 'moment'
import React, { useState, useEffect } from 'react'

interface IProps {
  finishTime: string
  onFinish?: () => void
}

export const Timer: React.FC<IProps> = ({ finishTime, onFinish }) => {
  const [duration, setDuration] = useState<string>()

  const tick = () => {
    const currentTime = moment(new Date())
    const finTime = moment(finishTime)
    const durationDays = finTime.diff(currentTime, 'days')
    const durationAllHours = finTime.diff(currentTime, 'hours')
    const durationAllMinutes = finTime.diff(currentTime, 'minutes')
    const durationAllSeconds = finTime.diff(currentTime, 'seconds')
    const durationHours = durationAllHours - durationDays * 24
    const durationMinutes = durationAllMinutes - durationAllHours * 60
    const durationSeconds = durationAllSeconds - durationAllMinutes * 60
    const duration: string = `${durationDays}d ${durationHours}h ${durationMinutes}m ${durationSeconds}s`
    setDuration(duration)

    if (finTime.isSameOrBefore(currentTime)) {
      onFinish?.()
    }
  }

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000)
    return () => clearInterval(timerID)
  }, []) // eslint-disable-line

  return <>{duration}</>
}
