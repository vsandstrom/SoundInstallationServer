<template>
  <div>
    <h1>
      Play
    </h1>
    <div v-if="ws">
      <h1>Vi är kopplade!</h1>
      <div v-for="(slider) in this.sliders" :key="slider.name">
        <div>
          {{slider.name}}: {{slider.currentValue}}
        </div>
        <div>
          <input v-model="slider.currentValue" @input="updateSlider(slider)"  type="range" min="0" :max="slider.max" name="change"/>
        </div>
      </div>
      <div>
        <button @mouseup="updateReset(buttons[0])">{{buttons[0].label}}</button>
        <button @mouseup="updateSmudge(buttons[1])">{{buttons[1].label}}</button>
      </div>
      <!-- <label v-for="(slider) in sliders" :key="slider.name">
      </label> -->

      <!-- <input v-model="extraSlider" type="range" min="0" max="500" />
      <input v-model="extraSlider" /> -->

      <button @click="disconnect">Get out!</button>

    </div>
    <button v-else @click="connect">Connect</button>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data () {
    return {
      sliders: [
        {
          name: 'size',
          max: 15000,
          currentValue: 0
        },
        {
          name: 'changes',
          max: 250,
          currentValue: 0
        }
      ],
      buttons: [
        {
          name: 'reset',
          currentValue: 0,
          label: 'stopAndReset'
        },
        {
          name: 'smudge',
          currentValue: 0,
          label: 'smudgeIsOff'
        }
      ],
      extraSlider: 300,
      ws: undefined
    }
  },
  methods: {
    connect () {
      // Lets do websocketss!!!
      const url = `${window.location.host}`
      let tempSocket = new WebSocket(`ws://${url}`)
      setTimeout(() => {
        this.ws = tempSocket
      }, 1500)
      tempSocket.onclose = (ev) => {
        console.log('socket was closed!!')
        this.ws = undefined
        tempSocket = undefined
      }

      tempSocket.onopen = (ev) => {
        console.log('socket was opened!')
      }
    },
    disconnect () {
      if (!this.ws) { throw new Error('whaaat the fuuck! ws is undefined!') }
      this.ws.close()
    },
    updateSlider (slider) {
      console.log('updateslider with', slider)
      // console.log('value is:', event.target.value)
      const val = parseInt(slider.currentValue)
      const msg = JSON.stringify([slider.name, { val }])
      console.log(msg)
      this.ws.send(msg)
    },
    updateSmudge (button) {
      let val
      if (button.currentValue) {
        val = parseInt(button.currentValue)
        button.currentValue = 0
        button.label = 'smudgeOn'
      } else {
        val = parseInt(button.currentValue)
        button.currentValue = 1
        button.label = 'smudgeOff'
      }
      this.ws.send(JSON.stringify([button.name, { val }]))
    },

    updateReset (button) {
      let val = 1

      this.ws.send(JSON.stringify([button.name, { val }]))
      button.label = 'RESETTING'

      setTimeout(function () {
        button.label = 'stopReset'
        // button trigger delay
        val = 0
        this.ws.send(JSON.stringify(['reset', { val }]))
      }, 0.5e3)
    }
  }
}
</script>
