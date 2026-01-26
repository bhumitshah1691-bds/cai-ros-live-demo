import { useState, useEffect } from 'react'

const stages = ["chaos", "aggregation", "qualification", "call", "dashboard", "contrast"]

function DemoController() {
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw'
    }}>
      {stages[stageIndex]}
    </div>
  )
}

export default DemoController
