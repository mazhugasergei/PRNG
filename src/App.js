import { useState } from "react"

export default () => {
  const [rangeFrom, setRangeFrom] = useState(0)
  const [rangeTo, setRangeTo] = useState(0)
  const [numbersNum, setNumbersNum] = useState(0)
  const [generatedNumbers, setGeneratedNumbers] = useState()
  const [xAxis, setXAxis] = useState()
  const [yAxis, setYAxis] = useState([0, 0.2, 0.4, 0.6, 0.8, 1])

  const generateNumbers = (e) => {
    e.preventDefault()

    // dots
    const gap = (rangeTo-rangeFrom)/numbersNum
    const dots = []
    for(let x=parseFloat(rangeFrom); x<=parseFloat(rangeTo); x+=parseFloat(gap)) dots.push({x, y: Math.random()})
    setGeneratedNumbers(dots)

    // x axis
    const xAxisArr = []
    for(let i=0; i<=5; i++){
      const num = (parseFloat(rangeTo) - parseFloat(rangeFrom)) / 5 * i + parseFloat(rangeFrom)
      if(num !== Math.floor(num)) xAxisArr.push(num.toFixed(2))
      else xAxisArr.push(num)
    }
    setXAxis(xAxisArr)
  }

  return (
    <main>
      <div className="container">

        {/* Form */}
        <form onSubmit={generateNumbers}>
          <label>Интервал</label>
          <div className="inputs">
            <input type="number" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} />
            <input type="number" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} />
          </div>
          <label>Количество чисел</label>
          <input type="number" value={numbersNum} onChange={(e) => setNumbersNum(e.target.value)} />
          <button>Сгенерировать</button>
        </form>

        {/* Graph */}
        {
          generatedNumbers && <div className="graph">
            <div className="bg">
              <div className="vertical"><div/><div/><div/><div/></div>
              <div className="horizontal"><div/><div/><div/><div/></div>
            </div>
            <div className="axis">
              <div className="x">
                {
                  xAxis && xAxis.map(x => (
                    <div key={`x_${x}`}>{ x }</div>
                  ))
                }
              </div>
              <div className="y">
                {
                  yAxis && yAxis.map(y => (
                    <div key={`y_${y}`}>{ y }</div>
                  ))
                }
              </div>
            </div>
            {
              generatedNumbers.map((generatedNumber, i) => (
                <div className="dot" style={{
                  left: `${i / generatedNumbers.length * 100}%`,
                  bottom: `${generatedNumber.y * 100}%`
                }} key={`{${generatedNumber.x}, ${generatedNumber.y}}`} />
              ))
            }
          </div>
        }

        {/* Generated numbers */}
        {
          generatedNumbers && <div className="col nums">
            {
              generatedNumbers.map(generatedNumber => (
                <p key={generatedNumber.x}>{ generatedNumber.y }</p>
              ))
            }
          </div>
        }

      </div>
    </main>
  )
}