import { useState, useEffect } from 'react'
import Chaos from './stages/Chaos'
import Aggregation from './stages/Aggregation'

const stages = ["chaos", "aggregation", "qualification", "call", "dashboard", "contrast"]

function DemoController() {
  const [stageIndex, setStageIndex] = useState(0)
  const currentStage = stages[stageIndex]

  useEffect(() => {
    const duration = currentStage === 'chaos' ? 10000 : currentStage === 'aggregation' ? 8000 : 4000
    const timeout = setTimeout(() => {
      setStageIndex((prev) => (prev + 1) % stages.length)
    }, duration)
    return () => clearTimeout(timeout)
  }, [stageIndex, currentStage])

  const renderStage = () => {
    if (currentStage === 'chaos') {
      return <Chaos />
    }
    if (currentStage === 'aggregation') {
      return <Aggregation />
    }
    return currentStage
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw'
    }}>
      {renderStage()}
    </div>
  )
}

export default DemoController
