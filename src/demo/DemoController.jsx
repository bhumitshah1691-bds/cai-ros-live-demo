import { useState, useEffect } from 'react'
import Chaos from './stages/Chaos'

const stages = ["chaos", "aggregation", "qualification", "call", "dashboard", "contrast"]

function DemoController() {
  const [stageIndex, setStageIndex] = useState(0)
  const currentStage = stages[stageIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const renderStage = () => {
    if (currentStage === 'chaos') {
      return <Chaos />
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
