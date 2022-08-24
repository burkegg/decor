import React, {useEffect, useRef, useState} from 'react'
import * as p5 from "p5";

import {Balls} from './tBalls'
import MyWorker from './gravcalc.worker'

const GravitySim = () => {
  let worker;
  let balls;
  const [animationInfo, setAnimationInfo] = useState();
  const [balldata, setBallData] = useState();
  const sketchRef = useRef();
  const Sketch = p => {

    p.setup = () => {
      // setup initial canvas
      p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.background(0);
    }


    p.draw = () => {
      // get ball locs and draw them

    }

  }


  // initial setup stuff
  useEffect(() => {
    new p5(Sketch, sketchRef.current);
    balls = new Balls(400);
    worker = new MyWorker();
    worker.addEventListener('message', event => {
      this.setState({
        animationInfo: event.data,
        awaitingData: false,
      })
    })
    return () => {
      worker.terminate()
    }
  }, [])

  // update ball position
  useEffect(() => {
    let data = balls.getBalls()
    setBallData({animationInfo: data, initPositions: [...data]})
  })

  // get random starting positions
  const initBalls = () => {
    balls.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000, color: 'yellow'})
    balls.addBall({x: 870, y: 500, Vx: 0, Vy: -25, mass: 20, color: 'aqua'})
    balls.addBall({x: 890, y: 500, Vx: 0, Vy: -10, mass: 1, color: 'springGreen'})
  }


  return <div ref={sketchRef} />;

}