import { useEffect, useState } from "react"

export default () => {
  const [rangeFrom, setRangeFrom] = useState(0)
  const [rangeTo, setRangeTo] = useState(0)
  const [numbersNum, setNumbersNum] = useState(0)
  const [seed, setSeed] = useState(0)
  const [generatedNumbers, setGeneratedNumbers] = useState()
  const [method, setMethod] = useState(0)
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [m, setM] = useState(0)
  const [xAxis, setXAxis] = useState()
  const [freqTest100, setFreqTest100] = useState()
  const [freqTest1000, setFreqTest1000] = useState()
  const [correlationArray, setCorrelationArray] = useState()

  const middleSquareRandom = (seed) => {
    let random = seed * seed
    random = random.toString().padStart(8, "0")
    const middle = random.substring(2, 6)
    random = parseInt(middle)
    const normalized = random / 10000
    return normalized
  }
  const middleProductRandom = (seed) => {
    let random = seed * seed
    const str = random.toString()
    const length = str.length
    const middleIndex = Math.floor(length / 2)
    const middleDigits = length % 2 === 0 ? str.substr(middleIndex - 1, 2) : str.charAt(middleIndex)
    random = parseInt(middleDigits)
    const normalized = random / Math.pow(10, middleDigits.length)
    return normalized
  }
  const mixingRandom = (seed) => {
    const random = seed * seed
    const middleSquareRandom = random / Math.pow(10, Math.floor(Math.log10(random)) + 1)
    const mathRandom = Math.random()
    const mixedRandom = (middleSquareRandom + mathRandom) / 2
    return mixedRandom
  }
  const linearCongruentialRandom = (seed, a, b, m) => {
    let random = seed
    random = (a * random + b) % m
    const normalized = random / m
    return normalized
  }
  const frequencyTest = (N) => {
    const dots = []
    for(let i=0; i<N; i++){
      const currSeed = Math.random() * 10000
      if(method === 0) dots.push(middleSquareRandom(currSeed))
      else if(method === 1) dots.push(middleProductRandom(currSeed))
      else if(method === 2) dots.push(mixingRandom(currSeed))
      else if(method === 3) dots.push(linearCongruentialRandom(currSeed, a, b, m))
      else if(method === 4) dots.push(Math.random())
    }
    const rangeCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < dots.length; i++) {
      const value = dots[i]
      if (value < 0.1) rangeCount[0]++
      else if (value < 0.2) rangeCount[1]++
      else if (value < 0.3) rangeCount[2]++
      else if (value < 0.4) rangeCount[3]++
      else if (value < 0.5) rangeCount[4]++
      else if (value < 0.6) rangeCount[5]++
      else if (value < 0.7) rangeCount[6]++
      else if (value < 0.8) rangeCount[7]++
      else if (value < 0.9) rangeCount[8]++
      else if (value < 1) rangeCount[9]++
    }
    return rangeCount
  }
  const correlationAnalysis = () => {
    let correlationArr = []
    
    for(let N=5; N<1000; N++){
      const numbers = []
      for(let i=0; i<=N; i++){
        const currSeed = Math.random() * 10000
        if(method === 0) numbers.push(middleSquareRandom(currSeed))
        else if(method === 1) numbers.push(middleProductRandom(currSeed))
        else if(method === 2) numbers.push(mixingRandom(currSeed))
        else if(method === 3) numbers.push(linearCongruentialRandom(currSeed, a, b, m))
        else if(method === 4) numbers.push(Math.random())
      }
      const n = numbers.length
      let sumX = 0
      let sumY = 0
      let sumXY = 0
      let sumX2 = 0
      let sumY2 = 0
      for (let i = 0; i < n && numbers[i]; i++) {
        sumX += numbers[i]
        sumY += numbers[(i + 1) % n]
        sumXY += numbers[i] * numbers[(i + 1) % n]
        sumX2 += numbers[i] ** 2
        sumY2 += numbers[(i + 1) % n] ** 2
      }
      const numerator = n * sumXY - sumX * sumY
      const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2))
      const correlation = numerator / denominator
      correlationArr.push(correlation)
    }

    setCorrelationArray(correlationArr)
  }

  const generateNumbers = (e) => {
    e.preventDefault()

    // dots
    const gap = (rangeTo-rangeFrom)/numbersNum
    const dots = []
    for(let x=parseFloat(rangeFrom); x<=parseFloat(rangeTo); x+=parseFloat(gap)){
      const currSeed = Math.random() * 10000
      if(method === 0) dots.push({x, y: middleSquareRandom(currSeed)})
      else if(method === 1) dots.push({x, y: middleProductRandom(currSeed)})
      else if(method === 2) dots.push({x, y: mixingRandom(currSeed)})
      else if(method === 3) dots.push({x, y: linearCongruentialRandom(currSeed, a, b, m)})
      else if(method === 4) dots.push({x, y: Math.random()})
    }
    setFreqTest100(frequencyTest(100))
    setFreqTest1000(frequencyTest(1000))
    correlationAnalysis()
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
          <div className="range-inputs">
            <input type="number" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} />
            <input type="number" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} />
          </div>
          <label>Количество чисел</label>
          <input type="number" value={numbersNum} onChange={(e) => setNumbersNum(e.target.value)} />
          <label>Сид</label>
          <input type="number" value={seed} onChange={(e) => setSeed(e.target.value)} />
          <label style={{ display: method === 3 ? "unset" : "none" }}>a</label>
          <input style={{ display: method === 3 ? "unset" : "none" }} type="number" value={a} onChange={(e) => setA(e.target.value)} />
          <label style={{ display: method === 3 ? "unset" : "none" }}>b</label>
          <input style={{ display: method === 3 ? "unset" : "none" }} type="number" value={b} onChange={(e) => setB(e.target.value)} />
          <label style={{ display: method === 3 ? "unset" : "none" }}>m</label>
          <input style={{ display: method === 3 ? "unset" : "none" }} type="number" value={m} onChange={(e) => setM(e.target.value)} />
          <label>Метод</label>
          <div className="methods">
            <input type="radio" name="method" id="radio1" checked={method === 0 ? true : false} onChange={e => { if(e.target.checked) setMethod(0) }} />
            <label htmlFor="radio1">Срединных квадратов</label>
            <input type="radio" name="method" id="radio2" checked={method === 1 ? true : false} onChange={e => { if(e.target.checked) setMethod(1) }} />
            <label htmlFor="radio2">Срединных произведений</label>
            <input type="radio" name="method" id="radio3" checked={method === 2 ? true : false} onChange={e => { if(e.target.checked) setMethod(2) }} />
            <label htmlFor="radio3">Метод перемешивания</label>
            <input type="radio" name="method" id="radio4" checked={method === 3 ? true : false} onChange={e => { if(e.target.checked) setMethod(3) }} />
            <label htmlFor="radio4">Линейный конгруэнтный</label>
            <input type="radio" name="method" id="radio5" checked={method === 4 ? true : false} onChange={e => { if(e.target.checked) setMethod(4) }} />
            <label htmlFor="radio5">JavaScript</label>
          </div>
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
                  [0, 0.2, 0.4, 0.6, 0.8, 1].map(y => (
                    <div key={`y_${y}`}>{ y }</div>
                  ))
                }
              </div>
            </div>
            {
              generatedNumbers.map((generatedNumber, i) => {
                if(generatedNumber.y) return (
                  <div className="dot" style={{
                    left: `${i / generatedNumbers.length * 100}%`,
                    bottom: `${generatedNumber.y * 100}%`
                  }} key={`{${generatedNumber.x}, ${generatedNumber.y}}`} />
                )
              })
            }
          </div>
        }

        {/* Generated numbers */}
        {
          generatedNumbers && <div className="col nums">
            {
              generatedNumbers.map(generatedNumber => {
                if(generatedNumber.y) return (
                  <p key={generatedNumber.x}>{ generatedNumber.y }</p>
                )
              })
            }
          </div>
        }

      </div>





      <div className="container">
        {/* Freq Test 100 */}
        {
          freqTest100 && <div className="graph">
            <div className="bg">
              <div className="vertical"><div/><div/><div/><div/></div>
              <div className="horizontal"><div/><div/><div/><div/></div>
            </div>
            <div className="axis">
              <div className="x">
                {
                  [0, 0.2, 0.4, 0.6, 0.8, 1].map(y => (
                    <div key={`x_${y}`}>{ y }</div>
                  ))
                }
              </div>
            </div>
            {
              freqTest100.map((freqTestNum, i) => (
                <div className="dot" style={{
                  left: `${i / freqTest100.length * 100}%`,
                  bottom: `${freqTestNum * 4}%`
                }} key={`freq_${i}`}>
                  <span>{freqTestNum}</span>
                </div>
              ))
            }
          </div>
        }
        {/* Freq Test 1000 */}
        {
          freqTest1000 && <div className="graph">
            <div className="bg">
              <div className="vertical"><div/><div/><div/><div/></div>
              <div className="horizontal"><div/><div/><div/><div/></div>
            </div>
            <div className="axis">
              <div className="x">
                {
                  [0, 0.2, 0.4, 0.6, 0.8, 1].map(y => (
                    <div key={`x_${y}`}>{ y }</div>
                  ))
                }
              </div>
            </div>
            {
              freqTest1000.map((freqTestNum, i) => (
                <div className="dot" style={{
                  left: `${i / freqTest100.length * 100}%`,
                  bottom: `${freqTestNum / 2.5}%`
                }} key={`freq_${i}`}>
                  <span>{freqTestNum}</span>
                </div>
              ))
            }
          </div>
        }
        {/* Correlation */}
        {
          correlationArray && <div className="graph">
            <div className="bg">
              <div className="vertical"><div/><div/><div/><div/></div>
              <div className="horizontal"><div/><div/><div/><div/></div>
            </div>
            <div className="axis">
              <div className="x">
                {
                  [0, 200, 400, 600, 800, 1000].map(y => (
                    <div key={`x_${y}`}>{ y }</div>
                  ))
                }
              </div>
            </div>
            {
              correlationArray.map((correlationArrayNum, i) => (
                <div className="dot" style={{
                  left: `${i / correlationArray.length * 100}%`,
                  bottom: `${correlationArrayNum * 50}%`
                }} key={`corr_${i}`} />
              ))
            }
          </div>
        }
      </div>
    </main>
  )
}