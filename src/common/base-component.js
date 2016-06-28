import forEach from 'lodash/forEach'
import { Component } from 'react'

import invoke from './invoke'
import shallowEqual from './shallow-equal'

export default class BaseComponent extends Component {
  constructor (props, context) {
    super(props, context)

    // It really should have been done in React.Component!
    this.state = {}

    if (process.env.NODE_ENV !== 'production') {
      this.render = invoke(this.render, render => () => {
        console.log('render', this.constructor.name)

        return render.call(this)
      })
    }
  }

  shouldComponentUpdate (newProps, newState) {
    return !(
      shallowEqual(this.props, newProps) &&
      shallowEqual(this.state, newState)
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  const diff = (name, old, cur) => {
    const keys = []

    forEach(old, (value, key) => {
      if (cur[key] !== value) {
        keys.push(key)
      }
    })

    if (keys.length) {
      console.log(name, keys.sort().join())
    }
  }

  BaseComponent.prototype.componentDidUpdate = function (oldProps, oldState) {
    const prefix = `${this.constructor.name} updated because of its`
    diff(`${prefix} props:`, oldProps, this.props)
    diff(`${prefix} state:`, oldState, this.state)
  }
}