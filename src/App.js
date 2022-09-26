import axios from "axios";
import React, {useState, useEffect, useRef} from "react";
import isObjEmpty from "./libs/isObjEmpty";

import './style/App.scss';

function App() {
  const BASE_URL = 'http://demo7919674.mockable.io/';
  const [mode, setMode] = useState([]);
  const [activeMode, setActiveMode] = useState({});
  const [datalist, setDatalist] = useState(false);
  const [start, setStart] = useState(false);
  const [error, setError] = useState(false)

  // const data = [
  //   {
  //     name: 'Easy',
  //     field: 5
  //   },
  //   {
  //     name: 'Normal',
  //     field: 15
  //   },
  //   {
  //     name: 'Hard',
  //     field: 25
  //   },
  // ]
  // useEffect(() => {
  //   if (mode.length === 0) {
  //     setMode(data)
  //   }
  // })

  useEffect(() => {
    if (mode.length === 0) {
      axios.get(BASE_URL).then((response) => {
        setMode(response.data);
      });
    }
  });



  useEffect(() => {
    const timeout = setTimeout(() => setError(false), 600)

    return () => clearTimeout(timeout)
  }, [error])


  const [activeItems, setActiveItems] = useState([])
  const itemEls = useRef([])

  const changeMode = (newMode) => {
    activeItems.forEach(el => el.classList.remove('active'))
    setActiveItems([])
    setStart(false)
    setActiveMode(newMode)
  }

  // console.log(activeItems, itemEls)
  const saveActiveItems = () => {
    setActiveItems(itemEls.current.filter(el => el.classList.contains('active')))
  }

  const refArr = (el) => {
    if (itemEls.current.length > Math.pow(activeMode.field, 2)) {
      itemEls.current.splice(0, itemEls.current.length)
    }
    if (itemEls.current.length < Math.pow(activeMode.field, 2)) {
      itemEls.current.push(el)
    }
    console.log(activeMode.field, itemEls.current)
  }


  return (
    <div className='app'>
      <div
          className="container"
          onClick={() => setDatalist(false)}
      >
        <div className='app__wrap'>
          <div className='app__left'>
            <div className='app__select-wrap'>
              <div
                  className={'app__select' + (datalist ? ' active ' : '') + (error ? ' trigger ' : '')}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDatalist(!datalist)
                  }}
              >
                <span>
                  {isObjEmpty(activeMode) ? 'Pick mode' : activeMode?.name}
                </span>

                <ul className='app__select-list'>
                  {mode.length !== 0 && mode.map((el, i) =>
                      <li
                          key={i}
                          onClick={() => changeMode(el)}
                      >
                        {el?.name}
                      </li>
                  )}
                </ul>
              </div>

              <button onClick={() => {
                if (isObjEmpty(activeMode)) {
                  setError(true)
                } else {
                  setStart(true)
                }
              }}>
                start
              </button>
            </div>

            <table><thead/><tbody>
              {(isObjEmpty(activeMode) || !start)
                  ? <></>
                  : [...Array(activeMode.field)]?.map((row, rowKey) =>
                      <tr key={rowKey}>
                        {[...Array(activeMode.field)]?.map((el, elKey) =>
                            <td key={elKey}>
                              <div
                                ref={(el) => refArr(el)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.classList.toggle('active')
                                  saveActiveItems()
                                }}
                              />
                            </td>
                        )}
                      </tr>
                  )
              }
            </tbody><tfoot/></table>
          </div>

          <div className='app__right'>
            <h2>Hover squares</h2>

            <div className='app__right-hoverList'>
              {activeItems.map((block, i) => {
                const index = itemEls.current.indexOf(block)
                const col = index % activeMode.field + 1
                const row = Math.trunc(index / activeMode.field) + 1

                return (
                    <span key={i}> row {row} col {col}</span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App